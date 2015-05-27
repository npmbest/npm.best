/**
 * npm.link
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (model) {
  
  function getListNameBySearchCondition (type, query) {
    if (!query) return '1';
    if (['start', 'end', 'include'].indexOf(type) === -1) {
      return new Error('search type `' + type + '` is not support');
    }
    var like = '`name` LIKE ';
    if (type === 'start') {
      like += model.escape(query + '%');
    } else if (type === 'end') {
      like += model.escape('%' + query);
    } else {
      like += model.escape('%' + query + '%');
    }
    return like;
  }
  
  /**
   * 列出模块名称列表
   * 
   * @param {String} type 可选start,end,include
   * @param {String} query
   * @param {Object} options
   * @param {Function} callback
   */
  model.listNameBySearchName = function (type, query, options, callback) {
    var like = getListNameBySearchCondition(type, query);
    if (like instanceof Error) return callback(like);
    var opts = model.parseListOptions(options);
    var sql = 'SELECT `name` FROM `' + model.name + '` WHERE ' + like + ' ' + opts.tail;
    model.connection.query(sql, function (err, ret) {
      callback(err, (ret || []).map(function (item) {
        return item.name;
      }));
    });
  };
  
  /**
   * 列出模块名称数量
   * 
   * @param {String} type 可选start,end,include
   * @param {String} query
   * @param {Function} callback
   */
  model.countBySearchName = function (type, query, callback) {
    var like = getListNameBySearchCondition(type, query);
    if (like instanceof Error) return callback(like);
    var sql = 'SELECT COUNT(*) AS `c` FROM `' + model.name + '` WHERE ' + like;
    model.connection.query(sql, function (err, ret) {
      callback(err, (ret && ret[0] && ret[0].c) || 0);
    });
  };
  
};
