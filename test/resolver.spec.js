'use strict';

const assert = require('assert');
const sinon = require('sinon');
const got = require('got');
const cache = require('memory-cache');
const hapi = require('hapi');
const resolverPlugin = require('../plugins/universal-resolver.js');

describe.only('resolver', () => {
  let server;

  before(done => {
      server = new hapi.Server();
      server.connection();

      server.register(resolverPlugin, () => {
          server.start(() => {
              done();
          });
      });
  });

  after(done => {
      server.stop(() => done());
  });

  beforeEach(() => {
    this.sandbox = sinon.sandbox.create();
    this.gotStub = this.sandbox.stub(got, 'get');

    this.sandbox.stub(cache, 'get');
  });

  afterEach(() => {
    this.sandbox.restore();
  });

  it("returns an error if registry fetch fails", (done) => {
    const err = new Error('Some error');
    this.gotStub.yields(err);

    const options = {
      method: 'GET',
      url: '/q/bower/foo'
    };

    server.inject(options, (response) => {
      assert.equal(response.statusCode, 500);
      assert.equal(response.result.error, 'Internal Server Error');
      done();
    });
  });

  it('fetch package information from registry', (done) => {
    this.gotStub.yields(null);

    const options = {
      method: 'GET',
      url: '/q/bower/foo'
    };

    server.inject(options, (response) => {
      assert.equal(this.gotStub.callCount, 1);
      assert.equal(this.gotStub.args[0][0], 'http://bower.herokuapp.com/packages/foo');
      assert.equal(this.gotStub.args[0][1].json, undefined);
      done();
    });
  });

  it("returns 404 response if package can not be found", (done) => {
    const err = new Error('Some error');
    err.code = 404;
    this.gotStub.yields(err);

    const options = {
      method: 'GET',
      url: '/q/bower/foo'
    };

    server.inject(options, (response) => {
      assert.equal(response.statusCode, 404);
      assert.equal(response.result.message, 'Package not found');
      done();
    });
  });

  it("returns project url", (done) => {
    this.gotStub.yields(null, JSON.stringify({
      url: 'rundmc/foo'
    }));

    const options = {
      method: 'GET',
      url: '/q/bower/foo'
    };

    server.inject(options, (response) => {
      assert.equal(response.statusCode, 200);
      assert.equal(response.result.url, 'https://github.com/rundmc/foo');
      done();
    });
  });
});
