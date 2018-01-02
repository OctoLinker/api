

const assert = require('assert');
const sinon = require('sinon');
require('sinon-as-promised');
const got = require('got');
const hapi = require('hapi');
const plugin = require('../src/plugins/ping.js');

describe('ping', () => {
  let server;

  before(async () => {
    server = new hapi.Server();

    await server.register(plugin);
    return server.start();
  });

  after(() => server.stop());

  beforeEach(() => {
    this.sandbox = sinon.sandbox.create();
    this.gotStub = this.sandbox.stub(got, 'get');
  });

  afterEach(() => {
    this.sandbox.restore();
  });

  it('performs an HTTP HEAD request', async () => {
    this.gotStub.resolves();

    const options = {
      url: '/ping?url=http://awesomefooland.com',
    };

    await server.inject(options);
    assert.equal(this.gotStub.callCount, 1);
    assert.equal(this.gotStub.args[0][0], 'http://awesomefooland.com');
  });

  it('returns 404 response if package can not be found', async () => {
    const err = new Error('Some error');
    err.code = 404;
    this.gotStub.rejects(err);

    const options = {
      method: 'GET',
      url: '/ping?url=http://awesomefooland.com',
    };

    const response = await server.inject(options);
    assert.equal(response.statusCode, 404);
  });

  it('returns project url', async () => {
    this.gotStub.resolves();

    const options = {
      method: 'GET',
      url: '/ping?url=http://awesomefooland.com',
    };

    const response = await server.inject(options);
    assert.equal(response.statusCode, 200);
  });
});
