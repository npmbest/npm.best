/**
 * npm.best
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var MySQLPool = require('lei-mysql');
var rd = require('rd');
var config = require('../../config');
var utils = require('../utils');
var debug = utils.debug('model');


function fileNameToModelName (f) {
  var n = f.split('/').pop();
  var i = n.lastIndexOf('.');
  return n.slice(0, i);
}

function formatQuery (query) {
  if (Object.keys(query).length < 1) return 1;
  return query;
}

function createModel (name) {
  var model = {
    name: name,
    connection: db,
    escape: db.escape,
    escapeId: db.escapeId
  };
  
  /**
   * parseListOptions
   * 
   * @param {Object} options
   *   - {String} fields
   *   - {String} sort
   *   - {Number} skip
   *   - {Number} limit
   * @return {Object}
   */
  model.parseListOptions = function (options) {
    var opts = {};
    opts.fields = options.fields || '*';
    opts.tail = '';
    if (options.sort) opts.tail += ' ORDER BY ' + options.sort;
    var skip = Number(options.skip);
    if (!(skip > 0)) skip = 0;
    var limit = Number(options.limit);
    if (!(limit > 0)) limit = 9999999999999;
    opts.tail += ' LIMIT ' + skip + ',' + limit;
    return opts;
  }
  
  /**
   * find
   * 
   * @param {Object} query
   * @param {Object} options
   * @param {Function} callback
   */
  model.find = function (query, options, callback) {
    return db.find(name, formatQuery(query), model.parseListOptions(options), callback);
  };
  
  /**
   * findOne
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.findOne = function (query, callback) {
    return db.findOne(name, formatQuery(query), callback);
  };
  
  /**
   * create
   * 
   * @param {Object} data
   * @param {Function} callback
   */
  model.create = function (data, callback) {
    return db.insert(name, data, callback);
  };
  
  /**
   * delete
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.delete = function (query, callback) {
    return db.delete(name, formatQuery(query), 'LIMIT 1', callback);
  };
  
  /**
   * deleteAll
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.deleteAll = function (query, callback) {
    return db.delete(name, formatQuery(query), callback);
  };
  
  /**
   * update
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.update = function (query, update, callback) {
    return db.update(name, formatQuery(query), update, 'LIMIT 1',  callback);
  };
  
  /**
   * updateAll
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.updateAll = function (query, update, callback) {
    return db.update(name, formatQuery(query), update, callback);
  };
  
  /**
   * count
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.count = function (query, callback) {
    return db.count(name, formatQuery(query), callback);
  };
  
  return model;
}


var db = exports._connection = new MySQLPool({
  host: config.get('mysql.host'),
  port: config.get('mysql.port'),
  database: config.get('mysql.database'),
  user: config.get('mysql.user'),
  password: config.get('mysql.password'),
  pool: config.get('mysql.pool')
});

rd.eachFileFilterSync(__dirname, /\.js$/, function (f, s) {
  if (f === __filename) return;
  debug('load file: %s', f);
  var model = createModel(fileNameToModelName(f));
  require(f)(model);
  exports[model.name] = model;
});
