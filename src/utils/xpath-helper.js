'use strict';

const jpath = require('json-path')

function xpathResolver(json, selector) {
  try {
    return jpath.resolve(json, selector);
  } catch (err) {
    return '';
  }
}

module.exports = function(json, xpaths) {
  for (let selector of xpaths) {
    const result = xpathResolver(json, selector);
    if (result.length && typeof result[0] === 'string') {
      return result[0];
      break;
    }
  }
};
