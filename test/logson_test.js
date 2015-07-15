var logson = require('..');
var chai = require('chai');
var expect = chai.expect;
var http = require('http');
var httpMocks = require('node-mocks-http');
var EventEmitter = require('events').EventEmitter;


describe('Logson', function() {
  describe('default', function() {
    it('must return the default Object', function(done) {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
      var result = logson(function(log) {
        expect(log).to.eql({});
        done();
      })
      result(req, res, nextFunction.bind(null, res));
    })
    it('must return a Object with the _logson setted', function (done) {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
      var result = logson(function(log) {
        expect(log).to.eql({test: true});
        done();
      })
      result(req, res, nextFunction.bind(null, res, req));
    })
  })
  describe('with options', function() {
    it('with parent', function(done) {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
      var result = logson({parent: 'parent'}, function(log) {
        expect(log).to.eql({parent: {} });
        done();
      })
      result(req, res, nextFunction.bind(null, res));
    })
    it('with extras', function(done) {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
      var options = {
        extras: function(req, res) {
          return {
            cookies: req.cookies
          }
        }
      }
      var result = logson(options, function(log) {
        expect(log).to.eql({ cookies: {} });
        done();
      })
      result(req, res, nextFunction.bind(null, res));
    })
    it('with extras in deep merge', function(done) {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
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
        expect(log).to.eql({ headers: {cookies: {}} });
        done();
      })
      result(req, res, nextFunction.bind(null, res));
    })
    describe('with formats', function(done) {
      it('combined', function(done) {
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
        var result = logson({format: 'combined'}, function(log) {
          expect(log).to.have.all.keys([
            'remoteAddr', 'date', 'method',
            'url', 'httpVersion', 'status',
            'contentLength', 'referrer', 'userAgent'
          ]);
          done();
        })
        result(req, res, nextFunction.bind(null, res));
      })
      it('common', function (done) {
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
        var result = logson({format: 'common'}, function(log) {
          expect(log).to.have.all.keys([
            'remoteAddr', 'date', 'method',
            'httpVersion', 'status',
            'contentLength'
          ]);
          done();
        })
        result(req, res, nextFunction.bind(null, res));
      })
      it('dev', function (done) {
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
        var result = logson({format: 'dev'}, function(log) {
          expect(log).to.have.all.keys([
            'method', 'status', 'responseTime',
            'contentLength'
          ]);
          done();
        })
        result(req, res, nextFunction.bind(null, res));
      })
      it('short', function (done) {
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
        var result = logson({format: 'short'}, function(log) {
          expect(log).to.have.all.keys([
            'remoteAddr', 'url', 'httpVersion',
            'method', 'responseTime', 'contentLength'
          ]);
          done();
        })
        result(req, res, nextFunction.bind(null, res));
      })
      it('tiny', function(done) {
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
        var result = logson({format: 'tiny'}, function(log) {
          expect(log).to.have.all.keys([
            'method', 'url', 'status',
            'responseTime', 'contentLength'
          ]);
          done();
        })
        result(req, res, nextFunction.bind(null, res));
      })
      it('invalid format', function() {
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
        var result = logson({format: 'pepito'}, function(log) { });
        expect( function() {
          result(req, res, nextFunction.bind(null, res)) 
        }).to.throw("'pepito' is not a valid format");
      })
    })
  })
  describe('combinations', function () {
    it('with _logson, extras and format', function (done) {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse({ eventEmitter: EventEmitter });
      var opts = {
        format: 'dev',
        extras: function (req, res) {
          return  { cookies: req.cookies }
        }
      }
      var result = logson(opts, function(log) {
        expect(log).to.have.all.keys([
            'method', 'status', 'responseTime',
            'contentLength', 'cookies', 'test'
        ])
        done();
      })
      result(req, res, nextFunction.bind(null, res, req));
    })
  })
})

function nextFunction (res, req) {
  if (req)
    req._logson.test = true;

  res.end({});
  res.emit('finish');
}
