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

var getRepoURL = function(json) {
  if (typeof json === 'string') {
    return parseURL(json);
  } else if (json.url) {
    return parseURL(json.url);
  } else if (json.path) {
    return parseURL(json.path);
  } else if (json.web) {
    return parseURL(json.web);
  } else if (json.git) {
    return parseURL(json.git);
  }
};

var lookup = function(json) {
  if (Array.isArray(json)) {
    return getRepoURL(json[0]);
  } else {
    return getRepoURL(json);
  }
};

module.exports = function(json) {
  var result = null;

  if (typeof json === 'string') {
    return getRepoURL(json);
  }

  if (json.url) {
    result = lookup(json.url);
  }

  if (!result && json.repository) {
    result = lookup(json.repository);
  }

  if (!result && json.repositories) {
    result = lookup(json.repositories);
  }

  if (!result && json.homepage) {
    result = parseURL(json.homepage);
  }

  return result;
};
