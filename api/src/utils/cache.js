const Redis = require('ioredis');
const log = require('./log');

let redis;
const simpleCache = new Map();

function redisConfig() {
  // https://zeit.co/docs/v2/platform/regions-and-providers/
  const region = (process.env.NOW_REGION || '').toUpperCase();

  return {
    host: process.env[`${region}_REDIS_HOST`] || process.env.DEFAULT_REDIS_HOST,
    port: process.env[`${region}_REDIS_PORT`] || process.env.DEFAULT_REDIS_PORT,
    password:
      process.env[`${region}_REDIS_PASSWORD`]
      || process.env.DEFAULT_REDIS_PASSWORD,
  };
}

function auth() {
  log('Cache auth');

  return new Promise((resolve) => {
    if (redis && redis.status === 'ready') {
      log('Cache re-use Redis instance');
      return resolve();
    }

    const { host, port, password } = redisConfig();
    log('Cache Redis host', host);
    log('Cache Redis port', port);

    if (redis) {
      log('Cache Redis disconnect');
      redis.disconnect();
    }

    redis = new Redis({
      port,
      host,
      password,
    });

    ['connect', 'close', 'reconnecting', 'end'].forEach((eventName) => {
      redis.on(eventName, () => {
        log(`Cache Redis event: ${eventName}`);
      });
    });

    redis.on('error', async (error) => {
      log('Cache Redis event: error', error);
      if (redis) {
        log('Cache Redis status', redis.status);
        log('Cache Redis disconnect');
        redis.disconnect();
        redis = null;
      }
      resolve();
    });

    redis.on('ready', () => {
      log('Cache Redis event: ready');
      resolve();
    });
  });
}

async function set(key, value) {
  if (!redis || redis.status !== 'ready') {
    log('Cache SET simple-cache', key, value);
    simpleCache.set(key, value);
    return;
  }

  try {
    log('Cache SET redis-cache', key, value);
    const oneDayInSeconds = 86400 * 3;
    const timingStart = Date.now();
    await redis.set(key, value, 'EX', oneDayInSeconds);
    log('Cache SET redis-cache timing', Date.now() - timingStart);
  } catch (error) {
    log('Cache SET redis-cache error', error);
  }
}

async function get(key) {
  if (!redis || redis.status !== 'ready') {
    log('Cache GET simple-cache', key);
    return simpleCache.get(key);
  }

  try {
    log('Cache GET redis-cache', key);
    const timingStart = Date.now();
    const value = await redis.get(key);
    log('Cache GET redis-cache timing', Date.now() - timingStart);
    return value;
  } catch (error) {
    log('Cache GET redis-cache error', error);
  }
}

module.exports = {
  auth,
  set,
  get,
  getRedisStatus: () => redis && redis.status,
  simpleCacheSize: () => simpleCache.size,
  _memoryCache: simpleCache,
};
