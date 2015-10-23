'use strict';

var util = require('util');
var got = require('got');
var githubUrl = require('github-url-from-git');
var registryUrl = 'https://packagist.org/packages/%s.json';

module.exports = function (pkg, cb) {

  got(util.format(registryUrl, pkg), {json: true}, function (err, json) {
    var url = '';

    if (err) {
      return cb(err);
    }

    if (json && json.package && json.package.repository) {
      url = githubUrl(json.package.repository);
    }

    cb(null, url);
  });
};
