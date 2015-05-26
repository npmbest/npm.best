/**
 * npm.link
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var rd = require('rd');
var config = require('../../config');
var utils = require('../../lib/utils');
var middleware = require('../middleware');
var debug = utils.debug('routes');


module.exports = function (app) {
  
  app.get('/', function (req, res, next) {
    res.end('Hello, npm.link');
  });

};
