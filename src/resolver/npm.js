'use strict';

var util = require('util');
var got = require('got');
var findRepositoryUrl = require('../utils/find-repository-url');
var registryUrl = 'https://registry.npmjs.org/%s';

module.exports = function (path, cb) {

  var components = path.split('/');
  var pkg = components[0];
  var innerPath = components.slice(1).join('/');

  got(util.format(registryUrl, pkg), {json: true}, function (err, json) {
    var url = null;
    if (err) {
      return cb(err);
    }

    if (json) {
      url = findRepositoryUrl(json);
      if (url && innerPath) {
        url += '/blob/master/' + innerPath
      }
    }

    if (!url) {
      url = 'https://npmjs.org/package/' + pkg;
    }

    cb(null, url);
  });
};
