/**
 * npm.best
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var config = require('../config');
var utils = require('../lib/utils');
var model = require('../lib/model');
var middleware = require('./middleware');
var express = require('express');
var serveStatic = require('serve-static');;
var cookieParser = require('cookie-parser');
var expressLiquid = require('express-liquid');
var i18n = require("i18n");


i18n.configure({
  locales:['en', 'zh'],
  defaultLocale: 'en',
  cookie: 'language',
  directory: path.resolve(__dirname, './i18n'),
  updateFiles: false
});


var app = express();
app.use('/assets', serveStatic(path.resolve(__dirname, 'assets')));
app.use(cookieParser(config.get('web.cookie.secret')));
app.use(middleware.apiUtils);
app.use(i18n.init);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', expressLiquid({
  context: require('./filters').context, 
  traceError: true
}));
app.use(expressLiquid.middleware);
app.use(function (req, res, next) {
  res.context.setFilter('i18n', res.__);
  next();
});


app.use('/api', middleware.cache);
require('./routes')(app);


app.listen(config.get('web.port'), config.get('web.host'), function () {
  utils.logo();
  console.log('server listen on %s:%s', config.get('web.host'), config.get('web.port'));
});
