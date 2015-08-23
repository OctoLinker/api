if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

var Hapi = require('hapi');
var Joi = require('joi');
var cache = require('memory-cache');
var pkg = require('./package.json');
var resolver = require('./src/resolver');
var insight = require('./src/utils/insight.js').init();

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
      var cacheKey = type + '@' + pkg;

      function resolvedHandler (url) {
        insight.sendEvent('resolved', {
          registry: type,
          package: pkg,
          url: url
        });
        return reply({url: url});
      }

      var cachedUrl = cache.get(cacheKey);
      if (cachedUrl) {
        console.log('Get cache entry %s', cachedUrl);
        return resolvedHandler(cachedUrl);
      }

      console.log('Hit %s registry for %s', type, pkg);

      resolver(type, pkg, function(err, url) {

        if (err && err.code === 404) {
          insight.sendEvent('package_not_found', {
            registry: type,
            package: pkg
          });
          return reply({error: 'Package not found'}).code(404);
        }

        if (err) {
          return reply({error: err.message}).code(500);
        }

        if (!url) {
          insight.sendEvent('repository_url_not_found', {
            registry: type,
            package: pkg
          });
          return reply({error: 'Repository url not found'}).code(500);
        }

        var twoWeeks = 1209600000;
        cache.put(cacheKey, url, twoWeeks);

        resolvedHandler(url);
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

      insight.sendEvent('shows_index', {
        version: pkg.version
      });

      reply(versionInfo);
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
