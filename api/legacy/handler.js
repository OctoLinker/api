const { parse } = require('url');
const querystring = require('querystring');
const got = require('got');
const tracking = require('../src/utils/tracking');
const log = require('../src/utils/log');

const logPrefix = log.prefix;

tracking.init();

module.exports = async (req, res) => {
  let payload = [];

  const meta = {
    event: '2meta',
    properties: {
      Region: process.env.NOW_REGION || 'unknown',
      'Instance Name': logPrefix,
      Legacy: true,
    },
  };

  await tracking.track([meta]);

  const url = parse(req.url);

  if (req.method === 'GET' && req.url.startsWith('/api/q/')) {
    const paramUrl = req.url.replace('/api/q/', '');

    const registry = paramUrl.slice(0, paramUrl.indexOf('/'));
    const target = paramUrl.slice(paramUrl.indexOf('/') + 1);

    payload = [{ type: registry, target }];
  } else if (req.method === 'GET' && req.url.startsWith('/api/ping')) {
    const query = querystring.parse(url.query);

    if (query && query.url) {
      payload = [{ type: 'ping', target: query.url }];
    }
  }

  if (!payload.length) {
    return res.end();
  }

  let protocol = 'https://';

  if (process.env.NODE_ENV === 'test') {
    protocol = 'http://';
  }

  const bulkUrl = `${protocol}${req.headers.host}/api/`;

  got
    .post({
      json: true,
      url: bulkUrl,
      body: payload,
    })
    .then(({ body }) => {
      if (body.result && body.result[0] && body.result[0].result) {
        res.end(
          JSON.stringify({
            url: body.result[0].result,
          }),
        );
      }
      res.end(JSON.stringify({}));
    })
    .catch(() => {
      res.end(JSON.stringify({}));
    });
};
