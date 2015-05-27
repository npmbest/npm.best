$(document).ready(function () {
  
  // 数据缓存
  var cache = new SuperCache({
    store: new SuperCache.MemoryStore({
      max: 1000,
      gcProbability: 0.01 
    }),
    ttl: 60
  });
  
  // 查询指定关键字的模块名
  function queryPackageNames (query, callback) {
    cache.get('package_names_' + query, function (name, callback) {
      ajaxRequest.get('/api/package/names', {
        type: 'start',
        query: query,
        limit: 10
      }, function (err, ret) {
        if (err) {
          console.error(err);
          callback(null, {count: 0, list: []});
        } else {
          callback(null, {count: ret.count, list: ret.list.filter(function (item) {
            return item.trim();
          })});
        }
      });
    }, function (err, ret) {
      if (err) console.error(err);
      callback(ret);
    });
  }
  
  //--------------------------------------------------------------------
  
  ajaxRequest.get('/api/search.json', {query: ''}, function (err, ret) {
    if (err) return messageBox.error(err);
    renderTplPackages.to('#packages', ret);
  });
  
  //--------------------------------------------------------------------
  
  // 顶栏搜索框
  $('#ipt-search').keyup(function () {
    var query = $(this).val().trim();
    queryPackageNames(query, function (ret) {
      renderTplSearchNames.to('#search-names', ret, function () {
        clearTimeout(iptSearchTid);
        $('#search-names').show();
      });
    });
  });
  var iptSearchTid;
  $('#ipt-search').focusout(function () {
    clearTimeout(iptSearchTid);
    iptSearchTid = setTimeout(function () {
      $('#search-names').hide();
    }, 200);
  });
  
  // 选择提示名称的列表项
  $('#search-names').delegate('.list-group-item', 'click', function () {
    $('#ipt-search').val($(this).text().trim());
    $('#start-search').click();
  });
  
  // 开始搜索
  $('#start-search').click(function () {
    $('#search-names').hide();
  });

});
