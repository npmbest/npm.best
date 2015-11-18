/**
 * npm.best
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var config = require('../config');
var utils = require('./utils');
var debug = utils.debug('cache');
var SuperCache = require('super-cache');


var cache = new SuperCache({
  store: new SuperCache.RedisStore({
    host: config.get('cache.api.redis.host'),
    port: config.get('cache.api.redis.port'),
    db: config.get('cache.api.redis.db'),
    prefix: config.get('cache.api.redis.prefix'),
    password: config.get('cache.api.redis.password')
  }),
  ttl: config.get('cache.api.ttl')
});

module.exports = cache;
