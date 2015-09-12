'use strict';

var util = require('util');
var got = require('got');
var findRepositoryUrl = require('../utils/find-repository-url');
var registryUrl = 'https://registry.npmjs.org/%s';

module.exports = function (pkg, cb) {

  got(util.format(registryUrl, pkg), {json: true}, function (err, json) {
    var url = null;
    if (err) {
      return cb(err);
    }

    if (json) {
      url = findRepositoryUrl(json);
    }

    if (!url) {
      url = 'https://npmjs.org/package/' + pkg;
    }

    cb(null, url);
  });
};
