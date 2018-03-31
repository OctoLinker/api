const insight = require('../utils/insight.js');
const promiseLimit = require('promise-limit');
const countBy = require('lodash.countby');

const MAXIMUM_CONCURREN_TREQUESTS = 20;

function track(request) {
  const { payload } = request;

  const trackData = Object.assign({
    totalLength: payload.length,
  }, countBy(payload, 'type'));

  insight.trackEvent('bulk', trackData, request);
}

const register = (server) => {
  server.route([{
    path: '/bulk',
    method: 'POST',
    config: {
      handler: async (request) => {
        const { payload } = request;

        track(request);

        const limit = promiseLimit(MAXIMUM_CONCURREN_TREQUESTS);

        return Promise.all(payload.map((item) => {
          if (item.type === 'registry') {
            return limit(() => server.inject({
              method: 'get',
              url: `/q/${item.registry}/${item.target}`,
            }));
          } else if (item.type === 'ping') {
            return limit(() => server.inject({
              method: 'get',
              url: `/ping?url=${item.target}`,
            }));
          }
        }))
        .then(values => values.map((item) => {
          if (item && item.result && item.result.url) {
            return item.result.url;
          }

          return null;
        }));
      },
    },
  }]);
};

exports.plugin = {
  name: 'Bulk',
  version: '1.0.0',
  register,
};
