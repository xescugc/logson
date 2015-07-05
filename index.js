var merge = require('deepmerge');
module.exports = function(options, cb) {


  if (typeof options === 'function') {
    cb = options;
    options = {};
  };

  var extras = options.extras;

  var parent = options.parent;

  var override = options.override;

  var format = options.format;

  return function(req, res, next) {
    res.on('finish', function() {
      var log = generateLog(format, req, res);

      if (parent)
        log = setParent(parent, log);

      if (extras) {
        log = merge(log, extras(req, res));
      }

      if (override) {
        log = {};
        if (extras) {
          log = merge(log, extras(req, res));
        }
      }

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
  return {
    headers: req.headers,
    url: req.originalUrl,
    body: req.body,
    query: req.query
  }
}
