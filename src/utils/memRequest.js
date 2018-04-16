const pMemoize = require('mem');
const got = require('got');
const timeunits = require('timeunits');

module.exports = pMemoize(got, { maxAge: timeunits.year });
