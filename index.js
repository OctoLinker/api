if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

var Hapi = require('hapi');
var Joi = require('joi');
var resolver = require('./src/resolver');
var pkg = require('./package.json');

var server = new Hapi.Server();
server.connection({
  routes: {
    cors: true
  },
  port: process.env.PORT || 3000
});

server.route({
    method: 'GET',
    path: '/q/{registry}/{package*}',
    config: {
        validate: {
            params: {
                registry: Joi.required().valid('npm', 'bower', 'composer'),
                package: Joi.required()
            }
        }
    },
    handler: function (request, reply) {
      var type = request.params.registry;
      var pkg = request.params.package;

      resolver(type, pkg, function(err, url) {

        if (err && err.code === 404) {
          return reply({error: 'Package not found'}).code(404);
        }

        if (err) {
          return reply({error: err.message}).code(500);
        }

        if (!url) {
          return reply({error: 'Repository url not found'}).code(500);
        }

        return reply({url: url});
      });
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      var repoUrl = pkg.repository.url;
      var short = repoUrl.replace('https://github.com/', '');
      var versionInfo = '<a href="' + repoUrl + '">' + short + '@' + pkg.version + '</a>';

      reply(versionInfo);
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
