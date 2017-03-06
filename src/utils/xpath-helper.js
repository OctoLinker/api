const jpath = require('json-path');

function xpathResolver(json, selector) {
  try {
    return jpath.resolve(json, selector);
  } catch (err) {
    return '';
  }
}

module.exports = function (json, xpaths) {
  const results = [];
  for (const selector of xpaths) {
    const result = xpathResolver(json, selector);
    if (result.length && typeof result[0] === 'string' && result[0]) {
      results.push(result[0]);
    }
  }
  return results;
};
