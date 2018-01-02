const Inert = require('inert');
const pkg = require('../../package.json');
const insight = require('../utils/insight');

const register = async (server) => {
  await server.register(Inert);

  server.ext('onPreResponse', (request, response) => {
    if (request.path === '/') {
      insight.trackEvent('shows_index', {
        version: pkg.version,
      }, request);
    }

    return response.continue;
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './public',
        index: true,
      },
    },
  });
};

exports.plugin = {
  name: 'Home',
  version: '1.0.0',
  register,
};
