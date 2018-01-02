const pkg = require('../../package.json');
const insight = require('../utils/insight.js');

const register = (server) => {
  server.route([{
    path: '/',
    method: 'GET',
    config: {
      handler: (request) => {
        const repoUrl = pkg.repository.url;
        const short = repoUrl.replace('https://github.com/', '');
        const versionInfo = `<a href="${repoUrl}">${short}@${pkg.version}</a>`;

        insight.trackEvent('shows_index', {
          version: pkg.version,
        }, request);

        return versionInfo;
      },
    },
  }]);
};

exports.plugin = {
  name: 'Home',
  version: '1.0.0',
  register,
};
