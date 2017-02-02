const assert = require('assert');
const findRepositoryUrl = require('../src/utils/repository-url');

describe('repository url', () => {
  const urls = [
    'github.com/john/doe/',
    'http://github.com/john/doe/',
    'https://github.com/john/doe',
    'https://github.com/john/doe/',
    'https:///github.com/john/doe/',
    'https+git://github.com/john/doe/',
    'https://www.github.com/john/doe/',
    'http://github.com/john/doe/tree/master',
    'https://github.com/john/doe/tree/master',
    'john/doe',
    'john/doe/',
  ];

  urls.forEach((node) => {
    let type = node;
    if (typeof node !== 'string') {
      type = JSON.stringify(node);
    }

    it(`resolves ${type}`, () => {
      assert.equal(findRepositoryUrl(node), 'https://github.com/john/doe');
    });
  });

  const detailUrl = 'https://github.com/john/doe/tree/master/foo';
  it(`resolves ${detailUrl}`, () => {
    assert.equal(findRepositoryUrl(detailUrl), 'https://github.com/john/doe/tree/master/foo');
  });
});
