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


/**
 * debug
 *
 * @param {String} name
 * @return {Function}
 */
utils.debug = (name) => {
  return createDebug('npm.best:' + name);
};

utils.logo = () => {
  console.log(fs.readFileSync(path.resolve(__dirname, 'logo.txt')).toString());
};


let debug = utils.debug('utils');

utils.bugfree();
