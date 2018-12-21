const got = require('got');
const hapi = require('hapi');
const plugin = require('../src/plugins/universal-resolver.js');

jest.mock('got');

describe('resolver', () => {
  let server;
  const options = {
    method: 'GET',
    url: '/q/bower/foo',
  };

  beforeAll(async () => {
    server = new hapi.Server();

    await server.register(plugin);
    return server.start();
  });

  afterAll(() => server.stop());

  afterEach(() => got.get.mockClear());

  describe('fetch', () => {
    it('returns an error if registry fetch fails', async () => {
      const err = new Error('Some error');
      got.get.mockRejectedValue(err);

      const response = await server.inject(options);
      expect(response.statusCode).toBe(500);
      expect(response.result.error).toBe('Internal Server Error');
    });

    it('fetch package information from registry', async () => {
      got.get.mockResolvedValue();

      await server.inject(options);
      expect(got.get.mock.calls).toHaveLength(1);
      expect(got.get.mock.calls[0][0]).toBe('https://registry.bower.io/packages/foo');
    });

    it('escapes slashes in package names', async () => {
      const optionsScopePackage = {
        method: 'GET',
        url: '/q/npm/@foo/bar',
      };

      got.get.mockResolvedValue();

      await server.inject(optionsScopePackage);
      expect(got.get.mock.calls).toHaveLength(1);
      expect(got.get.mock.calls[0][0]).toBe('https://registry.npmjs.org/@foo%2fbar');
    });
  });

  describe('response', () => {
    describe('with 404', () => {
      it('when package can not be found', async () => {
        const err = new Error('Some error');
        err.statusCode = 404;
        got.get.mockRejectedValue(err);

        const response = await server.inject(options);
        expect(response.statusCode).toBe(404);
        expect(response.result.message).toBe('Package not found');
      });
    });

    describe('with 200', () => {
      it('when no repository url is found', async () => {
        got.get.mockResolvedValue({
          body: JSON.stringify({
            url: '',
          }),
        });

        const response = await server.inject(options);
        expect(response.statusCode).toBe(200);
        expect(response.result.url).toBe('https://bower.io/search/?q=foo');
      });
    });
  });
});
