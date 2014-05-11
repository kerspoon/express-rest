'use strict';
/*jshint node:true*/

var WebError = require('./errs').WebError;

function findById(id, callback) {
  callback(new WebError('not implemented', 500));
}

function getAll(callback) {
  callback(new WebError('not implemented', 500));
}

function create(callback) {
  callback(new WebError('not implemented', 500));
}

function destroy(id, callback) {
  callback(new WebError('not implemented', 500));
}

function Example() {

}

Example.prototype.toJson = function() {
  throw new WebError('not implemented', 500);
};

Example.prototype.update = function(data) {
  throw new WebError('not implemented', 500);
};

module.exports.example = {
  findById: findById,
  getAll: getAll,
  create: create,
  destroy: destroy
};

