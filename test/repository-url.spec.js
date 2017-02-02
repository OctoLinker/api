'use strict';

var assert = require('assert');
var findRepositoryUrl = require('../src/utils/repository-url');

describe('repository url', function() {

  var urls = [
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
    'john/doe/'
  ];

  urls.forEach(function(node) {
    var type = node;
    if (typeof node !== 'string') {
      type = JSON.stringify(node);
    }

    it('resolves ' + type, function() {
      assert.equal(findRepositoryUrl(node), 'https://github.com/john/doe');
    });
  });

  var detailUrl = 'https://github.com/john/doe/tree/master/foo';
  it('resolves ' + detailUrl, function() {
    assert.equal(findRepositoryUrl(detailUrl), 'https://github.com/john/doe/tree/master/foo');
  });
});
