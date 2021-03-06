/**
 * npm.best
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

  // 搜索输入提示
  app.get('/api/search/input/suggestions', searchInputSuggestions);
  app.get('/api/search/input/suggestions.*', searchInputSuggestions);
  function searchInputSuggestions (req, res, next) {
    var query = req.query.query || '';
    var limit = Number(req.query.limit);

    if (!(limit > 0)) limit = config.get('define.query.limit');

    var share = {};
    async.series([
      function (next) {

        model.keyword_suggestions.search(query, {
          skip: 0,
          limit: limit
        }, function (err, ret) {
          share.list = ret;
          next(err);
        });

      },
      function (next) {

         share.list = share.list.map(function (item) {
           return {w: item.word, c: item.result_count};
         });
         next();

      }
    ], function (err) {
      if (err) return res.apiError(err);
      res.apiSuccess({
        query: query,
        limit: limit,
        list: share.list
      });
    });
  }

  // 搜索模块名称
  app.get('/api/package/names', searchPackageNames);
  app.get('/api/package/names.*', searchPackageNames);
  function searchPackageNames (req, res, next) {
    var query = req.query.query || '';
    var type = req.query.type || '';
    var skip = Number(req.query.skip);
    var limit = Number(req.query.limit);

    if (!(skip > 0)) skip = 0;
    if (!(limit > 0)) limit = config.get('define.query.limit');

    var share = {};
    async.series([
      function (next) {

        model.packages.findNameBySearchName(type, query, {
          skip: skip,
          limit: limit
        }, function (err, ret) {
          share.list = ret;
          next(err);
        });

      },
      function (next) {

        model.packages.countBySearchName(type, query, function (err, ret) {
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
  }

  // 搜索模块信息
  app.get('/api/search', searchPackage);
  app.get('/api/search.*', searchPackage);
  function searchPackage (req, res, next) {
    var query = req.query.query || '';
    var skip = Number(req.query.skip);
    var limit = Number(req.query.limit);

    if (!(skip > 0)) skip = 0;
    if (!(limit > 0)) limit = config.get('define.query.limit');

    var share = {};
    async.series([
      function (next) {

        model.packages.findBestBySearch(query, {
          skip: skip,
          limit: limit
        }, function (err, ret) {
          share.list = ret;
          next(err);
        });

      },
      function (next) {

        model.packages.countBestBySearch(query, function (err, ret) {
          share.count = ret;
          next(err);
        });

      },
      function (next) {

        if (skip > 0) return next();

        // 如果搜索的关键字是一个模块的名称，则将这个模块的放在搜索结果的第一条
        model.packages.findOne({name: query}, function (err, ret) {
          share.package = ret;
          if (ret) {
            share.list = share.list.filter(function (item) {
              return item.name !== ret.name;
            });
            share.list.unshift(ret);
          }
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
        list: share.list,
        package: share.package
      });
    });
  }

};
