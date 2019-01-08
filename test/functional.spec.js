const got = require('got');

describe('functional', () => {
  let server;

  beforeAll(() => (new Promise((resolve) => {
    server = require('../server'); // eslint-disable-line global-require
    server.events.once('start', resolve);
  })));

  afterAll(() => server.stop());

  function testUrl(path, expectedUrl) {
    it(`resolves ${path} to ${expectedUrl}`, async () => {
      const response = await got(server.info.uri + path);
      const url = JSON.parse(response.body).url;
      expect(url).toBe(expectedUrl);
    });
  }

  testUrl('/q/bower/jquery', 'https://github.com/jquery/jquery-dist');
  testUrl('/q/composer/phpunit/phpunit', 'https://github.com/sebastianbergmann/phpunit');
  testUrl('/q/rubygems/nokogiri', 'https://github.com/sparklemotion/nokogiri');
  testUrl('/q/npm/eslint', 'https://github.com/eslint/eslint');
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
    expect(body[0]).toBe('https://github.com/sebastianbergmann/phpunit');
    expect(body[1]).toBeNull();
    expect(body[2]).toBe('https://nodejs.org/api/path.html');
    expect(body[3]).toBe('https://github.com/request/request');
    expect(body[4]).toBeNull();
    expect(body[5]).toBe('https://github.com/jquery/jquery-dist');
  });
});
