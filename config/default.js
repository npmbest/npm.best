/**
 * npm.best
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');

module.exports = function (ns) {

  // 监听端口
  ns('web.port', 3000);
  // 监听地址
  ns('web.host', '127.0.0.1');
  // Cookie密钥
  ns('web.cookie.secret', 'npmbest');

  // 数据存放目录
  ns('path.data', path.resolve(__dirname, '../data'));

  // NPM库下载根地址
  ns('define.npm.registry', 'http://registry.npmjs.org');
  // NPM库本地存储名称
  ns('define.npm.registryFileName', 'npm_packages.json');

  // MySQL配置
  ns('mysql.host', 'localhost');
  ns('mysql.port', 3306);
  ns('mysql.database', '');
  ns('mysql.user', 'root');
  ns('mysql.password', '');
  ns('mysql.pool', 10);

  // 默认API查询返回结果数量
  ns('define.query.limit', 50);

  // assets/lib CDN地址
  ns('cdn.assets.lib', '');

  // API Cache
  ns('cache.api.redis.ttl', 3600);
  ns('cache.api.redis.host', '127.0.0.1');
  ns('cache.api.redis.port', 6379);
  ns('cache.api.redis.db', 0);
  ns('cache.api.redis.prefix', 'cache:api:');
  ns('cache.api.redis.password', undefined);

  // KV Store
  // data
  ns('store.data.host', '127.0.0.1');
  ns('store.data.port', 8888);
  ns('store.data.db', 0);
  ns('store.data.password', undefined);
  ns('store.data.prefix', 'store:');
  // set
  ns('store.set.host', '127.0.0.1');
  ns('store.set.port', 6379);
  ns('store.set.db', 0);
  ns('store.set.password', undefined);
  ns('store.set.prefix', 'set:');
  // ttl
  ns('store.ttl.github', 3600 * 24 * 30);

  // GitHub授权
  ns('github.authorization', '');

};
