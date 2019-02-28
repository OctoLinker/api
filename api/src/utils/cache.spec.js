const redis = require('ioredis');
const cache = require('./cache.js');
require('./log.js');

jest.mock('./log.js');
jest.mock('ioredis');

describe('cache', () => {
  let redisInstance;

  function invokeEventHandler(calls, eventName) {
    const item = calls.find(([name]) => name === eventName);
    if (item && item[1]) {
      return item[1]();
    }

    throw new Error(`No handler for ${eventName} found`);
  }

  function instantiateAuth(eventName, status) {
    const promise = cache.auth();
    redisInstance = redis.mock.instances[0];
    invokeEventHandler(redisInstance.on.mock.calls, eventName);
    redisInstance.status = status;
    return promise;
  }

  afterEach(() => {
    // Force new redis instance creation
    redis.mock.instances[0].status = null;

    // Clear memory cache
    cache._memoryCache.clear();

    jest.clearAllMocks();
  });

  describe('configuration', () => {
    beforeEach(() => {
      process.env.NOW_REGION = 'sfo1';
      process.env.DEFAULT_REDIS_PORT = 'default-port';
      process.env.BRU1_REDIS_PORT = 'bru1-port';
      process.env.DEFAULT_REDIS_HOST = 'default-host';
      process.env.BRU1_REDIS_HOST = 'bru1-host';
      process.env.DEFAULT_REDIS_PASSWORD = 'default-pwd';
      process.env.BRU1_REDIS_PASSWORD = 'bru1-pwd';
    });

    it('connects to the default redis instance', () => {
      cache.auth();

      expect(redis).toBeCalledWith({
        port: 'default-port',
        host: 'default-host',
        password: 'default-pwd',
      });
    });

    it('connects to a redis instance near new region', () => {
      process.env.NOW_REGION = 'bru1';
      cache.auth();

      expect(redis).toBeCalledWith({
        port: 'bru1-port',
        host: 'bru1-host',
        password: 'bru1-pwd',
      });
    });
  });

  describe('auth', () => {
    it('resolves when redis emits "ready" event', () => {
      instantiateAuth('ready', 'ready');
    });

    it('resolves when redis emits "error" event', () => {
      const promise = instantiateAuth('error', null);
      expect(redisInstance.disconnect).toHaveBeenCalledTimes(1);
      return promise;
    });
  });

  describe('get', () => {
    describe('when not connected to redis', () => {
      it('reads value from memory cache', async () => {
        instantiateAuth('error', null);
        cache._memoryCache.set('memory-foo', 'memory-bar');
        const result = await cache.get('memory-foo');
        expect(result).toBe('memory-bar');
      });
    });

    describe('when connected to redis', () => {
      it('reads value form redis cache', async () => {
        instantiateAuth('ready', 'ready');

        redisInstance.get.mockReturnValue('redis-bar');
        const result = await cache.get('redis-foo');
        expect(result).toBe('redis-bar');
      });
    });
  });

  describe('set', () => {
    describe('when not connected to redis', () => {
      it('writes value to memory cache', async () => {
        instantiateAuth('error', null);

        cache.set('memory-foo', 'memory-bar');
        const result = await cache.get('memory-foo');
        expect(result).toBe('memory-bar');
      });
    });

    describe('when connected to redis', () => {
      it('writes value to redis cache', async () => {
        instantiateAuth('ready', 'ready');

        cache.set('redis-foo', 'redis-bar');
        expect(redisInstance.set).toBeCalledWith(
          'redis-foo',
          'redis-bar',
          'EX',
          86400 * 3,
        );
      });
    });
  });

  describe('getRedisStatus', () => {
    it('returns current redis status', async () => {
      instantiateAuth('ready', 'ready');
      expect(cache.getRedisStatus()).toBe('ready');
    });

    it('returns current redis status', async () => {
      instantiateAuth('ready', 'reconneting');
      expect(cache.getRedisStatus()).toBe('reconneting');
    });
  });

  describe('simpleCacheSize', () => {
    it('returns the size of the memory cache', async () => {
      instantiateAuth('ready', 'ready');
      cache._memoryCache.set('foo');
      cache._memoryCache.set('bar');
      expect(cache.simpleCacheSize()).toBe(2);
    });
  });
});
