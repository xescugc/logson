var logson = require('..');
var chai = require('chai');
var expect = chai.expect;
var http = require('http');
var httpMocks = require('node-mocks-http');
var EventEmitter = require('events').EventEmitter;

describe('Logson', function() {
  describe('default', function() {
    it('must return the default JSON', function(done) {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse({
          eventEmitter: EventEmitter
      });
      var result = logson(function(log) {
        expect(log).to.eql({ headers: {}, url: '', body: {}, query: {} });
        done();
      })
      result(req, res, nextFunction.bind(null, res));
    })
  })
  describe('with options', function() {
    it('with parent', function(done) {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse({
          eventEmitter: EventEmitter
      });
      var result = logson({parent: 'parent'}, function(log) {
        expect(log).to.eql({parent: { headers: {}, url: '', body: {}, query: {} }});
        done();
      })
      result(req, res, nextFunction.bind(null, res));
    })
    it('with extras', function(done) {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse({
          eventEmitter: EventEmitter
      });
      var options = {
        extras: function(req, res) {
          return {
            cookies: req.cookies
          }
        }
      }
      var result = logson(options, function(log) {
        expect(log).to.eql({ headers: {}, url: '', body: {}, query: {}, cookies: {}});
        done();
      })
      result(req, res, nextFunction.bind(null, res));
    })
    it('with extras in deep merge', function(done) {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse({
          eventEmitter: EventEmitter
      });
      var options = {
        extras: function(req, res) {
          return {
            headers: {
              cookies: req.cookies
            }
          }
        }
      }
      var result = logson(options, function(log) {
        expect(log).to.eql({ headers: {cookies: {}}, url: '', body: {}, query: {}});
        done();
      })
      result(req, res, nextFunction.bind(null, res));
    })
    describe('with override', function() {
      it('default', function(done) {
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse({
          eventEmitter: EventEmitter
        });
        var result = logson({ override: true }, function(log) {
          expect(log).to.eql({});
          done();
        })
        result(req, res, nextFunction.bind(null, res));
      })
      it('extras', function(done) {
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse({
          eventEmitter: EventEmitter
        });
        var options = {
          override: true,
          extras: function(req, res) {
            return {
              cookies: req.cookies
            }
          }
        }
        var result = logson(options, function(log) {
          expect(log).to.eql({cookies: {}});
          done();
        })
        result(req, res, nextFunction.bind(null, res));
      })
      it('extras in deep merge', function(done) {
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse({
          eventEmitter: EventEmitter
        });
        var options = {
          override: true,
          extras: function(req, res) {
            return {
              headers: {
                cookies: req.cookies
              }
            }
          }
        }
        var result = logson(options, function(log) {
          expect(log).to.eql({ headers: {cookies: {}}});
          done();
        })
        result(req, res, nextFunction.bind(null, res));
      })
    })
  })
})

function nextFunction (res) {
  res.end();
  res.emit('finish');
}

