const got = require('got');
const Joi = require('joi');
const insight = require('../utils/insight.js');

exports.register = (server, options, next) => {
  server.route([{
    path: '/ping',
    method: 'GET',
    config: {
      validate: {
        query: {
          url: Joi.required(),
        },
      },
      handler: async (request, reply) => {
        const url = request.query.url;

        try {
          await got.get(url);
          insight.trackEvent('ping_resolved', {
            url,
          }, request);

          reply({
            url,
          }).code(200);
        } catch (err) {
          insight.trackError('ping_error', err, {
            url,
          }, request);

          reply().code(404);
        }
      },
    },
  }]);

  next();
};

exports.register.attributes = {
  pkg: {
    name: 'Ping',
    version: '1.0.0',
  },
};
