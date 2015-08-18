'use strict';

var bower = require('./bower');
var npm = require('./npm');
var composer = require('./composer');

module.exports = function(registryType, pkgName, cb) {

  if (registryType === 'npm') {
    return npm(pkgName, cb);
  } else if (registryType === 'bower') {
    return bower(pkgName, cb);
  } else if (registryType === 'composer') {
    return composer(pkgName, cb);
  }

  cb(new Error('Registry "' + registryType + '" is not supported'));
};
