/**
 * npm.best
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (model) {
  
  /**
   * 搜索
   * 
   * @param {String} word
   * @param {Object} options
   * @param {Function} callback
   */
  model.search = function (word, options, callback) {
    word = word.trim();
    if (!word) return callback(null, []);
    var opts = model.parseListOptions(options);
    var like;
    if (word.length > 2) {
      like = '%' + word + '%';
    } else {
      like = word + '%';
    }
    var sql = 'SELECT * FROM `' + model.name + '` WHERE `word` LIKE ' + model.escape(like) + ' ORDER BY `result_count` DESC ' + opts.tail;
    model.connection.query(sql, callback);
  };
  
};
