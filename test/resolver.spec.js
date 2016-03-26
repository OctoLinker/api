const assert = require('assert');
const sinon = require('sinon');
const got = require('got');
const cache = require('memory-cache');
const server = require("../index.js");

describe.only('resolver', () => {

  beforeEach(() => {
    this.sandbox = sinon.sandbox.create();
    this.gotStub = this.sandbox.stub(got, 'get');

    this.sandbox.stub(cache, 'get');
  });

  afterEach(() => {
    this.sandbox.restore();
    server.stop();
  });

  it("returns error response", (done) => {
    this.gotStub.yields(new Error('Some error'));

    const options = {
      method: 'GET',
      url: '/q/bower/foo'
    };

    server.inject(options, (response) => {
      assert.equal(response.statusCode, 500);
      assert.equal(response.result.error, 'Some error');
      server.stop(done);
    });
  });

  it("returns github url", (done) => {
    this.gotStub.yields(null, {
      url: 'rundmc/foo'
    });

    const options = {
      method: 'GET',
      url: '/q/bower/foo'
    };

    server.inject(options, (response) => {
      assert.equal(response.statusCode, 200);
      assert.equal(response.result.url, 'https://github.com/rundmc/foo');
      server.stop(done);
    });
  });

  it('fetch package information from registry', (done) => {
    this.gotStub.yields(null, {
      url: 'rundmc/foo'
    });

    const options = {
      method: 'GET',
      url: '/q/bower/foo'
    };

    server.inject(options, (response) => {
      assert.equal(this.gotStub.callCount, 1);
      assert.equal(this.gotStub.args[0][0], 'http://bower.herokuapp.com/packages/foo');
      assert.equal(this.gotStub.args[0][1].json, true);
      server.stop(done);
    });
  });

  it("returns fallback url when package was not resolvable", (done) => {
    this.gotStub.yields(null, {
      url: ''
    });

    const options = {
      method: 'GET',
      url: '/q/bower/foo'
    };

    server.inject(options, (response) => {
      assert.equal(response.statusCode, 200);
      assert.equal(response.result.url, 'http://bower.io/search/?q=foo');
      server.stop(done);
    });
  });
});
