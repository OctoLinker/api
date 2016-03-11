'use strict';

const assert = require('assert');
const sinon = require('sinon');
const jpath = require('json-path')
const xpathHelper = require('../src/utils/xpath-helper.js');

describe('xpath-helper', () => {
  let sandbox;
  let jpathResolveStub;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    jpathResolveStub = sandbox.stub(jpath, 'resolve').returns([]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('jpath', () => {
    let result;
    const json = {foo: 'bar'};
    const xpaths = [
      '/foo',
      '/bar',
    ];

    beforeEach(() => {
      result = xpathHelper(json, xpaths);
    });

    it('calls jpath.resolve for each xpath entry', () => {
      assert.equal(jpathResolveStub.callCount, xpaths.length);
      assert.equal(jpathResolveStub.args[0][1], xpaths[0]);
      assert.equal(jpathResolveStub.args[1][1], xpaths[1]);
    });

    it('calls jpath.resolve with json passed in', () => {
      assert.equal(jpathResolveStub.args[0][0], json);
    });
  });
});
