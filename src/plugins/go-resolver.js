const Joi = require('joi');
const findReachableUrls = require('find-reachable-urls');
const readMeta = require('lets-get-meta');
const got = require('got');
const insight = require('../utils/insight');

const getGoMeta = async (url) => {
  const response = await got.get(url);
  const meta = readMeta(response.body);

  if (!meta['go-source']) {
    throw new Error('go-source meta is missing');
  }

  const values = meta['go-source'].replace(/\s+/, ' ').split(' ');

  return {
    projectRoot: values[0],
    projectUrl: values[1],
    dirTemplate: values[2].replace('{/dir}', ''),
  };
};

const resolveUrl = async (url) => {
  let goMetaConfig;

  try {
    // Preferred with https
    goMetaConfig = await getGoMeta(`https://${url}?go-get=1`);
  } catch (err) {
    // Fallback insecure
    goMetaConfig = await getGoMeta(`http://${url}?go-get=1`);
  }

  const urls = await findReachableUrls([
    url.replace(goMetaConfig.projectRoot, goMetaConfig.dirTemplate),
    goMetaConfig.projectUrl,
  ]);

  if (!urls[0]) {
    throw new Error('No url is reachable');
  }

  return urls[0];
};

exports.register = (server, options, next) => {
  server.route([{
    path: '/q/go/{package*}',
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
          registry: 'go',
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
    name: 'Go Resolver',
    version: '1.0.0',
  },
};
