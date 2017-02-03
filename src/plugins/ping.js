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
      handler: (request, reply) => {
        const url = request.query.url;

        got.get(url).then(() => {
          insight.trackEvent('ping_resolved', {
            url,
          }, request);

          reply({
            url,
          }).code(200);
        }, (err) => {
          insight.trackError('ping_error', err, {
            url,
          }, request);

          return reply().code(404);
        });
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
