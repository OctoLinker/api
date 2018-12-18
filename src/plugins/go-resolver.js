const Joi = require('joi');
const findReachableUrls = require('find-reachable-urls');
const readMeta = require('lets-get-meta');
const got = require('got');
const cache = require('../utils/cache');
const insight = require('../utils/insight');

const getGoMeta = async (url) => {
  const response = await got.get(url);
  const meta = readMeta(response.body);

  if (!meta['go-source']) {
    throw new Error('go-source meta is missing');
  }

  const values = meta['go-source'].replace(/\s+/g, ' ').split(' ');

  return {
    projectRoot: values[0],
    projectUrl: values[1],
    dirTemplate: values[2].replace('{/dir}', ''),
  };
};

const resolveUrl = async (url) => {
  let goMetaConfig;

  const cacheKey = `go_${url}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    // Preferred with https
    goMetaConfig = await getGoMeta(`https://${url}?go-get=1`);
  } catch (err) {
    // Fallback insecure
    goMetaConfig = await getGoMeta(`http://${url}?go-get=1`);
  }

  const reachableUrl = await findReachableUrls([
    url.replace(goMetaConfig.projectRoot, goMetaConfig.dirTemplate),
    goMetaConfig.projectUrl,
  ], { firstMatch: true });

  if (!reachableUrl) {
    throw new Error('No url is reachable');
  }

  cache.set(cacheKey, reachableUrl);

  return reachableUrl;
};

const register = (server) => {
  server.route([{
    path: '/q/go/{package*}',
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
          registry: 'go',
          package: pkg,
          referer: request.headers.referer,
        };

        try {
          const url = await resolveUrl(pkg);

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
  name: 'Go Resolver',
  version: '1.0.0',
  register,
};
