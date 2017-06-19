const Joi = require('joi');
const findReachableUrls = require('find-reachable-urls');
const got = require('got');
const insight = require('../utils/insight');

let lastModified;
let archive;

const resolveUrl = async (pkg) => {
  try {
    const response = await got('https://melpa.org/archive.json', {
      json: true,
      headers: lastModified ? {
        'if-modified-since': lastModified,
      } : undefined,
    });

    lastModified = response.headers['last-modified'];
    archive = response.body;
  } catch (err) {
    if (err.statusCode !== 304) {
      throw err;
    }
  }

  const reachableUrl = await findReachableUrls([
    archive[pkg].props.url,
    `https://melpa.org/#/${pkg}`,
  ], { firstMatch: true });

  if (!reachableUrl) {
    throw new Error('No url is reachable');
  }

  return reachableUrl;
};

exports.register = (server, options, next) => {
  server.route([{
    path: '/q/melpa/{package*}',
    method: 'GET',
    config: {
      validate: {
        params: {
          package: Joi.required(),
        },
      },
      handler: async (request, reply) => {
        const pkg = request.params.package;

        const eventData = {
          registry: 'melpa',
          package: pkg,
          referer: request.headers.referer,
        };

        try {
          const url = await resolveUrl(pkg);
          reply({
            url,
          });

          eventData.url = url;
          insight.trackEvent('resolved', eventData, request);
        } catch (err) {
          const eventKey = (err.data || {}).eventKey;
          insight.trackError(eventKey, err, eventData, request);
          reply(err);
        }
      },
    },
  }]);

  next();
};

exports.register.attributes = {
  pkg: {
    name: 'MELPA Resolver',
    version: '1.0.0',
  },
};
