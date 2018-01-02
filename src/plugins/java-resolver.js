const Joi = require('joi');
const Boom = require('boom');
const requireDir = require('require-dir');
const insight = require('../utils/insight.js');

const mappingFiles = requireDir('../../mapping-files');
const flatMappingList = Object.assign(...Object.values(mappingFiles));

const register = (server) => {
  server.route([{
    path: '/q/java/{package*}',
    method: 'GET',
    config: {
      validate: {
        params: {
          package: Joi.required(),
        },
      },
      handler: async (request) => {
        const pkg = request.params.package;
        const eventData = {
          registry: 'java',
          package: pkg,
          referer: request.headers.referer,
        };

        const url = flatMappingList[pkg];

        if (url) {
          eventData.url = url;
          insight.trackEvent('resolved', eventData, request);

          return {
            url,
          };
        }

        const err = Boom.notFound('Library not found', {
          eventKey: 'library_not_found',
        });
        const eventKey = (err.data || {}).eventKey;
        insight.trackError(eventKey, err, eventData, request);
        return err;
      },
    },
  }]);
};

exports.plugin = {
  name: 'Java Resolver',
  version: '1.0.0',
  register,
};
