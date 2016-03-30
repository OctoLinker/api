'use strict';

const keenIO = require('keen.io');
let instance;

function sendEvent(eventName, data) {
  if (instance) {
    instance.addEvent(eventName, data);
  }
}

function init() {
  if (!process.env.KEEN_PROJECT_ID) {
    return;
  }

  instance = keenIO.configure({
      projectId: process.env.KEEN_PROJECT_ID,
      writeKey: process.env.KEEN_WRITE_KEY
  });
}

module.exports = function (eventName, data) {
  if (!instance) {
    init();
  }

  sendEvent(eventName, data);
}
