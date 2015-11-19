'use strict';

/**
 * npm.best
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

let path = require('path');
let fs = require('fs');
let config = require('../config');
let utils = require('../lib/utils');
let model = require('../lib/model');
let async = require('async');


let file = path.resolve(config.get('path.data'), config.get('define.npm.registryFileName'));
console.log('load package list...');

function getLatestVersion (versions) {
  for (let i in versions) {
    if (versions[i] === 'latest') {
      return i;
    }
  }
  return '';
}

function isGithubRepository (url) {
  return ((url || '').indexOf('github.com') !== -1 ? 1 : 0);
}

let timestamp = Date.now();
let counter = 0;

let JSONStream = require('JSONStream');
let jsonStream = JSONStream.parse('*');
let fileStream = fs.createReadStream(file);
fileStream.pipe(jsonStream);
let isEnd = false;
let pending = 0;
let list = [];
jsonStream.on('data', function (data) {
  fileStream.pause();
  list.push(data);
  updateNextItem();
});
jsonStream.on('end', function () {
  isEnd = true;
  updateNextItem();
});

let isPending = false;
function updateNextItem () {
  if (isPending) return;
  if (list.length < 1) {
    if (isEnd) {
      onEnd();
    } else {
      fileStream.resume();
    }
  } else {
    isPending = true;
    let item = list.shift();
    onItem(item, function () {
      isPending = false;
      process.nextTick(updateNextItem);
    });
  }
}

function formatLicense (license) {
  license = license.toString();
  if (license.indexOf('http://') === -1 && license.indexOf('https://') === -1) {
    license = license.replace(/license/img, '').replace(/\s+/g, ' ').trim();
    license = license.replace(/MIT/ig, 'MIT');
    license = license.replace(/BSD/ig, 'BSD');
    license = license.replace(/GPL/ig, 'GPL');
    license = license.replace(/LGPL/ig, 'LGPL');
    license = license.replace(/Apache/ig, 'Apache');
  }
  return license;
}


function onItem (item, callback) {
  if (!item.name) return callback();

  counter++;
  pending++;
  console.log('[%s] update package %s', counter, item.name);

  model.packages.findOne({name: item.name}, function (err, ret) {
    if (err) return callback(err);
    let data = {
      latest_version: getLatestVersion(item.versions),
      modified: (item.time && item.time.modified) || '',
      license: formatLicense((item.license && item.license.type) || item.license || ''),
      repository: (item.repository && item.repository.url) || '',
      is_github: isGithubRepository(item.repository && item.repository.url),
      homepage: item.homepage || '',
      bugs: (item.bugs && item.bugs.url) || '',
      keywords: (item.keywords || []).toString(),
      description: item.description || '',
      author_name: (item.author && item.author.name) || '',
      author_email: (item.author && item.author.email) || ''
    };

    let cb = function (err) {
      if (err) {
        console.log('  - %s', err);
      } else {
        console.log('  - ok');
      }
      callback();
    };

    for (let i in data) {
      data[i] = String(data[i]);
    }
    if (ret) {
      model.packages.update({name: item.name}, data, cb);
    } else {
      data.name = item.name;
      model.packages.create(data, cb);
    }
  });

}

function onEnd (err) {
  if (err) console.log(err);
  console.log('done. spent %sms', Date.now() - timestamp);
  process.exit();
}
