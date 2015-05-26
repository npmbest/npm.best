/**
 * npm.link
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var config = require('../../config');
var utils = require('../../lib/utils');
var model = require('../../lib/model');
var middleware = require('../middleware');
var async = require('async');
var debug = utils.debug('routes:api');


module.exports = function (app) {
  
  // 搜索
  app.get('/api/search.*', function (req, res, next) {
    var query = req.query.query || '';
    var skip = Number(req.query.skip);
    var limit = Number(req.query.limit);
    
    if (!(skip > 0)) skip = 0;
    if (!(limit > 0)) limit = config.get('define.query.limit');
    
    var share = {};
    async.series([
      function (next) {
        
        model.packages.find({}, {
          skip: skip,
          limit: limit
        }, function (err, ret) {
          share.list = ret;
          next(err);
        });
        
      },
      function (next) {
        
        model.packages.count({}, function (err, ret) {
          share.count = ret;
          next(err);
        });
        
      }
    ], function (err) {
      if (err) return res.apiError(err);
      res.apiSuccess({
        query: query,
        skip: skip,
        limit: limit,
        count: share.count,
        list: share.list
      });
    });
  });

};
