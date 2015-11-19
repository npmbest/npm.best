'use strict';

/**
 * npm.best
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

let path = require('path');
let fs = require('fs');
var util = require('util');
let createDebug = require('debug');
let utils = module.exports = exports = require('lei-utils').extend({});
utils.clc = require('cli-color');
utils.format = util.format;
var async = require('async');


Array.range = function (n) {
  // Array.range(5) --> [0,1,2,3,4]
  return Array.apply(null,Array(n)).map((x,i) => i)
};

Object.defineProperty(Array.prototype, 'chunk', {
  value: function(n) {
    // ACTUAL CODE FOR CHUNKING ARRAY:
    return Array.range(Math.ceil(this.length / n)).map((x, i) => this.slice(i * n, i * n + n));
  }
});


/**
 * debug
 *
 * @param {String} name
 * @return {Function}
 */
utils.debug = function (name) {
  return createDebug('npm.best:' + name);
};

utils.logo = function () {
  console.log(fs.readFileSync(path.resolve(__dirname, 'logo.txt')).toString());
};


let debug = utils.debug('utils');

utils.bugfree();

utils.multiThreadEachSeries = function (thread, list, onItem, onEnd) {
  var chunks = list.chunk(thread);
  async.each(chunks, function (list, next) {
    async.eachSeries(list, onItem, next);
  }, onEnd);
};
