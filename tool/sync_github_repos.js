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
var store = require('../lib/store');
let async = require('async');
let request = require('request');


function getGitRepoNameFromUrl (url) {
  let s = url.match(/([^/:]+\/[^/]+)$/);
  if (s && s[1]) return s[1].replace(/\.git$/, '');
  return false;
}


let timestamp = Date.now();
let DAY = 2;
//let sql = 'SELECT `name`,`repository` FROM `packages` WHERE `is_github`=1';
model.packages.find({
  is_github: 1
}, {
  fields: ['name', 'repository']
}, (err, list) => {
  if (err) throw err;

  console.log('find %s github packages, spent %sms', list.length, Date.now() - timestamp);

  timestamp = Date.now();
  let counter = 0;
  async.eachSeries(list, (item, next) => {

    let repo = getGitRepoNameFromUrl(item.repository);
    counter++;
    console.log('update package %s (%s/%s, %s%%), repo is %s', item.name, counter, list.length, (counter / list.length * 100).toFixed(2), repo);

    if (!repo) {
      console.log('  - skip, repository is %s', item.repository);
      return next();
    }

    let info = null, json = null;
    async.series([
      (next) => {

        request({
          url: 'https://api.github.com/repos/' + repo,
          headers: {
            'user-agent': 'npm.best',
            'authorization': config.get('github.authorization')
          }
        }, (err, res, body) => {
          if (body) {
            try {
              json = body.toString();
              info = JSON.parse(json);
            } catch (err) {
              return next(err);
            }
          }
          if (info.message) err = new Error(info.message);
          else if (!info.id) err = new Error('fail to get repo id');
          next(err);
        });

      },
      (next) => {
/*
        model.github_repos.findOne({name: item.name}, (err, ret) => {
          if (err) return next(err);
          if (ret) {
            model.github_repos.update({name: item.name}, {
              json_data: json,
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
*/
        store.github.set(item.name, info, next);


      },
      (next) => {

        if (!info.id) return next();

        model.packages.update({name: item.name}, {
          star_count: info.stargazers_count,
          watch_count: info.subscribers_count,
          fork_count: info.forks_count
        }, next);

      }
    ], (err) => {
      if (err) {
        console.log('  - %s', err);
      } else {
        console.log('  - ok');
      }
      next();
    });

  }, (err) => {
    if (err) console.log(err);
    console.log('done. spent %sms', Date.now() - timestamp);
    process.exit();
  });
});
