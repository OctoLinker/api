#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const got = require('got');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const config = [
  {
    filename: 'junit.json',
    url: 'http://junit.org/junit5/docs/current/api/allclasses-frame.html',
  },
  {
    filename: 'mockito.json',
    url: 'http://static.javadoc.io/org.mockito/mockito-core/2.12.0/allclasses-frame.html',
  },
  {
    filename: 'slf4j.json',
    url: 'https://www.slf4j.org/api/allclasses-frame.html',
  },
  {
    filename: 'hamcrest.json',
    url: 'http://hamcrest.org/JavaHamcrest/javadoc/2.0.0.0/allclasses-frame.html',
  },
  {
    filename: 'jackson-core.json',
    url: 'http://fasterxml.github.io/jackson-core/javadoc/2.9/allclasses-frame.html',
  },
  {
    filename: 'jackson-databind.json',
    url: 'http://fasterxml.github.io/jackson-databind/javadoc/2.9/allclasses-frame.html',
  },
  {
    filename: 'jackson-annotations.json',
    url: 'http://fasterxml.github.io/jackson-annotations/javadoc/2.9/allclasses-frame.html',
  },
];

async function loadPage(url) {
  try {
    const { body } = await got(url);
    return new JSDOM(body).window.document;
  } catch (err) {
    return new JSDOM('<html></html>').window.document;
  }
}

async function getSpringDocumentationUrls() {
  const urlsToFetch = [];
  const document = await loadPage('https://spring.io/docs/reference');

  function findUrl(el, list) {
    const node = el.parentNode.parentNode.querySelector('.api-link');
    if (!node) return;

    let filename = node.pathname.split('/').slice(1, 3).join('-');
    filename += '.json';

    let url = node.href.replace('index.html', '');
    url += 'allclasses-frame.html';

    list.push({
      filename,
      url,
    });
  }

  document.querySelectorAll('.docs--item').forEach((elContainer) => {
    const currentVersionEl = elContainer.querySelector('.icon-current-version');
    const releaseVersionEl = elContainer.querySelector('.icon-ga-release');
    const snapshotVersionEl = elContainer.querySelector('.icon-snapshot-release');

    if (currentVersionEl) {
      findUrl(currentVersionEl, urlsToFetch);
    } else if (releaseVersionEl) {
      findUrl(releaseVersionEl, urlsToFetch);
    } else if (snapshotVersionEl) {
      findUrl(snapshotVersionEl, urlsToFetch);
    }
  });

  return urlsToFetch;
}

async function getClassesUrl(url) {
  const results = {};
  const document = await loadPage(url);
  const baseUrl = url.replace('allclasses-frame.html', '');

  const nodes = document.querySelectorAll('a');
  if (nodes) {
    nodes.forEach((el) => {
      const link = el.href;
      let library = link.replace(/\//g, '.');

      if (library.endsWith('.html')) {
        library = library.slice(0, -5);
      }

      results[library] = `${baseUrl}${link}`;
    });
  }

  return results;
}

(async () => {
  const fullconfig = config
    .concat(await getSpringDocumentationUrls());

  const dir = path.join(__dirname, '../mapping-files');

  fs.removeSync(dir);
  fs.mkdirsSync(dir);

  for (const { filename, url } of fullconfig) {
    const content = await getClassesUrl(url); // eslint-disable-line no-await-in-loop
    const count = Object.keys(content).length;

    if (count > 0) {
      console.log(`Add ${count} libaries to ${filename}`);
      fs.writeJsonSync(path.join(dir, filename), content, { spaces: ' ' });
    }
  }
})();
