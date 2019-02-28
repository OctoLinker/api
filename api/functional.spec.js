const http = require('http');
const got = require('got');

const handler = require('../api/handler.js');
const legacyHandler = require('../api/legacy/handler');

describe('functional', () => {
  let server;

  beforeAll(
    () => new Promise((resolve) => {
      server = http
        .createServer((req, res) => {
          if (req.method === 'POST' && req.url === '/api/') {
            return handler(req, res);
          }
          legacyHandler(req, res);
        })
        .listen(3000);

      resolve();
    }),
  );

  afterAll(done => server.close(done));

  function testBulk(type, target, result) {
    it(`resolves ${target} from ${type} to ${result}`, async () => {
      const response = await got.post({
        json: true,
        url: 'http://localhost:3000/api/',
        body: [{ type, target }],
      });
      expect(response.body).toEqual({
        result: [
          {
            result,
            target,
            type,
          },
        ],
      });
    });
  }

  testBulk('bower', 'jquery', 'https://github.com/jquery/jquery-dist');
  testBulk(
    'composer',
    'phpunit/phpunit',
    'https://github.com/sebastianbergmann/phpunit',
  );
  testBulk('rubygems', 'nokogiri', 'https://github.com/sparklemotion/nokogiri');
  testBulk('npm', 'eslint', 'https://github.com/eslint/eslint');
  testBulk('npm', 'request', 'https://github.com/request/request');
  testBulk(
    'npm',
    'babel-helper-regex',
    'https://github.com/babel/babel/tree/master/packages/babel-helper-regex',
  );
  testBulk(
    'npm',
    'audio-context-polyfill',
    'https://www.npmjs.com/package/audio-context-polyfill',
  );
  testBulk(
    'npm',
    'github-url-from-username-repo',
    'https://github.com/robertkowalski/github-url-from-username-repo',
  );
  testBulk(
    'npm',
    'find-project-root',
    'https://github.com/kirstein/find-project-root',
  );
  testBulk('pypi', 'simplejson', 'https://github.com/simplejson/simplejson');
  testBulk('crates', 'libc', 'https://github.com/rust-lang/libc');
  testBulk(
    'go',
    'k8s.io/kubernetes/pkg/api',
    'https://github.com/kubernetes/kubernetes/tree/master/pkg/api',
  );
  // testBulk('melpa', 'zzz-to-char', 'https://github.com/mrkkrp/zzz-to-char');
  testBulk(
    'java',
    'org.apache.log4j.Appender',
    'https://www.slf4j.org/api/org/apache/log4j/Appender.html',
  );
  testBulk(
    'ping',
    'https://nodejs.org/api/path.html',
    'https://nodejs.org/api/path.html',
  );

  // Legacy API

  function testUrl(target, result) {
    it(`resolves ${target} to ${result}`, async () => {
      const response = await got.get({
        json: true,
        url: `http://localhost:3000/api${target}`,
      });
      expect(response.body).toEqual({
        url: result,
      });
    });
  }

  testUrl('/q/bower/jquery', 'https://github.com/jquery/jquery-dist');
  testUrl(
    '/q/composer/phpunit/phpunit',
    'https://github.com/sebastianbergmann/phpunit',
  );
  testUrl('/q/rubygems/nokogiri', 'https://github.com/sparklemotion/nokogiri');
  testUrl('/q/npm/eslint', 'https://github.com/eslint/eslint');
  testUrl('/q/npm/request', 'https://github.com/request/request');
  testUrl(
    '/q/npm/babel-helper-regex',
    'https://github.com/babel/babel/tree/master/packages/babel-helper-regex',
  );
  testUrl(
    '/q/npm/audio-context-polyfill',
    'https://www.npmjs.com/package/audio-context-polyfill',
  );
  testUrl(
    '/q/npm/github-url-from-username-repo',
    'https://github.com/robertkowalski/github-url-from-username-repo',
  );
  testUrl(
    '/q/npm/find-project-root',
    'https://github.com/kirstein/find-project-root',
  );
  testUrl('/q/pypi/simplejson', 'https://github.com/simplejson/simplejson');
  testUrl('/q/crates/libc', 'https://github.com/rust-lang/libc');
  testUrl(
    '/q/go/k8s.io/kubernetes/pkg/api',
    'https://github.com/kubernetes/kubernetes/tree/master/pkg/api',
  );
  // testUrl('/q/melpa/zzz-to-char', 'https://github.com/mrkkrp/zzz-to-char');
  testUrl(
    '/q/java/org.apache.log4j.Appender',
    'https://www.slf4j.org/api/org/apache/log4j/Appender.html',
  );
  testUrl(
    '/ping?url=https://nodejs.org/api/path.html',
    'https://nodejs.org/api/path.html',
  );
});
