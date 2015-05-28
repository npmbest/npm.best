/**
 * npm.best
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var parseUrl = require('url').parse;
var config = require('../config');
var utils = require('../lib/utils');
var model = require('../lib/model');
var cache = require('../lib/cache');
var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');
var connect = require('connect');
var debug = utils.debug('middleware');


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

exports.cache = function (req, res, next) {
  if (req.method !== 'GET') return next();
  var key = req.method + ' ' + req.url;
  cache.get(key, function (err, callback) {
    debug('cache not exist: %s', key);
    var body = [];
    res._npmlink_write = res.write;
    res._npmlink_end = res.end;
    res.write = function (c) {
      body.push(c);
      res._npmlink_write.apply(res, arguments);
    };
    res.end = function (c) {
      if (c) body.push(c);
      res._npmlink_end.apply(res, arguments);
    };
    res.on('finish', function () {
      if (res.statusCode !== 200) return;
      var save = {
        status: res.statusCode,
        headers: res._headers,
        body: Buffer.concat(body).toString()
      };
      debug('save cache: %s', key);
      cache.set(key, save);
    });
    callback(null, '');
  }, function (err, ret) {
    if (err) return next(err);
    if (!ret) return next();
    
    debug('from cache: %s', key);
    res.writeHead(ret.status, ret.headers);
    res.end(ret.body);
  });
};
