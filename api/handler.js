const { json } = require('micro');
const pMap = require('p-map');
const uniqWith = require('lodash.uniqwith');
const isEqual = require('lodash.isequal');

const registries = require('./src/registries');
const go = require('./src/go');
const java = require('./src/java');
const ping = require('./src/ping');

const tracking = require('./src/utils/tracking');
const cache = require('./src//utils/cache');
const log = require('./src/utils/log');

const logPrefix = log.prefix;

const supportedTypes = ['ping', 'go', 'java', ...registries.supported];

const mapper = async (item) => {
  let result;

  if (registries.supported.includes(item.type)) {
    result = await registries.resolve(item.type, item.target);
  } else if (item.type === 'go') {
    result = await go(item.target);
  } else if (item.type === 'java') {
    result = await java(item.target);
  } else if (item.type === 'ping') {
    result = await ping(item.target);
  } else {
    return;
  }

  return {
    ...item,
    result,
  };
};

function cleanPayload(payload) {
  // Remove duplicates
  // Remove invalid items which does not follow format {type:'foo', target: 'bar'}
  // Filter out types which are not supported
  return uniqWith(payload, isEqual).filter(
    item => item
      && item.target
      && item.target.length
      && supportedTypes.includes(item.type),
  );
}

async function requestHandler(payload) {
  return pMap(payload, mapper, { concurrency: 5 });
}

function errorHandler(error, res) {
  log(error);
  res.statusCode = 500;
  res.end('Internal server error');
}

tracking.init();

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const timingTotalStart = Date.now();

    const body = await json(req);

    const timingCacheAuthStart = Date.now();
    await cache.auth();
    const timingCacheAuth = Date.now() - timingCacheAuthStart;

    let result;
    let timingTotalEnd;
    let completed = false;
    const payload = cleanPayload(body);

    try {
      result = await requestHandler(payload);
      completed = true;
    } catch (error) {
      return errorHandler(error, res);
    } finally {
      timingTotalEnd = Date.now();

      log('Request completed', completed);
      log('Instance Name', logPrefix);
      log('Redis Status', cache.getRedisStatus());
      log('Redis Auth Duration', timingCacheAuth);
      log('Simple Cache Size', cache.simpleCacheSize());
      log('Result Length', (result && result.length) || 0);
      log('Duration', timingTotalEnd - timingTotalStart);

      const meta = {
        event: 'meta',
        properties: {
          Region: process.env.NOW_REGION || 'unknown',
          'Request completed': completed,
          'Instance Name': logPrefix,
          'Redis Status': cache.getRedisStatus(),
          'Redis Auth Duration': timingCacheAuth,
          'Simple Cache Size': cache.simpleCacheSize(),
          'Result Length': (result && result.length) || 0,
          Duration: timingTotalEnd - timingTotalStart,
        },
      };

      const bulkData = [
        meta,
        ...result.map(item => ({
          event: 'packages',
          properties: {
            Type: item.type,
            Target: item.target,
            Result: item.result,
          },
        })),
      ];

      if (process.env.NODE_ENV !== 'test') {
        console.time('Mixpanel');
        await tracking.track(bulkData);
        console.timeEnd('Mixpanel');
      }
    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.end(
      JSON.stringify({
        result,
      }),
    );
  }

  res.end('OctoLinker API');
};
