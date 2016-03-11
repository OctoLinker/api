'use strict';

// var assert = require('assert');
// var sinon = require('sinon');
// var rewire = require('rewire');
// var composerResolver = rewire('../src/resolver/composer');

xdescribe('composer resolver', function() {

  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
    this.gotStub = sinon.stub();
    this.githubUrlStub = sinon.stub();

    composerResolver.__set__({
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
    composerResolver('pale-ale-beer', callbackStub);
    this.gotStub.callArgWith(2, err);

    assert.equal(callbackStub.args[0][0], err);
    assert.equal(callbackStub.args[0][1], undefined);
  });

  it('fetch package information from the composer registry', function() {
    composerResolver('pale-ale-beer');

    assert.equal(this.gotStub.callCount, 1);
    assert.equal(this.gotStub.args[0][0], 'https://packagist.org/packages/pale-ale-beer.json');
    assert.equal(this.gotStub.args[0][1].json, true);
  });

  it('returns package url from response', function() {
    var callbackStub = this.sandbox.stub();
    var response = {
      package: {
        name: 'pale-ale-beer',
        repository: 'https://linkerhub.com/pale-ale-beer'
      }
    };
    composerResolver('pale-ale-beer', callbackStub);
    this.githubUrlStub.returns(response.package.repository);
    this.gotStub.callArgWith(2, null, response);

    assert.equal(this.githubUrlStub.args[0][0], response.package.repository);
    assert.equal(this.githubUrlStub.callCount, 1);
    assert.equal(callbackStub.args[0][1], 'https://linkerhub.com/pale-ale-beer');
  });

  it('returns packagist.org url when package was not resolvable', function() {
    var callbackStub = this.sandbox.stub();
    var err = {
      code: 404
    };
    composerResolver('pale-ale-beer', callbackStub);
    this.gotStub.callArgWith(2, err);

    composerResolver('pale-ale-beer', callbackStub);
    assert.equal(callbackStub.args[0][1], 'https://packagist.org/packages/pale-ale-beer');
  });

  it('returns empty string when response was invalid', function() {
    var callbackStub = this.sandbox.stub();
    var response = {};
    composerResolver('pale-ale-beer', callbackStub);
    this.githubUrlStub.returns('');
    this.gotStub.callArgWith(2, null, response);

    assert.equal(callbackStub.args[0][1], '');
  });
});
