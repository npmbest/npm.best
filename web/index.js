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


var app = express();
app.use('/assets', serveStatic(path.resolve(__dirname, 'assets')));
app.use(cookieParser(config.get('web.cookie.secret')));
app.use(middleware.apiUtils);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', expressLiquid({
  context: require('./filters').context, 
  traceError: true
}));
app.use(expressLiquid.middleware);


app.use('/api', middleware.cache);
require('./routes')(app);


app.listen(config.get('web.port'), config.get('web.host'));
console.log('server listen on %s:%s', config.get('web.host'), config.get('web.port'));
