if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

const hapi = require('hapi');
const resolverPlugin = require('./src/plugins/universal-resolver.js');
const pingPlugin = require('./src/plugins/ping.js');
const homePlugin = require('./src/plugins/home.js');

const server = new hapi.Server();
server.connection({
  port: process.env.PORT || 3000,
});

server.register([
  resolverPlugin,
  pingPlugin,
  homePlugin,
], (err) => {
  if (err) {
    return console.error('Failed to register server:', err);
  }

  server.start(() => {
    console.log('Server running at:', server.info.uri);
  });
});

module.exports = server;
