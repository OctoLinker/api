if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

const hapi = require('hapi');
const resolverPlugin = require('./plugins/universal-resolver.js');
const homePlugin = require('./plugins/home.js');

const server = new hapi.Server();
server.connection({
  port: process.env.PORT || 3000
});

server.register([
  resolverPlugin,
  homePlugin
], (err) => {
  if (err) {
    return console.error('Failed to register server:', err);
  }

  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });
});
