/**
 * npm.link
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var config = require('../config');
var utils = require('../lib/utils');
var mkdirp = require('mkdirp');


var file = path.resolve(config.get('path.data'), config.get('define.npm.registryFileName'));
var url = config.get('define.npm.registry');
console.log('download from %s', url);

mkdirp.sync(path.dirname(file));

var timestamp = Date.now();
utils.download(url, file, function (err, file) {
  if (err) throw err;
  var spent = Date.now() - timestamp;
  console.log('save to %s', file);
  console.log('spent %sms', spent);
  process.exit();
});
