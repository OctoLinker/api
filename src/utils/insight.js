'use strict';

var keenIO = require('keen.io');
var keen;

function sendEvent(eventName, data) {
  if (keen) {
    keen.addEvent(eventName, data);
  } else {
    console.log(eventName, data);
  }
}

function init() {
  if (process.env.KEEN_PROJECT_ID) {
    keen = keenIO.configure({
        projectId: process.env.KEEN_PROJECT_ID,
        writeKey: process.env.KEEN_WRITE_KEY
    });
  }

  return {
    sendEvent: sendEvent
  };
}

module.exports = {
  init: init
};
