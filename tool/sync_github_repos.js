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
var HEADERS = {
  'user-agent': 'https://npm.best',
  'authorization': config.get('github.authorization')
};

function requestGithub (url, callback) {
  request({
    url: url,
    headers: HEADERS
  }, function (err, res, body) {
    let info = null, json = null;
    if (body) {
      try {
        json = body.toString();
        info = JSON.parse(json);
      } catch (err) {
        return callback(err);
      }
    }
    callback(err, info, res, json);
  });
}

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

    async.series([
      function (next) {

        store.githubNotFound.has(repo, (err, yes) => {
          if (err) return next(err);
          if (yes) return next(new Error('skip not exists GitHub repo: ' + repo));
          next();
        });

      },
      function (next) {

        requestGithub('https://api.github.com/repos/' + repo, function (err, info) {
          if (info.message) {
            err = new Error(info.message);
          } else if (!info.id) {
            err = new Error('fail to get repo id');
          }

          if (err) {
            var errMsg = err.toString().toLowerCase();
            if (errMsg.indexOf('not found') !== -1) {
              store.githubNotFound.add(repo, (err) => { if (err) console.log(err); });
            } else if (errMsg.indexOf('limit exceeded') !== -1) {
              return callback(err);
            }
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

  function showRateLimit (callback) {
    requestGithub('https://api.github.com/rate_limit', function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
      callback();
    });
  }

  function start () {
    utils.multiThreadEachSeries(parseInt(list.length / 2, 10), list, fetchRepo, function (err) {
      if (err) console.log(err);
      console.log('done. spent %sms', Date.now() - timestamp);
      process.exit();
    });
  }

  showRateLimit(start);
});
