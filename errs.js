'use strict';
/*jshint node:true*/


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

module.exports.WebError = WebError;
