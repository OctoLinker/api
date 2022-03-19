const got = require('got');
const cache = require('./utils/cache');

const ERR_PING_NOT_FOUND = 'ERR_PING_NOT_FOUND';

module.exports = async function (url) {
  const cacheKey = `ping_${url}`;

  const cacheValue = await cache.get(cacheKey);

  if (cacheValue) {
    if (cacheValue !== ERR_PING_NOT_FOUND) {
      return cacheValue;
    }

    return undefined;
  }

  return got
    .head(url)
    .then(async () => {
      await cache.set(cacheKey, url);

      return url;
    })
    .catch(async () => {
      await cache.set(cacheKey, ERR_PING_NOT_FOUND);

      return undefined;
    });
};
