const assert = require('assert');
const got = require('got');

describe('functional', () => {
  let server;

  before((done) => {
    server = require('../server'); // eslint-disable-line global-require
    server.once('start', done);
  });

  after((done) => {
    server.stop(done);
  });

  function testUrl(path, expectedUrl) {
    it(`resolves ${path} to ${expectedUrl}`, async () => {
      const response = await got(server.info.uri + path);
      const url = JSON.parse(response.body).url;
      assert.deepStrictEqual(url, expectedUrl);
    });
  }

  testUrl('/q/bower/jquery', 'https://github.com/jquery/jquery-dist');
  testUrl('/q/composer/phpunit/phpunit', 'https://github.com/sebastianbergmann/phpunit');
  testUrl('/q/rubygems/nokogiri', 'https://github.com/sparklemotion/nokogiri');
  testUrl('/q/npm/request', 'https://github.com/request/request');
  testUrl('/q/npm/babel-helper-regex', 'https://github.com/babel/babel/tree/master/packages/babel-helper-regex');
  testUrl('/q/npm/audio-context-polyfill', 'https://www.npmjs.com/package/audio-context-polyfill');
  testUrl('/q/npm/github-url-from-username-repo', 'https://github.com/robertkowalski/github-url-from-username-repo');
  testUrl('/q/pypi/simplejson', 'https://github.com/simplejson/simplejson');
  testUrl('/q/crates/libc', 'https://github.com/rust-lang/libc');
  testUrl('/q/go/k8s.io/kubernetes/pkg/api', 'https://github.com/kubernetes/kubernetes/tree/master/pkg/api');
});
