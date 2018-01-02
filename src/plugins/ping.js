const got = require('got');
const Boom = require('boom');

const Joi = require('joi');
const insight = require('../utils/insight.js');

const register = (server) => {
  server.route([{
    path: '/ping',
    method: 'GET',
    config: {
      validate: {
        query: {
          url: Joi.required(),
        },
      },
      handler: async (request) => {
        const url = request.query.url;

        try {
          await got.get(url);
          insight.trackEvent('ping_resolved', {
            url,
          }, request);

          return {
            url,
          };
        } catch (error) {
          const err = Boom.notFound('URL not found');

          insight.trackError('ping_error', err, { url }, request);

          return err;
        }
      },
    },
  }]);
};

exports.plugin = {
  name: 'Ping',
  version: '1.0.0',
  register,
};
