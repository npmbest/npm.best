/**
 * npm.link
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var config = require('../config');
var utils = require('../lib/utils');
var model = require('../lib/model');
var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');
var connect = require('connect');


var post = exports.post = connect();
post.use(multipart());
post.use(bodyParser.json());
post.use(bodyParser.urlencoded({extended: true}));
