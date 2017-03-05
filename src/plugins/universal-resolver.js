const Joi = require('joi');
const insight = require('../utils/insight.js');
const registryConfig = require('../../config.json');
const doRequest = require('../utils/do-request.js');

exports.register = (server, options, next) => {
  server.route([{
    path: '/q/{registry}/{package*}',
    method: 'GET',
    config: {
      validate: {
        params: {
          registry: Joi.required().valid(Object.keys(registryConfig)),
          package: Joi.required(),
        },
      },
      handler: (request, reply) => {
        const pkg = request.params.package;
        const type = request.params.registry;
        const eventData = {
          registry: type,
          package: pkg,
          referer: request.headers.referer,
        };

        doRequest(pkg, type, (err, url) => {
          if (err) {
            const eventKey = (err.data || {}).eventKey;
            insight.trackError(eventKey, err, eventData, request);
            return reply(err);
          }

          eventData.url = url;
          insight.trackEvent('resolved', eventData, request);

          reply({
            url,
          });
        });
      },
    },
  }]);

  next();
};

exports.register.attributes = {
  pkg: {
    name: 'Universal Resolver',
    version: '1.0.0',
  },
};
