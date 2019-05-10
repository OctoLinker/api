const uniqWith = require('lodash.uniqwith');
const isEqual = require('lodash.isequal');

const registries = require('../registries');

const supportedTypes = ['ping', 'go', 'java', ...registries.supported];

module.exports = function (payload) {
  // Remove invalid items which does not follow format {type:'foo', target: 'bar'}
  // Filter out types which are not supported
  // Remove duplicates
  return uniqWith(payload, isEqual).filter(
    item => item
      && item.target
      && item.target.length
      && supportedTypes.includes(item.type),
  );
};
