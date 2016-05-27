'use strict';

const assert = require('assert');
const sinon = require('sinon');
const got = require('got');
const cache = require('memory-cache');
const hapi = require('hapi');
const resolverPlugin = require('../src/plugins/universal-resolver.js');

describe('resolver', () => {
  let server;
  const options = {
    method: 'GET',
    url: '/q/bower/foo'
  };
  const redirectOptions = {
    method: 'GET',
    url: '/q/bower/foo?redirect=1',
  };

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

  describe('fetch', () => {
    it('returns an error if registry fetch fails', (done) => {
      const err = new Error('Some error');
      this.gotStub.yields(err);

      server.inject(options, (response) => {
        assert.equal(response.statusCode, 500);
        assert.equal(response.result.error, 'Internal Server Error');
        done();
      });
    });

    it('fetch package information from registry', (done) => {
      this.gotStub.yields(null);

      server.inject(options, (response) => {
        assert.equal(this.gotStub.callCount, 1);
        assert.equal(this.gotStub.args[0][0], 'http://bower.herokuapp.com/packages/foo');
        assert.equal(this.gotStub.args[0][1].json, undefined);
        done();
      });
    });
  });

  describe('response', () => {
    describe('with 404', () => {
      it('when package can not be found', (done) => {
        const err = new Error('Some error');
        err.code = 404;
        this.gotStub.yields(err);

        server.inject(options, (response) => {
          assert.equal(response.statusCode, 404);
          assert.equal(response.result.message, 'Package not found');
          done();
        });
      });
    });

    describe('with 500', () => {
      it('when no repository url is found', (done) => {
        this.gotStub.yields(null, JSON.stringify({
          url: ''
        }));

        server.inject(options, (response) => {
          assert.equal(response.statusCode, 500);
          done();
        });
      });
    });

    describe('with 200', () => {
      describe('when url is a github.com', () => {
        it('returns project url', (done) => {
          this.gotStub.yields(null, JSON.stringify({
            url: 'rundmc/foo'
          }));

          server.inject(options, (response) => {
            assert.equal(response.statusCode, 200);
            assert.equal(response.result.url, 'https://github.com/rundmc/foo');
            done();
          });
        });
      });

      describe('when url is something else', () => {
        it('returns custom url', (done) => {
          this.gotStub.yields(null, JSON.stringify({
            url: 'http://rundmc.com/foo'
          }));

          server.inject(options, (response) => {
            assert.equal(response.statusCode, 200);
            assert.equal(response.result.url, 'http://rundmc.com/foo');
            done();
          });
        });
      });
    });

    describe('with 302', () => {
      describe('when url is a github.com', () => {
        it('redirects to project url', (done) => {
          this.gotStub.yields(null, JSON.stringify({
            url: 'rundmc/foo'
          }));

          server.inject(redirectOptions, (response) => {
            assert.equal(response.statusCode, 302);
            assert.equal(response.headers.location, 'https://github.com/rundmc/foo');
            done();
          });
        });
      });

      describe('when url is something else', () => {
        it('redirects to custom url', (done) => {
          this.gotStub.yields(null, JSON.stringify({
            url: 'http://rundmc.com/foo'
          }));

          server.inject(redirectOptions, (response) => {
            assert.equal(response.statusCode, 302);
            assert.equal(response.headers.location, 'http://rundmc.com/foo');
            done();
          });
        });
      });
    });
  });
});
