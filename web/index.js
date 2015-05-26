/**
 * npm.link
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


var app = express();
app.use('/assets', serveStatic(path.resolve(__dirname, 'assets')));
app.use(cookieParser(config.get('web.cookie.secret')));
app.use(middleware.apiUtils);


require('./routes')(app);


app.listen(config.get('web.port'), config.get('web.host'));
console.log('server listen on %s:%s', config.get('web.host'), config.get('web.port'));
