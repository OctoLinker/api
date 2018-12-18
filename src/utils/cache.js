const ms = require('ms');
const Receptacle = require('receptacle');

const cache = new Receptacle();

module.exports = {
  set: (key, value) => {
    cache.set(key, value, { ttl: ms('30m'), refresh: true });
  },
  get: key => cache.get(key),
  has: key => cache.has(key),
};
