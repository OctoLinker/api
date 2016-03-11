'use strict';

var assert = require('assert');
var findRepositoryUrl = require('../src/utils/find-repository-url');

xdescribe('get repository url', function() {

  var urls = [
    'https://github.com/john/doe',
    'https://github.com/john/doe/',
    'https:///github.com/john/doe/',
    'https+git://github.com/john/doe/',
    'https://www.github.com/john/doe/',
    'https://github.com/john/doe/tree/master',
    'https://github.com/john/doe/blob/master',
    'https://github.com/john/doe/tree/dev',
    'https://github.com/john/doe/blob/dev',
    'john/doe/',
    {url: 'https://github.com/john/doe'},
    {repository: 'https://github.com/john/doe'},
    {repositories: 'https://github.com/john/doe'},
    {repository: ['https://github.com/john/doe']},
    {repositories: ['https://github.com/john/doe']},
    {repository: {url:'https://github.com/john/doe'}},
    {repository: {path:'https://github.com/john/doe'}},
    {repository: {web:'https://github.com/john/doe'}},
    {repository: {git:'https://github.com/john/doe'}},
    {homepage: 'https://github.com/john/doe'}
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
});
