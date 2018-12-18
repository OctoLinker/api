const Boom = require('boom');
const Joi = require('joi');
const got = require('got');
const cache = require('../utils/cache');
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

        const cacheKey = `ping_${url}`;

        if (cache.has(cacheKey)) {
          return cache.get(cacheKey);
        }

        try {
          await got.head(url);
          insight.trackEvent('ping_resolved', {
            url,
          }, request);

          cache.set(cacheKey, { url });

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
