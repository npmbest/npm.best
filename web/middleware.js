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
var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');
var connect = require('connect');


var post = exports.post = connect();
post.use(multipart());
post.use(bodyParser.json());
post.use(bodyParser.urlencoded({extended: true}));


exports.apiUtils = function (req, res, next) {
  
  req.timestamp = Date.now();
  
  // 输出数据
  function output (data) {
    // 请求处理时间
    data.spent = Date.now() - req.timestamp;
    // 取得请求的数据格式
    var type = path.extname(parseUrl(req.url).pathname);
    switch (type) {
      /*case '.xml':
        return res.xml(data);*/
      default:
        return res.json(data);
    }
  }

  // 响应API成功结果
  res.apiSuccess = function (data) {
    output({
      status: 'OK',
      result: data
    });
  };

  // 响应API出错结果，err是一个Error对象，
  // 包含两个属性：error_code和error_message
  res.apiError = function (err) {
    output({
      status: 'Error',
      error_code: err.error_code || 'UNKNOWN',
      error_message: err.error_message || err.toString()
    });
  };

  next();
};
