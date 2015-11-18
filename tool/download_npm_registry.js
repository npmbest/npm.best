'use strict';

/**
 * npm.best
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

let path = require('path');
let config = require('../config');
let utils = require('../lib/utils');
let mkdirp = require('mkdirp');


let file = path.resolve(config.get('path.data'), config.get('define.npm.registryFileName'));
let url = config.get('define.npm.registry') + '/-/all';
console.log('download from %s', url);

mkdirp.sync(path.dirname(file));

let timestamp = Date.now();
utils.download(url, file, (size, total) => {
  process.stdout.write(utils.clc.move.to(0, utils.clc.windowSize.height));
  //process.stdout.write(utils.clc.erase.line);
  process.stdout.write(utils.format('process: %s%% [%s/%s]', (size / total * 100).toFixed(1), size, total));
}, (err, file) => {
  if (err) throw err;
  let spent = Date.now() - timestamp;
  console.log('save to %s', file);
  console.log('spent %sms', spent);
  process.exit();
});
