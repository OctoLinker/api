'use strict';

const assert = require('assert');
const got = require('got');

describe('functional', () => {
  let server;

  before(done => {
      server = require('../server');
      server.once('start', done);
  });

  after(done => {
      server.stop(done);
  });

  function testUrl(path, expectedUrl) {
    it(`resolves ${path} to ${expectedUrl}`, (done) => {
      got(server.info.uri + path).then((response) => {
        const url = JSON.parse(response.body).url;
        assert.deepStrictEqual(url, expectedUrl);
        done();
      });
    });
  }

  testUrl('/q/bower/jquery', 'https://github.com/jquery/jquery-dist');
  testUrl('/q/composer/phpunit/phpunit', 'https://github.com/sebastianbergmann/phpunit');
  testUrl('/q/rubygems/nokogiri', 'https://github.com/sparklemotion/nokogiri');
  testUrl('/q/npm/request', 'https://github.com/request/request');
  testUrl('/q/pypi/simplejson', 'https://github.com/simplejson/simplejson');
  testUrl('/q/crates/libc', 'https://github.com/rust-lang/libc');
});
