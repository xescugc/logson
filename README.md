#Logson
Simple middleware library to get the application logs (Express) and do whatever you want with them

##API

```js
  var logson = require('logson');
```

###logson(options|callback, [callback])

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

###Options

####parent

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

This option is called **BEFORE** the `extras`, so the extra fields will be at the same level as the `parent`, which is the root.

####extras

With this option you can add extra fields to the JSON log, when extras are defined you can have access to the req and res objects:

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

####override

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

##License

[MIT](LICENSE)
