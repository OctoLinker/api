'use strict';

const got = require('got');
const Joi = require('joi');
const insight = require('../src/utils/insight.js');

exports.register = (server, options, next) => {
    server.route([{
        path: '/ping',
        method: 'GET',
        config: {
          validate: {
            query: {
              url: Joi.required()
            }
          },
          handler: (request, reply) => {
            const url = request.query.url;

            got.head(url, function (err) {
              if (err) {
                insight.trackError('ping_error', err, {
                  url,
                }, request);

                return reply().code(404);
              }

              insight.trackEvent('ping_resolved', {
                url,
              }, request);

              reply().code(200);
            });
          }
        }
    }]);

    next();
};

exports.register.attributes = {
  pkg: {
    name: 'Ping',
    version: '1.0.0'
  }
};
