const assert = require('assert');
const got = require('got');
const parallel = require('mocha.parallel');

parallel('functional', () => {
  let server;

  before((done) => {
    server = require('../server'); // eslint-disable-line global-require
    server.events.once('start', done);
  });

  after(() => server.stop());

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
  testUrl('/q/npm/find-project-root', 'https://github.com/kirstein/find-project-root');
  testUrl('/q/pypi/simplejson', 'https://github.com/simplejson/simplejson');
  testUrl('/q/crates/libc', 'https://github.com/rust-lang/libc');
  testUrl('/q/go/k8s.io/kubernetes/pkg/api', 'https://github.com/kubernetes/kubernetes/tree/master/pkg/api');
  testUrl('/q/melpa/zzz-to-char', 'https://github.com/mrkkrp/zzz-to-char');
  testUrl('/q/java/org.apache.log4j.Appender', 'https://www.slf4j.org/api/org/apache/log4j/Appender.html');
  testUrl('/ping?url=https://nodejs.org/api/path.html', 'https://nodejs.org/api/path.html');

  it('resolves /bulk request', async () => {
    const response = await got.post(`${server.info.uri}/bulk`, {
      body: JSON.stringify([
        { type: 'registry', registry: 'composer', target: 'phpunit/phpunit' },
        { type: 'registry', registry: 'npm', target: 'ihopethisdoesnotexist' },
        { type: 'ping', target: 'https://nodejs.org/api/path.html' },
        { type: 'registry', registry: 'npm', target: 'request' },
        { type: 'ping', target: 'http://not.found.org' },
        { type: 'registry', registry: 'bower', target: 'jquery' },
      ]),
    });


    const body = JSON.parse(response.body);
    assert.equal(body[0], 'https://github.com/sebastianbergmann/phpunit');
    assert.equal(body[1], null);
    assert.equal(body[2], 'https://nodejs.org/api/path.html');
    assert.equal(body[3], 'https://github.com/request/request');
    assert.equal(body[4], null);
    assert.equal(body[5], 'https://github.com/jquery/jquery-dist');
  });
});
