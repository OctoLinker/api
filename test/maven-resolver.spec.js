const assert = require('assert');
const sinon = require('sinon');
require('sinon-as-promised');
const got = require('got');
const cache = require('memory-cache');
const hapi = require('hapi');
const resolverPlugin = require('../src/plugins/maven-resolver.js');

describe('maven', () => {
  let server;
  const options = {
    method: 'GET',
    url: '/q/maven/com.company.foo.bar',
  };

  before((done) => {
    server = new hapi.Server();
    server.connection();

    server.register(resolverPlugin, () => {
      server.start(() => {
        done();
      });
    });
  });

  after((done) => {
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
      this.gotStub.rejects(err);

      server.inject(options, (response) => {
        assert.equal(response.statusCode, 500);
        assert.equal(response.result.error, 'Internal Server Error');
        done();
      });
    });

    it('fetch package information from registry', (done) => {
      this.gotStub.resolves();

      server.inject(options, () => {
        assert.equal(this.gotStub.callCount, 1);
        assert.equal(this.gotStub.args[0][0], 'https://search.maven.org/solrsearch/select?wt=json&rows=1&q=fc:%22com.company.foo.bar%22');
        done();
      });
    });
  });

  describe('response', () => {
    describe('with 404', () => {
      it('when package can not be found', (done) => {
        const err = new Error('Some error');
        err.code = 404;
        this.gotStub.rejects(err);

        server.inject(options, (response) => {
          assert.equal(response.statusCode, 404);
          assert.equal(response.result.message, 'Package not found');
          done();
        });
      });

      it('when no repository url is found in pom file', (done) => {
        const promiseA = Promise.resolve({
          body: {
            response: {
              numFound: 1,
              docs: [
                {
                  g: 'foo', // eslint-disable-line id-length
                  a: 'bar', // eslint-disable-line id-length
                  v: '1.2.3', // eslint-disable-line id-length
                },
              ],
            },
          },
        });
        this.gotStub.onCall(0).returns(promiseA);

        const promiseB = Promise.resolve({
          body: '<project><foo></foo></project>',
        });

        this.gotStub.onCall(1).resolves(promiseB);

        server.inject(options, (response) => {
          assert.equal(response.statusCode, 404);
          done();
        });
      });
    });
  });
});
