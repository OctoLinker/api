const Joi = require('joi');
const insight = require('../utils/insight.js');
const registryConfig = require('../../config.json');
const doRequest = require('../utils/do-request.js');

const register = (server) => {
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
      handler: async (request) => {
        const pkg = request.params.package;
        const type = request.params.registry;
        const eventData = {
          registry: type,
          package: pkg,
          referer: request.headers.referer,
        };

        try {
          const url = await doRequest(pkg, type);
          eventData.url = url;
          insight.trackEvent('resolved', eventData, request);

          return {
            url,
          };
        } catch (err) {
          const eventKey = (err.data || {}).eventKey;
          insight.trackError(eventKey, err, eventData, request);

          return err;
        }
      },
    },
  }]);
};

exports.plugin = {
  name: 'Universal Resolver',
  version: '1.0.0',
  register,
};
