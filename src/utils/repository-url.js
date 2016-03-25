'use strict';

var githubUrl = require('github-url-from-git');

module.exports = function(url) {
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
  var stripDetails = url.match(/https?:\/\/github.com(\/[^\/]+){2,2}/g);
  if (stripDetails) {
    url = stripDetails[0];
  }

  return githubUrl(url);
};
