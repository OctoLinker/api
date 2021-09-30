#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const got = require('got');
const jsdom = require('jsdom'); // eslint-disable-line import/no-extraneous-dependencies

const { JSDOM } = jsdom;

const config = [
  'https://junit.org/junit5/docs/current/api/allclasses-index.html',
  'https://www.javadoc.io/static/org.mockito/mockito-core/3.12.4/allclasses-frame.html',
  'https://www.javadoc.io/static/org.mockito/mockito-core/2.12.0/allclasses-frame.html', // The original link 'http://static.javadoc.io/org.mockito/mockito-core/2.12.0/allclasses-frame.html' does not work correctly
  'https://www.slf4j.org/api/allclasses-frame.html',
  'http://hamcrest.org/JavaHamcrest/javadoc/2.0.0.0/allclasses-frame.html',
  'http://fasterxml.github.io/jackson-core/javadoc/2.9/allclasses-frame.html',
  'http://fasterxml.github.io/jackson-databind/javadoc/2.9/allclasses-frame.html',
  'http://fasterxml.github.io/jackson-annotations/javadoc/2.9/allclasses-frame.html',
  'http://hadoop.apache.org/docs/stable/api/allclasses-frame.html',
  'http://projectlombok.org/api/allclasses-frame.html',
  'http://www.atteo.org/static/classindex/apidocs/allclasses-frame.html',
  'https://asm.ow2.io/javadoc/allclasses-index.html',
  'http://hamcrest.org/JavaHamcrest/javadoc/2.2/allclasses-frame.html',
  'http://logback.qos.ch/apidocs/allclasses-frame.html',
  'http://yoyosource.github.io/YAPION/javadoc/v0.25.3/allclasses-index.html',
];

async function loadPage(url) {
  try {
    const { body } = await got(url);
    return new JSDOM(body).window.document;
  } catch (err) {
    console.log(`Could not fetch: ${url}`);
    return new JSDOM('<html></html>').window.document;
  }
}

async function getSpringDocumentationUrls() {
  const urlsToFetch = [];

  const document = await loadPage('https://spring.io/projects');
  const linkNodes = document.querySelector('#filters-and-proj').querySelectorAll('a');
  const allLinks = [];
  linkNodes.forEach((el) => {
    allLinks.push(el.href);
  });

  async function getLinks(link) {
    function next() {
      if (allLinks.length === 0) {
        return Promise.resolve();
      }
      const current = allLinks.shift();
      return getLinks(current);
    }

    const currentDocument = await loadPage(`${link}#learn`);
    if (!currentDocument) {
      return next();
    }
    const learnNode = currentDocument.querySelector('#learn');
    if (!learnNode) {
      return next();
    }
    const currentNode = learnNode.querySelectorAll('a');
    const apiLinks = [];
    currentNode.forEach((el) => {
      const { href } = el;
      if (href.includes('api')) {
        apiLinks.push(href);
      }
    });
    if (apiLinks.length === 0) {
      return next();
    }
    apiLinks.forEach((el) => {
      // Example link: https://docs.spring.io/spring-boot/docs/current/api/allclasses-frame.html
      urlsToFetch.push(`${el.replace('index.html', '')}/allclasses-frame.html`);
      urlsToFetch.push(`${el.replace('index.html', '')}/allclasses-index.html`);
    });

    return next();
  }

  await getLinks(allLinks);

  return urlsToFetch.reverse();
}

async function getClassesUrl(results, url) {
  console.log(url);
  const document = await loadPage(url);
  const baseUrl = url.replace('allclasses-frame.html', '').replace('allclasses-index.html', '');

  let nodes;
  const node = document.querySelector('.allClassesContainer');
  if (node) {
    nodes = [];
    let index = 0;
    while (true) {
      const current = node.querySelector(`#i${index}`);
      if (!current) {
        break;
      }
      nodes.push(current.querySelector('a'));
      index += 1;
    }
  } else {
    nodes = document.querySelectorAll('a');
  }

  if (url === 'https://junit.org/junit5/docs/current/api/allclasses-index.html') {
    nodes = document.querySelector('div.summary-table.two-column-summary').querySelectorAll('a');
  }

  if (nodes) {
    nodes.forEach((el) => {
      const link = el.href;
      if (link.startsWith('http')) {
        return;
      }
      let library = link.replace(/\//g, '.');

      if (library.endsWith('.html')) {
        library = library.slice(0, -5);
      }

      results[library] = `${baseUrl}${link}`;
    });
  }
}

(async () => {
  const fullconfig = config.concat(await getSpringDocumentationUrls());

  const dir = path.join(__dirname, '../src/java/mapping.json');

  const content = {};
  for (const url of fullconfig) {
    await getClassesUrl(content, url); // eslint-disable-line no-await-in-loop
  }

  fs.writeFileSync(dir, JSON.stringify(content, null, ' '));
})();
