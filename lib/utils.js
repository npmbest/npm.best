/**
 * npm.best
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var fs = require('fs');
var createDebug = require('debug'); 
var utils = module.exports = exports = require('lei-utils').extend({});


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


var debug = utils.debug('utils');

utils.bugfree();
