'use strict';

const keenIO = require('keen.io');
let instance;

function init() {
  if (!process.env.KEEN_PROJECT_ID) {
    return;
  }

  if (!instance) {
    init();
  }

  instance = keenIO.configure({
      projectId: process.env.KEEN_PROJECT_ID,
      writeKey: process.env.KEEN_WRITE_KEY
  });
}

function trackEvent(eventKey, eventData, request) {
  const data = Object.assign({}, eventData);

  if (request && request.headers && request.headers.referer) {
    data.referer = request.headers.referer;
  }

  if (instance) {
    instance.addEvent(eventKey, data);
  }
}

function trackError(eventKey, err, eventData, request) {
  const data = Object.assign({}, eventData);

  if (!err.isBoom) {
    data.errorMessage = err.message;
    data.errorStack = err.stack;
  }

  trackEvent(
    eventKey || 'unkown_error',
    data,
    request
  );
}

module.exports = {
  trackEvent,
  trackError,
}
