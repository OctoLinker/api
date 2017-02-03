const assert = require('assert');
const sinon = require('sinon');
const jpath = require('json-path');
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
    const json = {
      foo: '',
      bar: 'blub',
    };
    const xpaths = [
      '/foo',
      '/bar',
    ];

    it('calls jpath.resolve for each xpath entry', () => {
      xpathHelper({}, xpaths);

      assert.equal(jpathResolveStub.callCount, xpaths.length);
      assert.equal(jpathResolveStub.args[0][1], xpaths[0]);
      assert.equal(jpathResolveStub.args[1][1], xpaths[1]);
    });

    it('calls jpath.resolve with json passed in', () => {
      xpathHelper(json, xpaths);

      assert.deepEqual(jpathResolveStub.args[0][0], json);
    });

    it('ignores empty values', () => {
      jpathResolveStub.onCall(0).returns(['']);
      jpathResolveStub.onCall(1).returns(['blub']);

      const result = xpathHelper(json, xpaths);
      assert.equal(result, 'blub');
    });
  });
});
