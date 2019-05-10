const got = require('got');
const cache = require('./utils/cache');

module.exports = async function (url) {
  const cacheKey = `ping_${url}`;

  const cacheValue = await cache.get(cacheKey);

  if (cacheValue) {
    return cacheValue;
  }

  return got
    .head(url)
    .then(async () => {
      await cache.set(cacheKey, url);

      return url;
    })
    .catch(() => undefined);
};
