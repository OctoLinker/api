const findReachableUrls = require('find-reachable-urls');
const flatMappingList = require('./mapping');
const cache = require('../utils/cache');

const SUPPORTED_JAVA_VERSIONS = [9, 8, 7];

module.exports = async function (pkg) {
  const targetAsPath = pkg.replace(/\./g, '/');
  const isBuildIn = !!pkg.match(/^javax?/);

  if (!isBuildIn) {
    const url = flatMappingList[pkg];

    if (url) {
      return url;
    }
  }

  const cacheKey = `java_${pkg}`;
  const cacheValue = await cache.get(cacheKey);

  if (cacheValue) {
    return cacheValue;
  }

  const urls = SUPPORTED_JAVA_VERSIONS.reduce(
    (memo, version) => memo.concat(
      `https://docs.oracle.com/javase/${version}/docs/api/${targetAsPath}.html`,
      `https://docs.oracle.com/javaee/${version}/api/${targetAsPath}.html`,
    ),
    [],
  );

  const reachableUrl = await findReachableUrls(
    urls,
    { firstMatch: true },
  );

  if (!reachableUrl) {
    return undefined;
  }

  await cache.set(cacheKey, reachableUrl);

  return reachableUrl;
};
