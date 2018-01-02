const util = require('util');
const got = require('got');
const isUrl = require('is-url');
const Boom = require('boom');
const findReachableUrls = require('find-reachable-urls');
const repositoryUrl = require('./repository-url');
const xpathHelper = require('./xpath-helper');
const registryConfig = require('../../config.json');

function notFoundResponse() {
  return Boom.notFound('Package not found', {
    eventKey: 'package_not_found',
  });
}

function parseFailedResponse() {
  return Boom.create(500, 'Parsing response failed', {
    eventKey: 'json_parse_failed',
  });
}

module.exports = async function doRequest(packageName, type) {
  const config = registryConfig[type];

  const requestUrl = util.format(config.registry, packageName.replace(/\//g, '%2f'));

  try {
    const response = await got.get(requestUrl);
    let json;

    try {
      json = JSON.parse(response.body);
    } catch (err) {
      throw parseFailedResponse();
    }

    const urls = xpathHelper(json, config.xpaths);

    if (type === 'npm') {
      try {
        urls.push(...json.maintainers.map(({ name }) => `${name}/${packageName}`));
      } catch (err) {
        console.log(err);
      }
    }

    const validUrls = urls.map((bestMatchUrl) => {
      try {
        let url = repositoryUrl(bestMatchUrl);

        if (!url && isUrl(bestMatchUrl)) {
          url = bestMatchUrl;
        }

        return url;
      } catch (err) {
        return false;
      }
    });

    const fallbackUrl = util.format(config.fallback, packageName);
    const tryUrls = validUrls.concat(fallbackUrl);
    const reachableUrl = await findReachableUrls(tryUrls, { firstMatch: true });

    if (!reachableUrl) {
      throw notFoundResponse();
    }

    return reachableUrl;
  } catch (err) {
    if (err.statusCode === 404) {
      throw notFoundResponse();
    }

    throw Boom.boomify(err);
  }
};
