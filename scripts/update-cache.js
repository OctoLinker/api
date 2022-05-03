const fs = require('fs');
const got = require('got');
const npmStaticCache = require('../src/utils/static-cache.json');

const list = Object.keys(npmStaticCache);
const newCacheFile = {};

async function next(item) {
  if (list.length === 0) {
    fs.writeFileSync('./src/utils/static-cache.json', JSON.stringify(newCacheFile, null, 2));
    return;
  }

  const [type, ...target] = item.split('_');

  const response = await got.post({
    json: true,
    url: 'http://localhost:3000/',
    body: [{ type, target: target.join('_') }],
  });

  if (response.body.result[0] && response.body.result[0].result) {
    newCacheFile[`${type}_${target}`] = response.body.result[0].result;
  }

  next(list.shift());
}

next(list.shift());
