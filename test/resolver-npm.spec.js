'use strict';

var assert = require('assert');
var sinon = require('sinon');
var rewire = require('rewire');
var npmResolver = rewire('../src/resolver/npm');

describe('npm resolver', function() {

  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
    this.gotStub = sinon.stub();
    this.findRepositoryUrlStub = sinon.stub();

    npmResolver.__set__({
        'got': this.gotStub,
        'findRepositoryUrl': this.findRepositoryUrlStub
    });
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('returns an error to the callback', function() {
    var callbackStub = this.sandbox.stub();
    var err = new Error('some error');
    npmResolver('pale-ale-beer', callbackStub);
    this.gotStub.callArgWith(2, err);

    assert.equal(callbackStub.args[0][0], err);
    assert.equal(callbackStub.args[0][1], undefined);
  });

  it('fetch package information from the npm registry', function() {
    npmResolver('pale-ale-beer');

    assert.equal(this.gotStub.callCount, 1);
    assert.equal(this.gotStub.args[0][0], 'https://registry.npmjs.org/pale-ale-beer');
    assert.equal(this.gotStub.args[0][1].json, true);
  });

  it('returns package url from response', function() {
    var callbackStub = this.sandbox.stub();
    var response = {
      name: 'pale-ale-beer'
    };
    npmResolver('pale-ale-beer', callbackStub);
    this.findRepositoryUrlStub.returns('https://linkerhub.com/pale-ale-beer');
    this.gotStub.callArgWith(2, null, response);

    assert.equal(this.findRepositoryUrlStub.args[0][0], response);
    assert.equal(this.findRepositoryUrlStub.callCount, 1);
    assert.equal(callbackStub.args[0][1], 'https://linkerhub.com/pale-ale-beer');
  });

  it('returns npmjs.org url when package was not resolvable', function() {
    var callbackStub = this.sandbox.stub();
    var response = {
      name: 'pale-ale-beer'
    };
    npmResolver('pale-ale-beer', callbackStub);
    this.findRepositoryUrlStub.returns('');
    this.gotStub.callArgWith(2, null, response);

    assert.equal(callbackStub.args[0][1], 'https://npmjs.org/package/pale-ale-beer');
  });
});
