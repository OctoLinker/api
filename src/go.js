const got = require('got');

const cache = require('./utils/cache');
const log = require('./utils/log');

const resolveUrl = async (url) => {
  const cacheKey = `go_${url}`;
  const cacheValue = await cache.get(cacheKey);
  if (cacheValue) {
    return cacheValue;
  }

  const goDevUrl = `https://pkg.go.dev/${url}`;
  const response = await got.get(goDevUrl);

  if (response.statusCode === 404) {
    throw new Error('Url not found');
  }

  const isStdLib = response.body.includes('standard library');
  if (isStdLib) {
    await cache.set(cacheKey, goDevUrl);

    return goDevUrl;
  }

  const [, targetUrl] = /UnitMeta-repo">[\n\s]+<a href="([^"]+)/g.exec(response.body);
  await cache.set(cacheKey, targetUrl);

  return targetUrl;
};

module.exports = async function (pkg) {
  try {
    return await resolveUrl(pkg);
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      log('ENOTFOUND', err.url);
    } else {
      log(err);
    }
    return undefined;
  }
};
