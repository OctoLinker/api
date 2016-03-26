'use strict';

const util = require('util');
const got = require('got');
const repositoryUrl = require('../utils/repository-url');
const xpathHelper = require('../utils/xpath-helper')

function buildUrl(url, packageName) {
  return util.format(url, packageName);
}

function doRequest(packageName, config, cb) {
  const url = buildUrl(config.registry, packageName);

  got.get(url, {json: true}, function (err, json) {
    if (err) {
      return cb(err);
    }

    let repo = xpathHelper(json, config.xpaths);
    repo = repositoryUrl(repo);

    if (!repo) {
      repo = buildUrl(config.fallback, packageName);
    }

    cb(null, repo);
  });
}

module.exports = function(config, registryType, packageName, cb) {
  const registryConfig = config[registryType];

  if (!registryConfig) {
    cb(new Error('Registry "' + registryType + '" is not supported'));
    return;
  }

  doRequest(packageName, registryConfig, cb);
};
