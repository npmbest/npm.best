/**
 * npm.link
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');

module.exports = function (ns) {
  
  // 监听端口
  ns('web.port', 3000);
  
  // 数据存放目录
  ns('path.data', path.resolve(__dirname, '../data'));

  // NPM库下载地址
  ns('define.npm.registry', 'http://registry.npmjs.org/-/all');
  // NPM库本地存储名称
  ns('define.npm.registryFileName', 'npm_packages.json');
  
};
