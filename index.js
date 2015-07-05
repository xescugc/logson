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
        var extraFields = extras(req, res);
        setExtras(extraFields, log);
      }

      if (override) {
        log = {};
        if (extras) {
          var extraFields = extras(req, res);
          setExtras(extraFields, log);
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

function setExtras(extras, log) {
  Object.keys(extras).forEach(function(c, i, a) {
    log[c] = extras[c];
  })
}

function generateLog(format, req, res) {
  return {
    headers: req.headers,
    url: req.originalUrl,
    body: req.body,
    query: req.query
  }
}
