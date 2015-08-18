'use strict';

var githubUrl = require('github-url-from-git');

var parseURL = function(url) {
  if (typeof url !== 'string') {
    return null;
  }

  // Remove last trailing slash
  if (url.slice(-1) === '/') {
    url = url.slice(0, -1);
  }
  // Fix multiple forward slashes
  url = url.replace(/([^:]\/)\/+/g, '$1');

  // Resolve shorthand url to a qualified URL
  if (url.split('/').length === 2) {
    url = 'http://github.com/' + url;
  }

  // Replace and fix invalid urls
  url = url.replace('https+git://', 'git+https://');
  url = url.replace('://www.github.com', '://github.com');

  // Resolve detail link
  var stripDetails = url.match(/https:\/\/github.com(\/[^\/]+){2,2}/g);
  if (stripDetails) {
    url = stripDetails[0];
  }

  return githubUrl(url);
};

var getRepoURL = function(node) {
  if (typeof node === 'string') {
    return parseURL(node);
  } else if (node.url) {
    return parseURL(node.url);
  } else if (node.path) {
    return parseURL(node.path);
  } else if (node.web) {
    return parseURL(node.web);
  } else if (node.git) {
    return parseURL(node.git);
  }
};

var lookup = function(node) {
  if (Array.isArray(node)) {
    return getRepoURL(node[0]);
  } else {
    return getRepoURL(node);
  }
};

module.exports = function(node) {
  var result = null;

  if (typeof node === 'string') {
    return getRepoURL(node);
  }

  if (node.url) {
    result = lookup(node.url);
  }

  if (!result && node.repository) {
    result = lookup(node.repository);
  }

  if (!result && node.repositories) {
    result = lookup(node.repositories);
  }

  if (!result && node.homepage) {
    result = parseURL(node.homepage);
  }

  return result;
};
