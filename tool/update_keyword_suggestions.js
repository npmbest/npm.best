/**
 * npm.best
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var config = require('../config');
var utils = require('../lib/utils');
var model = require('../lib/model');
var async = require('async');


var timestamp = Date.now();
model.packages.find({}, {fields: 'name,keywords'}, function (err, list) {
  if (err) throw err;
  
  console.log('find %s packages, spent %sms', list.length, Date.now() - timestamp);
  
  timestamp = Date.now();
  var counter = 0;
  
  async.eachSeries(list, function (item, next) {
    
    counter++;
    console.log('update package %s (%s/%s, %s%%)', item.name, counter, list.length, (counter / list.length * 100).toFixed(2));
    
    var words = [item.name].concat(item.keywords.split(',')).map(function (v) {
      return v.trim();
    }).filter(function (v) {
      return v;
    });
    console.log('  - %s words', words.length);
    
    async.eachSeries(words, function (word, next) {
      
      model.keyword_suggestions.create({word: word}, function (err) {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.log('  - exist word: %s', word);
          } else {
            console.log('  - add word %s fail: %s', word, err);
          }
        } else {
          console.log('  - new word: %s', word);
        }
        next();
      });
      
    }, function (err) {
      if (err) {
        console.log('  - fail: %s', err);
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
