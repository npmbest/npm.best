$(document).ready(function () {
  
  // 数据缓存
  var cache = new SuperCache({
    store: new SuperCache.LocalStore({
      type: 'local',
      prefix: 'npmlink_',
      max: 1000,
      gcProbability: 0.01
    }),
    ttl: 600
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
  
  // 查询指定关键字的模块列表
  function queryPackages (query, skip, limit, callback) {
    cache.get('packages_' + query + '_' + skip + '_' + limit, function (name, callback) {
      ajaxRequest.get('/api/search.json', {
        query: query,
        skip: skip,
        limit: limit
      }, callback);
    }, callback);
  }
  
  //--------------------------------------------------------------------
  
  // 顶栏搜索框
  $('#ipt-search').keyup(function (e) {
    var c = e.keyCode || e.charCode || e.which;
    if (c === 13) {
      $('#start-search').click();
    } else {
      var query = $(this).val().trim();
      queryPackageNames(query, function (ret) {
        renderTplSearchNames.to('#search-names', ret, function () {
          clearTimeout(iptSearchTid);
          $('#search-names').show();
        });
      });
    }
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
    showPackagesPage($('#ipt-search').val(), 0, 50);
  });
  
  // 显示模块列表
  function showPackagesPage (query, skip, limit) {
    query = query.trim().replace(/[^a-zA-Z.\-_$+]/g, '');
    queryPackages(query, skip, limit, function (err, ret) {
      if (err) return messageBox.error(err);
      var keywords = query.split('+');
      renderTplPackages.to('#packages', ret, function () {
        $('#packages .highlight-keyword').each(function () {
          var $me = $(this);
          keywords.forEach(function (w) {
            $me.html(highlightKeyword(w.trim(), $me.html()));
          });
        });
      });
    });
  }
  
  function highlightKeyword (keyword, html) {
    if (!keyword) return html;
    return html.replace(new RegExp(keyword, 'g'), '<span class="keyword">' + keyword + '</span>');
  }
  
  //--------------------------------------------------------------------
  
  $('body').delegate('.show-packages-page', 'click', function () {
    var $me = $(this);
    showPackagesPage($me.data('query'), $me.data('skip'), $me.data('limit'));
  });
  
  //--------------------------------------------------------------------
  
  $('#start-search').click();

});
