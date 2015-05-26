/**
 * npm.link
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

function createModel (name) {
  var model = {
    name: name,
    connection: db
  };
  
  /**
   * find
   * 
   * @param {Object} query
   * @param {Object} options
   *   - {String} fields
   *   - {String} sort
   *   - {Number} skip
   *   - {Number} limit
   * @param {Function} callback
   */
  model.find = function (query, options, callback) {
    var opts = {};
    if (options.fields) opts.fields = options.fields;
    opts.tail = '';
    if (options.sort) opts.tail += ' ORDER BY ' + options.sort;
    var skip = Number(options.skip);
    if (!(skip > 0)) skip = 0;
    var limit = Number(options.limit);
    if (!(limit > 0)) limit = -1;
    opts.tail += ' LIMIT ' + skip + ',' + limit;
    return db.find(name, query, opts, callback);
  };
  
  /**
   * findOne
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.findOne = function (query, callback) {
    return db.findOne(name, query, callback);
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
    return db.delete(name, query, 'LIMIT 1', callback);
  };
  
  /**
   * deleteAll
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.deleteAll = function (query, callback) {
    return db.delete(name, query, callback);
  };
  
  /**
   * update
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.update = function (query, update, callback) {
    return db.update(name, query, update, 'LIMIT 1',  callback);
  };
  
  /**
   * updateAll
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.updateAll = function (query, update, callback) {
    return db.update(name, query, update, callback);
  };
  
  /**
   * count
   * 
   * @param {Object} query
   * @param {Function} callback
   */
  model.count = function (query, callback) {
    return db.count(name, query, callback);
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
