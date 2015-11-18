'use strict';

/**
 * npm.best
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var config = require('../config');
var utils = require('./utils');
var debug = utils.debug('store');
var Redis = require('ioredis');


var store = new Redis({
  host: config.get('store.redis.host'),
  port: config.get('store.redis.port'),
  db: config.get('store.redis.db'),
  password: config.get('store.redis.password')
});


function generatePrefix (prefix, ttl) {
  let getKey = (name) => config.get('store.redis.prefix') + ':' + prefix + ':' + name;
  ttl = ttl || -1;

  let obj = {};
  obj.get = (name, callback) => {
    let k = getKey(name);
    debug('get %s', k);
    store.get(k, (err, ret) => {
      if (err) return callback(err);
      if (!ret) return callback(null, null);
      let data = null;
      try {
        data = JSON.parse(ret);
      } catch (err) {
        err.data = ret;
        return callback(err);
      }
      callback(null, data);
    });
  };
  obj.set = (name, data, callback) => {
    let str = null;
    try {
      str = JSON.stringify(data);
    } catch (err) {
      err.data = data;
      callback(err);
    }
    let k = getKey(name);
    debug('set %s', k);
    store.setex(k, ttl, str, callback);
  };
  obj.delete = (name, callback) => {
    let k = getKey(name);
    debug('delete %s', k);
    store.del(k, callback);
  };
  return obj;
}

exports.github = generatePrefix('github', config.get('store.ttl.github'));
