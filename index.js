var merge = require('deepmerge');

module.exports = function(options, cb) {

  if (typeof options === 'function') {
    cb = options;
    options = {};
  };

  var extras = options.extras;

  var parent = options.parent;

  var format = options.format;

  return function(req, res, next) {
    req._logson = {};

    req._startAt = req._startTime = res._startAt = res._startTime = undefined;

    setTime(req);

    res.on('finish', function() {

      setTime(res);

      var log = generateLog(format, req, res);

      if (parent)
        log = setParent(parent, log);

      if (format)
        log = formatLog(format, log, req, res);

      if (extras)
        log = merge(log, extras(req, res));

      cb(log);
    })
    next();
  }
}

function setParent(parent, log) {
  var content = log; 
  log = {};
  log[parent] = content;
  return log;
}

function generateLog(format, req, res) {
  return req._logson;
}

function formatLog(format, log, req, res) {
  switch (format) {
    case 'combined':
      return setFormat(['remoteAddr', 'date', 'method', 'url', 'httpVersion', 'status', 'contentLength', 'referrer', 'userAgent'], log, req, res);
      break;
    case 'common':
      return setFormat([ 'remoteAddr', 'date', 'method', 'httpVersion', 'status', 'contentLength'], log, req, res);
      break;
    case 'dev':
      return setFormat([ 'method', 'status', 'responseTime', 'contentLength'], log, req, res);
      break;
    case 'short':
      return setFormat([ 'remoteAddr', 'url', 'httpVersion', 'method', 'responseTime', 'contentLength' ], log, req, res);
      break;
    case 'tiny':
      return setFormat([ 'method', 'url', 'status', 'responseTime', 'contentLength' ], log, req, res);
      break;
    default:
      throw new TypeError("'" + format + "' is not a valid format");
      break;
  }
}

function setFormat(attrs, log, req, res) {
  attrs.forEach(function(attr) {
    log = merge(log, eval('_' + attr + '(req, res)'));
  })
  return log;
}

function _remoteAddr (req, res) {
  var remoteAddr = req.ip
    || req._remoteAddress
    || (req.connection && req.connection.remoteAddress)
    || undefined;
  return { remoteAddr: remoteAddr };
}

function _date (req, res) {
  return { date: new Date().toISOString() };
}

function _method (req, res) {
  return { method: req.method };
}

function _url (req, res) {
  return { url: req.originalUrl || req.url };
}

function _httpVersion (req, res) {
  return { httpVersion: req.httpVersionMajor + '.' + req.httpVersionMinor };
}

function _status (req, res) {
  var status = res._header
    ? String(res.statusCode)
    : undefined
  return { status: status };
}

function _contentLength (req, res) {
  if (!res._header) {
    return { contentLength: undefined };
  }

  var header = res.getHeader('content-length');

  var contentLength = Array.isArray(header)
    ? header.join(', ')
    : header
  return { contentLength: contentLength };
}

function _referrer (req, res) {
  return { referrer: req.headers['referer'] || req.headers['referrer'] };
}

function _userAgent (req, res) {
  return { userAgent: req.headers['user-agent'] };
}

function _responseTime (req, res) {
  if (!req._startAt || !res._startAt) {
    return { responseTime: undefined };
  }

  var ms = (res._startAt[0] - req._startAt[0]) * 1e3
    + (res._startAt[1] - req._startAt[1]) * 1e-6

  return { responseTime: ms.toFixed(3) };
}

function setTime (obj) {
  obj._startAt = process.hrtime();
  obj._startTime = new Date();
}
