'use strict';

const assert = require('assert');
const _ = require('lodash');
const config = require('../config.json');

describe('config.json', () => {
  const props = ['registry', 'xpaths', 'fallback'];

  _.each(config, (item, key) => {
    describe(`${key}`, () => {
      _.each(props, (prop) => {
        it(`has "${prop}" property`, () => {
          assert(item[prop], `No property ${prop} found for ${key} `);
        });
      });
    });
  });
});
