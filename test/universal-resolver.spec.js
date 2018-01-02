const assert = require('assert');
const sinon = require('sinon');
require('sinon-as-promised');
const got = require('got');
const cache = require('memory-cache');
const hapi = require('hapi');
const plugin = require('../src/plugins/universal-resolver.js');

describe('resolver', () => {
  let server;
  const options = {
    method: 'GET',
    url: '/q/bower/foo',
  };

  before(async () => {
    server = new hapi.Server();

    await server.register(plugin);
    return server.start();
  });

  after(() => server.stop());

  beforeEach(() => {
    this.sandbox = sinon.sandbox.create();
    this.gotStub = this.sandbox.stub(got, 'get');

    this.sandbox.stub(cache, 'get');
  });

  afterEach(() => {
    this.sandbox.restore();
  });

  describe('fetch', () => {
    it('returns an error if registry fetch fails', async () => {
      const err = new Error('Some error');
      this.gotStub.rejects(err);

      const response = await server.inject(options);
      assert.equal(response.statusCode, 500);
      assert.equal(response.result.error, 'Internal Server Error');
    });

    it('fetch package information from registry', async () => {
      this.gotStub.resolves();

      await server.inject(options);
      assert.equal(this.gotStub.callCount, 1);
      assert.equal(this.gotStub.args[0][0], 'https://registry.bower.io/packages/foo');
    });

    it('escapes slashes in package names', async () => {
      const optionsScopePackage = {
        method: 'GET',
        url: '/q/npm/@angular/core',
      };

      this.gotStub.resolves();

      await server.inject(optionsScopePackage);
      assert.equal(this.gotStub.callCount, 1);
      assert.equal(this.gotStub.args[0][0], 'https://registry.npmjs.org/@angular%2fcore');
    });
  });

  describe('response', () => {
    describe('with 404', () => {
      it('when package can not be found', async () => {
        const err = new Error('Some error');
        err.statusCode = 404;
        this.gotStub.rejects(err);

        const response = await server.inject(options);
        assert.equal(response.statusCode, 404);
        assert.equal(response.result.message, 'Package not found');
      });
    });

    describe('with 200', () => {
      it('when no repository url is found', async () => {
        this.gotStub.resolves({
          body: JSON.stringify({
            url: '',
          }),
        });

        const response = await server.inject(options);
        assert.equal(response.statusCode, 200);
        assert.equal(response.result.url, 'https://bower.io/search/?q=foo');
      });
    });
  });
});
