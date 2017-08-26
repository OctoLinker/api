const Joi = require('joi');
const got = require('got');
const findReachableUrls = require('find-reachable-urls');
const parseString = require('xml2js').parseString;
const Boom = require('boom');
const insight = require('../utils/insight');

function notFoundResponse() {
  return Boom.notFound('Package not found', {
    eventKey: 'package_not_found',
  });
}

const praseXML = async str => new Promise((resolve, reject) => {
  parseString(str, (err, result) => {
    if (err) {
      return reject(err);
    }

    resolve(result);
  });
});

const getMavenResponse = async (namespace) => {
  const requestUrl = `https://search.maven.org/solrsearch/select?wt=json&rows=1&q=fc:%22${namespace}%22`;
  const response = await got.get(requestUrl, {
    json: true,
  });

  const { response: json } = response.body;

  if (json.numFound === 0) {
    throw new Error(`No package found for ${namespace}`);
  }

  return json.docs[0];
};

const getPomContent = async (item) => {
  const groupId = item.g.replace(/\./g, '\/');
  const artifactId = item.a.replace(/\./g, '\/');
  const version = item.v;

  const pomPath = `${groupId}/${artifactId}/${version}/${artifactId}-${version}.pom`;
  const requestUrl = `https://search.maven.org/remotecontent?filepath=${pomPath}`;

  const response = await got.get(requestUrl);
  const json = await praseXML(response.body);

  return json.project;
};

const findPossibleUrls = (pom) => {
  const urls = [];

  try {
    urls.push(pom.scm[0].url[0]);
  } catch (err) {} // eslint-disable-line no-empty

  try {
    urls.push(pom.url[0]);
  } catch (err) {} // eslint-disable-line no-empty

  return urls;
};

const resolveUrl = async (namespace) => {
  let mavenResponse;

  try {
    mavenResponse = await getMavenResponse(namespace);
  } catch (err) {
    if (err.code === 404) {
      throw notFoundResponse();
    }

    throw Boom.wrap(err);
  }

  const pom = await getPomContent(mavenResponse);
  const urls = await findReachableUrls(findPossibleUrls(pom));

  if (urls.length === 0) {
    throw notFoundResponse();
  }

  return urls[0];
};

exports.register = (server, options, next) => {
  server.route([{
    path: '/q/maven/{package*}',
    method: 'GET',
    config: {
      validate: {
        params: {
          package: Joi.required(),
        },
      },
      handler: async (request, reply) => {
        const pkg = request.params.package;

        const eventData = {
          registry: 'maven',
          package: pkg,
          referer: request.headers.referer,
        };

        try {
          const url = await resolveUrl(pkg);
          reply({
            url,
          });

          eventData.url = url;
          insight.trackEvent('resolved', eventData, request);
        } catch (err) {
          const eventKey = (err.data || {}).eventKey;
          insight.trackError(eventKey, err, eventData, request);
          reply(err);
        }
      },
    },
  }]);

  next();
};

exports.register.attributes = {
  pkg: {
    name: 'Maven Resolver',
    version: '1.0.0',
  },
};
