const http = require('http');
const got = require('got');

const handler = require('./src/handler.js');

describe('functional', () => {
  let server;

  beforeAll(
    () => new Promise((resolve) => {
      server = http
        .createServer((req, res) => handler(req, res))
        .listen(3000);

      resolve();
    }),
  );

  afterAll(done => server.close(done));

  function testBulk(type, target, result) {
    it(`resolves ${target} from ${type} to ${result}`, async () => {
      const response = await got.post({
        json: true,
        url: 'http://localhost:3000/',
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

  it('supports GET', async () => {
    const response = await got.get({
      json: true,
      url:
        'http://localhost:3000/?npm=jquery,request&go=k8s.io/kubernetes/pkg/api',
    });
    expect(response.body).toEqual({
      result: [
        {
          result: 'https://github.com/jquery/jquery',
          target: 'jquery',
          type: 'npm',
        },
        {
          result: 'https://github.com/request/request',
          target: 'request',
          type: 'npm',
        },
        {
          result:
            'https://github.com/kubernetes/kubernetes/tree/master/pkg/api',
          target: 'k8s.io/kubernetes/pkg/api',
          type: 'go',
        },
      ],
    });
  });

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
});
