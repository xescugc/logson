# logson

[![Build Status][travis-image]][travis-url]
[![Gitter][gitter-image]][gitter-url]

Simple middleware library to get the application logs (Express) and do whatever you want with them

## API

```js
  var logson = require('logson');
```

### logson(options|callback, [callback])

You can use it with options or without, in this case the first param will be the callback.

```js
  var logson = require('logson');

  logson(function(log) {
    // Then you can use the log here
  });
```

With options:

```js
  var logson = require('logson');

  var options = {
    parent: 'parent'
  }

  logson(options, function(log) {
    // Then you can use the log here
  })
```

By default the format is the following:

```js
  {
    headers: {},
    url: '',
    body: {},
    query: {}
  }
```

### Options

#### parent

This options encapsulates the log object:

```js
  var logson = require('logson');

  var options = {
    parent: 'parent'
  };

  logson(options, funciton(log) {
    // The log object is { parent: log }
  })
```

#### extras

With this option you can add extra fields to the JSON log, when extras are defined you can have access to the `req` and `res` objects:

```js
  var logson = require('logson');

  var options = {
    extras: function(req, res) {
      return {
        cookies: req.cookies
      }
    }
  };

  logson(options, funciton(log) {
    // The log object has the cookies field on it
  })
```

`extras` use a deepmerge methology so the object returned with it will be merged with the log.

**NOTE:** With `extras` you can override existing fields in the log object.

#### override

This option will disable all the logson formats, and will only add the `extra` fields:

```js
  var logson = require('logson');

  var options = {
    override: true
  };

  logson(options, funciton(log) {
    // The log is {}
  })
```

## Examples

A simple Use Case for `logson` is to save the log object to the DB, for example elastic:

```js
  // Your elastic configuration
  var elastic = require('./elastic');
  var app = require('express')();

  app.use(logson(function(log) {
    elastic.create({
      index: 'index',
      type: 'type',
      body: log
    });
  })
```

If you want to save the cookies and wrap the log into a `request` name use the following:

```js
  // All your app configuration
  var cookieParser = require('cookie-parser');

  app.use(cookieParser('pass'));

  var conf = {
    parent: 'request',
    extras: function(req, res) {
      return {
        request: {
          headers: {
            cookeis: req.signedCookies
          }
        }
      }
    }
  };

  app.use(conf, logson(function(log) {
    elastic.create({
      index: 'index',
      type: 'type',
      body: log
    });
  })
```

## License

[MIT](LICENSE)

[travis-image]: https://travis-ci.org/XescuGC/logson.svg
[travis-url]: https://travis-ci.org/XescuGC/logson
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/XescuGC/logson?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge
