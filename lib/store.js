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


var storeData = new Redis({
  host: config.get('store.data.host'),
  port: config.get('store.data.port'),
  db: config.get('store.data.db'),
  password: config.get('store.data.password')
});

var storeSet = new Redis({
  host: config.get('store.set.host'),
  port: config.get('store.set.port'),
  db: config.get('store.set.db'),
  password: config.get('store.set.password')
});


function generateData (prefix, ttl) {
  let getKey = (name) => config.get('store.data.prefix') + prefix + ':' + name;
  ttl = ttl || -1;

  let obj = {};
  obj.get = (name, callback) => {
    let k = getKey(name);
    debug('[data] get %s', k);
    storeData.get(k, (err, ret) => {
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
    debug('[data] set %s', k);
    storeData.setex(k, ttl, str, callback);
  };
  obj.delete = (name, callback) => {
    let k = getKey(name);
    debug('[data] delete %s', k);
    storeData.del(k, callback);
  };
  return obj;
}

function generateSet (prefix) {
  let getKey = () => config.get('store.set.prefix') + prefix;

  let obj = {};
  obj.has = function (value, callback) {
    let k = getKey();
    debug('[set] has %s, %s', k, value);
    storeSet.sismember(k, value, (err, ret) => {
      callback(err, ret == 1 ? true : false);
    });
  };
  obj.add = function (value, callback) {
    let k = getKey();
    debug('[add] add %s, %s', k, value);
    storeSet.sadd(k, value, callback);
  };
  obj.remove = function (value, callback) {
    let k = getKey();
    debug('[remove] remove %s, %s', k, value);
    storeSet.srem(k, value, callback);
  };
  return obj;
}

exports.github = generateData('github', config.get('store.ttl.github'));
exports.githubNotFound = generateSet('github_notfound');
