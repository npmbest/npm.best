/**
 * npm.best
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var rd = require('rd');
var config = require('../../config');
var utils = require('../../lib/utils');
var debug = utils.debug('routes');


module.exports = function (app) {
  
  rd.eachFileFilterSync(__dirname, /\.js$/, function (f, s) {
    if (f === __filename) return;
    debug('load file: %s', f);
    require(f)(app);
  });

};
