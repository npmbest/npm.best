/**
 * npm.link
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var fs = require('fs');
var config = require('../config');
var utils = require('../lib/utils');
var model = require('../lib/model');
var async = require('async');


var file = path.resolve(config.get('path.data'), config.get('define.npm.registryFileName'));
console.log('load package list...');
var timestamp = Date.now();
var data = JSON.parse(fs.readFileSync(file).toString());
delete data._updated;
var list = Object.keys(data).map(function (n) {
  return data[n];
});
console.log('total %s packages, spent %sms', list.length, Date.now() - timestamp);

function getLatestVersion (versions) {
  for (var i in versions) {
    if (versions[i] === 'latest') {
      return i;
    }
  }
  return '';
}

function isGithubRepository (url) {
  return ((url || '').indexOf('github.com') === 0 ? 1 : 0);
}

timestamp = Date.now();
var counter = 0;
async.eachSeries(list, function (item, next) {
  
  counter++;
  console.log('update package %s (%s/%s, %s%%)', item.name, counter, list.length, (counter / list.length * 100).toFixed(2));
  async.series([
    function (next) {
      
      model.npm_packages.findOne({name: item.name}, function (err, ret) {
        if (err) return next(err);
        if (ret) {
          model.npm_packages.update({name: item.name}, {
            json_data: JSON.stringify(item),
            updated: new Date()
          }, next);
        } else {
          model.npm_packages.create({
            name: item.name,
            json_data: JSON.stringify(item),
            updated: new Date()
          }, next);
        }
      });
      
    },
    function (next) {
      
      model.packages.findOne({name: item.name}, function (err, ret) {
        if (err) return next(err);
        var data = {
          latest_version: getLatestVersion(item.versions),
          modified: (item.time && item.time.modified) || '',
          license: item.license || '',
          repository: (item.repository && item.repository.url) || '',
          is_github: isGithubRepository(item.repository && item.repository.url),
          homepage: item.homepage || '',
          bugs: (item.bugs && item.bugs.url) || '',
          keywords: (item.keywords || []).toString(),
          description: item.description || '',
          author_name: (item.author && item.author.name) || '',
          author_email: (item.author && item.author.email) || ''
        };
        if (ret) {
          model.packages.update({name: item.name}, data, next);
        } else {
          data.name = item.name;
          model.packages.create(data, next);
        }
      });
      
    },
    function (next) {
      
      model.package_keywords.deleteAll({package: item.name}, function (err) {
        if (err) return next(err);
        if (!(Array.isArray(item.keywords) && item.keywords.length > 0)) return next();
        var list = item.keywords.map(function (keyword) {
          return {package: item.name, keyword: keyword};
        });
        model.package_keywords.create(list, next);
      });
      
    }
  ], function (err) {
    if (err) {
      console.log('  - %s', err);
    } else {
      console.log('  - ok');
    }
    next();
  });
  
}, function (err) {
  if (err) console.log(err);
  console.log('done. spent %sms', Date.now() - timestamp);
  process.exit();
});