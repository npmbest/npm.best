/**
 * npm.best
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var config = require('lei-config');
config.load();

module.exports = config;

console.log('config: %s', config.env);
