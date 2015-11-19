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
}, function (err, list) {
  if (err) throw err;

  console.log('find %s github packages, spent %sms', list.length, Date.now() - timestamp);

  timestamp = Date.now();
  let counter = 0;

  function fetchRepo (item, callback) {

    let repo = getGitRepoNameFromUrl(item.repository);
    counter++;
    console.log('update package %s (%s/%s, %s%%), repo is %s', item.name, counter, list.length, (counter / list.length * 100).toFixed(2), repo);

    if (!repo) {
      console.log('  - skip, repository is %s', item.repository);
      return callback();
    }

    let info = null, json = null;
    async.series([
      function (next) {

        store.githubNotFound.has(repo, (err, yes) => {
          if (err) return next(err);
          if (yes) return next(new Error('skip not exists GitHub repo: ' + repo));
          next();
        });

      },
      function (next) {

        request({
          url: 'https://api.github.com/repos/' + repo,
          headers: {
            'user-agent': 'https://npm.best',
            'authorization': config.get('github.authorization')
          }
        }, function (err, res, body) {
          if (body) {
            try {
              json = body.toString();
              info = JSON.parse(json);
            } catch (err) {
              return next(err);
            }
          }

          if (info.message) {
            err = new Error(info.message);
          } else if (!info.id) {
            err = new Error('fail to get repo id');
          }

          if (err && err.toString().toLowerCase().indexOf('not found') !== -1) {
            store.githubNotFound.add(repo, (err) => { if (err) console.log(err); });
          }

          next(err);
        });

      },
      function (next) {

        store.github.set(item.name, info, next);

      },
      function (next) {

        if (!info.id) return next();

        model.packages.update({name: item.name}, {
          star_count: info.stargazers_count,
          watch_count: info.subscribers_count,
          fork_count: info.forks_count
        }, next);

      }
    ], function (err) {
      if (err) {
        console.log('  - %s', err);
      } else {
        console.log('  - ok');
      }
      callback();
    });

  }

  utils.multiThreadEachSeries(parseInt(list.length / 5, 10), list, fetchRepo, function (err) {
    if (err) console.log(err);
    console.log('done. spent %sms', Date.now() - timestamp);
    process.exit();
  });
});
