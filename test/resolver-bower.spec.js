'use strict';

// var assert = require('assert');
// var sinon = require('sinon');
// var rewire = require('rewire');
// var bowerResolver = rewire('../src/resolver/bower');

xdescribe('bower resolver', function() {

  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
    this.gotStub = sinon.stub();
    this.githubUrlStub = sinon.stub();

    bowerResolver.__set__({
        'got': this.gotStub,
        'githubUrl': this.githubUrlStub
    });
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('returns an error to the callback', function() {
    var callbackStub = this.sandbox.stub();
    var err = new Error('some error');
    bowerResolver('pale-ale-beer', callbackStub);
    this.gotStub.callArgWith(2, err);

    assert.equal(callbackStub.args[0][0], err);
    assert.equal(callbackStub.args[0][1], undefined);
  });

  it('fetch package information from the bower registry', function() {
    bowerResolver('pale-ale-beer');

    assert.equal(this.gotStub.callCount, 1);
    assert.equal(this.gotStub.args[0][0], 'http://bower.herokuapp.com/packages/pale-ale-beer');
    assert.equal(this.gotStub.args[0][1].json, true);
  });

  it('returns package url from response', function() {
    var callbackStub = this.sandbox.stub();
    var response = {
      name: 'pale-ale-beer',
      url: 'https://linkerhub.com/pale-ale-beer'
    };
    bowerResolver('pale-ale-beer', callbackStub);
    this.githubUrlStub.returns(response.url);
    this.gotStub.callArgWith(2, null, response);

    assert.equal(this.githubUrlStub.args[0][0], response.url);
    assert.equal(this.githubUrlStub.callCount, 1);
    assert.equal(callbackStub.args[0][1], 'https://linkerhub.com/pale-ale-beer');
  });

  it('returns empty string when package was not resolvable', function() {
    var callbackStub = this.sandbox.stub();
    var response = {
      name: 'pale-ale-beer',
      url: 'https://linkerhub.com/pale-ale-beer'
    };
    bowerResolver('pale-ale-beer', callbackStub);
    this.githubUrlStub.returns('');
    this.gotStub.callArgWith(2, null, response);

    assert.equal(callbackStub.args[0][1], '');
  });

  it('returns empty string when response was invalid', function() {
    var callbackStub = this.sandbox.stub();
    var response = {};
    bowerResolver('pale-ale-beer', callbackStub);
    this.githubUrlStub.returns('');
    this.gotStub.callArgWith(2, null, response);

    assert.equal(callbackStub.args[0][1], '');
  });
});
