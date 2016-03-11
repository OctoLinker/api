'use strict';

var assert = require('assert');
var sinon = require('sinon');
var rewire = require('rewire');
var resolver = rewire('../src/resolver');

var resolverTypes = ['npm', 'bower', 'composer'];

xdescribe('resolver', function() {

  beforeEach(function () {
    var rewireConf = {};
    this.sandbox = sinon.sandbox.create();

    resolverTypes.forEach(function(type) {
      this[type + 'Stub'] = this.sandbox.stub();
      rewireConf[type] = this[type + 'Stub'];
    }.bind(this));

    resolver.__set__(rewireConf);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('returns an error if the given registry is not supported', function() {
    var callbackStub = this.sandbox.stub();
    resolver('caramba', 'pale-ale-beer', callbackStub);

    assert.equal(callbackStub.args[0][0].message, 'Registry "caramba" is not supported');
  });

  resolverTypes.forEach(function(type) {
    it('calls ' + type + ' resolver', function() {
      var callbackStub = this.sandbox.stub();
      resolver(type, 'pale-ale-beer', callbackStub);

      assert.equal(this[type + 'Stub'].callCount, 1);
      assert.equal(this[type + 'Stub'].args[0][0], 'pale-ale-beer');
      assert.equal(this[type + 'Stub'].args[0][1], callbackStub);
    });
  });
});
