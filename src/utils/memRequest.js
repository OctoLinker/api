const pMemoize = require('mem');
const got = require('got');

module.exports = pMemoize(got, { maxAge: 86400000 });
