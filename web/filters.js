/**
 * npm.link
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var parseUrl = require('url').parse;
var config = require('../config');
var utils = require('../lib/utils');
var model = require('../lib/model');
var expressLiquid = require('express-liquid');


var context = exports.context = expressLiquid.newContext();


context.setFilter('asset_url', function (url) {
  return url;
});
