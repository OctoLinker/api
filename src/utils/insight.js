const Keen = require('keen-tracking');

let instance;

function init() {
  if (!process.env.KEEN_PROJECT_ID) {
    return;
  }

  instance = new Keen({
    projectId: process.env.KEEN_PROJECT_ID,
    writeKey: process.env.KEEN_WRITE_KEY,
  });
}

function doNotTrack(request = {}) {
  if (!request.headers) {
    return false;
  }

  return [
    request.headers.dnt,
    request.headers['do-not-track'],
  ].includes('1');
}

function trackEvent(eventKey, eventData, request) {
  if (doNotTrack(request)) {
    return;
  }

  const data = Object.assign({}, eventData);

  if (request && request.headers && request.headers.referer) {
    data.referer = request.headers.referer;
  }

  if (instance) {
    instance.recordEvent(eventKey, data);
  } else {
    console.log(eventKey, data);
  }
}

function trackError(eventKey, err, eventData, request) {
  if (doNotTrack(request)) {
    return;
  }

  const data = Object.assign({}, eventData);

  if (!err.isBoom) {
    data.errorMessage = err.message;
    data.errorStack = err.stack;
  }

  trackEvent(eventKey || 'unkown_error', data, request);
}

init();

module.exports = {
  trackEvent,
  trackError,
};
