/**
 * npm.link
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
  ns('web.cookie.secret', 'npmlink');
  
  // 数据存放目录
  ns('path.data', path.resolve(__dirname, '../data'));

  // NPM库下载地址
  ns('define.npm.registry', 'http://registry.npmjs.org/-/all');
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
  
};
