'use strict';

var util = require('util');
var got = require('got');
var githubUrl = require('github-url-from-git');
var registryUrl = 'http://bower.herokuapp.com/packages/%s';

module.exports = function (pkg, cb) {

	got(util.format(registryUrl, pkg), {json: true}, function (err, json) {
    var url = '';

		if (err) {
			return cb(err);
		}

    if (json && json.url) {
      url = githubUrl(json.url);
    }

		cb(null, url);
	});
};
