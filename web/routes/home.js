/**
 * npm.best
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var config = require('../../config');
var utils = require('../../lib/utils');
var middleware = require('../middleware');
var debug = utils.debug('routes:home');


module.exports = function (app) {

  app.get('/', function (req, res, next) {
    res.render('index');
  });

};
