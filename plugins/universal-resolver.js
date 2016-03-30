'use strict';

const util = require('util');
const got = require('got');
const Joi = require('joi');
const Boom = require('boom');
const repositoryUrl = require('../src/utils/repository-url');
const xpathHelper = require('../src/utils/xpath-helper')
const insight = require('../src/utils/insight.js');
const registryConfig = require('../config.json');

function notFoundResponse() {
  return Boom.notFound('Package not found', {
    eventKey: 'package_not_found'
  });
}

function parseFailedResponse() {
  return Boom.create(500, 'Parsing response failed', {
    eventKey: 'json_parse_failed'
  });
}

function repositoryUrlNotFoundResponse() {
  return Boom.create(500, 'Repository url not found', {
    eventKey: 'repository_url_not_found'
  })
}

function trackError(err, eventData) {
  if (!err.isBoom) {
    eventData.errorMessage = err.message;
    eventData.errorStack = err.stack;
  }

  insight(
    (err.data || {}).eventKey || 'unkown_error',
    eventData
  );
}

function trackResolved(eventData) {
  insight('resolved', eventData);
}

function doRequest(packageName, type, cb) {
  const config = registryConfig[type];

  const url = util.format(config.registry, packageName);

  got.get(url, function (err, data) {
    if (err) {
      if (err.code === 404) {
        return cb(notFoundResponse());
      }

      return cb(Boom.wrap(err));
    }

    let json;

    try {
      json = JSON.parse(data);
    } catch (e) {
      return cb(parseFailedResponse());
    }

    const url = repositoryUrl(xpathHelper(json, config.xpaths));

    if (!url) {
      return cb(repositoryUrlNotFoundResponse());
    }

    cb(null, url);
  });
}

exports.register = (server, options, next) => {
    server.route([{
        path: '/q/{registry}/{package*}',
        method: 'GET',
        config: {
          validate: {
            params: {
              registry: Joi.required().valid(Object.keys(registryConfig)),
              package: Joi.required()
            }
          },
          handler: (request, reply) => {
            const pkg = request.params.package;
            const type = request.params.registry;
            const eventData = {
              registry: type,
              package: pkg,
              referer: request.headers.referer
            }

            doRequest(pkg, type, function(err, url) {
              if (err) {
                trackError(err, eventData);
                return reply(err);
              }

              eventData.url = url;
              trackResolved(eventData);

              reply({
                url
              });
            });
          }
        }
    }]);

    next();
};

exports.register.attributes = {
  pkg: {
    name: 'Universal Resolver',
    version: '1.0.0'
  }
};
