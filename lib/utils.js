/**
 * npm.link
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var createDebug = require('debug'); 
var utils = module.exports = exports = require('lei-utils').extend({});


/**
 * debug
 * 
 * @param {String} name
 * @return {Function}
 */
utils.debug = function (name) {
  return createDebug('npm.link:' + name);
};




var debug = utils.debug('utils');
