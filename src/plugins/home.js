const pkg = require('../../package.json');
const insight = require('../utils/insight.js');

exports.register = (server, options, next) => {
    server.route([{
        path: '/',
        method: 'GET',
        config: {
          handler: (request, reply) => {
            var repoUrl = pkg.repository.url;
            var short = repoUrl.replace('https://github.com/', '');
            var versionInfo = '<a href="' + repoUrl + '">' + short + '@' + pkg.version + '</a>';

            insight.trackEvent('shows_index', {
              version: pkg.version
            }, request);

            reply(versionInfo);
          }
        }
    }]);

    next();
};

exports.register.attributes = {
  pkg: {
    name: 'Home',
    version: '1.0.0'
  }
};
