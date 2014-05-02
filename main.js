
'use strict';
/* jshint node:true */

var express = require('express');
var bodyParser = require('body-parser');
var models = require('./models/main.js');

var app = express();

/*
  We accept json hence we should parse it for all routes.
*/
app.use(bodyParser());

/*
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  Create a custom error object that includes the HTML status code to return.
*/
function WebError(message, status) {
    this.name = 'WebError';
    this.status = status;
    this.message = message;
    this.stack = (new Error()).stack;
}
WebError.prototype = Error;

/*
  any route with `model` param in it should grab the model and save it to the
  locals for access in the later middle-ware. If there isn't one then pass an
  error into the error handler.
*/
app.param('model', function(req, res, next, modelName) {
  if (models.hasOwnProperty(modelName)) {
    res.locals.model = models[modelName];
    return next();
  } else {
    return next(new WebError('missing model ' + modelName, 404));
  }
});

/*
  any route with `id` param can grab the object from the model. The error will
  be null if it all worked hence will continue properly.
*/
app.param('id', function(req, res, next, idName) {
  res.locals.model.findById(idName, function(err, result) {
    res.locals.id = idName;
    res.locals.elem = result;
    return next(err);
  });
});

/*
  just return true on the root route so we can easily test if it is alive.
*/
app.get('/', function(req, res, next) {
  res.json(true);
});

/*
  most of the routes call this to return json if there is no error or pass the
  error into the handler if there is one.
*/
function makeGenericCallback(res, next) {
  return function(err, result) {
    if (err) {
      return next(err);
    }
    res.json(result);
  };
}

/*
 this defines the two calls for the route below. As we have the model object it
 is fully generic. If the we request a model that doesn't exist then it will
 error before it gets here.
*/
app.route('/api/:model')
  // get all
  .get(function(req, res, next) {
    res.locals.model.getAll(makeGenericCallback(res, next));
  })
  // create
  .post('/api/:model', function(req, res, next) {
    res.locals.model.create(req.body, makeGenericCallback(res, next));
  });

/*
  again we can assume the element exists at this point. The generic handler
  would have dealt with it if it didn't.
*/
app.route('/api/:model/:id')
  // get one
  .get(function(req, res, next) {
    res.json(res.locals.elem.toJson());
  })
  // update
  .put(function(req, res, next) {
    res.locals.elem.update(req.body, makeGenericCallback(res, next));
  })
  // delete
  .del(function(req, res, next) {
    res.locals.model.delete(res.locals.id, makeGenericCallback(res, next));
  });

/*
  as this is the last normal route in the list it gets called if there are no
  other routes defined. Hence we can use this as the 404 handler.
*/
app.use(function(req, res, next){
  res.json(404, {msg: 'route not found'});
});

/*
  error handling
  As this is a four parameter middleware it catches errors too.
  Most of the time we will throw a WebError that has a basic msg and status
  but we can deal with generic `Error` objects without a status by defaulting
  to a status of 500. And with more complex error objects by letting them
  create their own return message.
  http://expressjs.com/guide.html#error-handling
*/
app.use(function(err, req, res, next) {
  var msg = {msg: err.message};
  if (typeof err.toJson === 'function') {
    msg = err.toJson();
  }
  res.json(err.status || 500, msg);
});

app.listen(3000);
