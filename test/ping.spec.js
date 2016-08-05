'use strict';

const assert = require('assert');
const sinon = require('sinon');
require('sinon-as-promised')
const got = require('got');
const hapi = require('hapi');
const plugin = require('../src/plugins/ping.js');

describe('ping', () => {
  let server;

  before(done => {
      server = new hapi.Server();
      server.connection();

      server.register(plugin, () => {
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
  });

  afterEach(() => {
    this.sandbox.restore();
  });

  it('performs an HTTP HEAD request', (done) => {
    this.gotStub.resolves();

    const options = {
      url: '/ping?url=http://awesomefooland.com'
    };

    server.inject(options, (response) => {
      assert.equal(this.gotStub.callCount, 1);
      assert.equal(this.gotStub.args[0][0], 'http://awesomefooland.com');
      done();
    });
  });

  it("returns 404 response if package can not be found", (done) => {
    const err = new Error('Some error');
    err.code = 404;
    this.gotStub.rejects(err);

    const options = {
      method: 'GET',
      url: '/ping?url=http://awesomefooland.com'
    };

    server.inject(options, (response) => {
      assert.equal(response.statusCode, 404);
      done();
    });
  });

  it("returns project url", (done) => {
    this.gotStub.resolves();

    const options = {
      method: 'GET',
      url: '/ping?url=http://awesomefooland.com'
    };

    server.inject(options, (response) => {
      assert.equal(response.statusCode, 200);
      done();
    });
  });
});
