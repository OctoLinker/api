const util = require('util');
const got = require('got');
const isUrl = require('is-url');
const Boom = require('boom');
const repositoryUrl = require('./repository-url');
const xpathHelper = require('./xpath-helper');
const registryConfig = require('../../config.json');

function notFoundResponse() {
  return Boom.notFound('Package not found', {
    eventKey: 'package_not_found',
  });
}

function parseFailedResponse() {
  return Boom.create(500, 'Parsing response failed', {
    eventKey: 'json_parse_failed',
  });
}

function repositoryUrlNotFoundResponse() {
  return Boom.create(500, 'Repository url not found', {
    eventKey: 'repository_url_not_found',
  });
}

module.exports = function doRequest(packageName, type) {
  const config = registryConfig[type];

  const requestUrl = util.format(config.registry, packageName.replace(/\//g, '%2f'));

  return got.get(requestUrl).then((response) => {
    let json;

    try {
      json = JSON.parse(response.body);
    } catch (err) {
      throw parseFailedResponse();
    }

    const bestMatchUrl = xpathHelper(json, config.xpaths);
    let url = repositoryUrl(bestMatchUrl);

    if (!url && isUrl(bestMatchUrl)) {
      url = bestMatchUrl;
    }

    if (!url && config.fallback) {
      url = util.format(config.fallback, packageName);
    }

    if (!url) {
      throw repositoryUrlNotFoundResponse();
    }

    return got.get(url).then(() => url).catch(() => {
      url = util.format(config.fallback, packageName);
      return url;
    });
  }, (err) => {
    if (err.code === 404) {
      throw notFoundResponse();
    }

    throw Boom.wrap(err);
  });
};
