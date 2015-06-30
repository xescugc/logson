module.exports = function(format, cb, options) {

  options = options || {};

  // Right not it only supports 'default' format
  format = 'default';

  var extras = options.extras;

  var parent = options.parent;

  return function(req, res, next) {
    res.on('finish', function() {
      var log = {
        headers: req.headers,
        url: req.originalUrl,
        body: req.body,
        query: req.query
      }

      if (parent) {
        var content = log; 
        log = {};
        log[parent] = content;
      }

      if (extras) {
        extras.foEach(function(c, i, a) {
          Object.keys(c).forEach(function(_c, _i, _a) {
            log[_c] = c[_c];
          })
        })
      }

      cb(log);
    })
    next();
  }
}
