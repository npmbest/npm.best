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
var request = require('request');


function getGitRepoNameFromUrl (url) {
  var s = url.match(/([^/:]+\/[^/]+)$/);
  if (s && s[1]) return s[1].replace(/\.git$/, '');
  return false;
}


var timestamp = Date.now();
model.packages.find({is_github: 1}, {fields: 'name,repository'}, function (err, list) {
  if (err) throw err;
  
  console.log('find %s github packages, spent %sms', list.length, Date.now() - timestamp);
  
  timestamp = Date.now();
  var counter = 0;
  async.eachSeries(list, function (item, next) {
    
    var repo = getGitRepoNameFromUrl(item.repository);
    counter++;
    console.log('update package %s (%s/%s, %s%%), repo is %s', item.name, counter, list.length, (counter / list.length * 100).toFixed(2), repo);
    
    if (!repo) {
      console.log('  - skip, repository is %s', item.repository);
      return next();
    }
    
    var info, json;
    async.series([
      function (next) {
        
        request({
          url: 'https://api.github.com/repos/' + repo,
          headers: {
            'user-agent': 'npm.link'
          }
        }, function (err, res, body) {
          if (body) {
            try {
              json = body.toString();console.log(json);
              info = JSON.parse(json);
            } catch (err) {
              return next(err);
            }
          }
          next(err);
        });
        
      },
      function (next) {
        
        model.github_repos.findOne({name: item.name}, function (err, ret) {
          if (err) return next(err);
          if (ret) {
            model.github_repos.update({name: item.name}, {
              json_data: JSON.stringify(item),
              updated: new Date()
            }, next);
          } else {
            model.github_repos.create({
              name: item.name,
              json_data: json,
              updated: new Date()
            }, next);
          }
        });
        
      },
      function (next) {
        
        if (!info.id) return next();
        
        model.packages.update({name: item.name}, {
          star_count: info.stargazers_count,
          watch_count: info.watchers_count,
          fork_count: info.forks_count
        }, next);
        
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
});
