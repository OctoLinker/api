const assert = require('assert');
const config = require('../config.json');

describe('config.json', () => {
  const props = ['registry', 'xpaths', 'fallback'];

  for (const key of Object.keys(config)) {
    describe(`${key}`, () => {
      for (const propKey of Object.keys(props)) {
        const prop = props[propKey];
        it(`has "${prop}" property`, () => {
          assert(config[key][prop], `No property ${prop} found for ${key} `);
        });
      }
    });
  }
});
