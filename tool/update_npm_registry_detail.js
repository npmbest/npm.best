/**
 * npm.best
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var config = require('../config');
var utils = require('../lib/utils');
var model = require('../lib/model');
var async = require('async');
var request = require('request');


var timestamp = Date.now();
model.npm_packages.find({}, {fields: 'name'}, function (err, list) {
  if (err) throw err;
  
  console.log('find %s packages, spent %sms', list.length, Date.now() - timestamp);
  
  timestamp = Date.now();
  var counter = 0;
  
  async.eachSeries(list, function (item, next) {
    
    counter++;
    console.log('update package %s (%s/%s, %s%%)', item.name, counter, list.length, (counter / list.length * 100).toFixed(2));
    
    request(config.get('define.npm.registry') + '/' + item.name, function (err, res, body) {
      if (err) {
        console.log('  - download fail: %s', err);
        return next();
      }
      try {
        var data = JSON.parse(body.toString());
      } catch (err) {
        console.log('  - parse data fail: %s'. err);
        return next();
      }
      
      model.npm_packages.update({name: item.name}, {json_detail: body.toString()}, function (err) {
        if (err) {
          console.log('  - fail: %s', err);
        } else {
          console.log('  - ok');
        }
        next();
      });
    });
    
  }, function (err) {
    if (err) console.log(err);
    console.log('done. spent %sms', Date.now() - timestamp);
    process.exit();
  });
});
