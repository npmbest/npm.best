$(document).ready(function () {
  
  templateContext.setFilter('ms_to_s', function (n) {
    return (n / 1000).toFixed(2);
  });
  
  //--------------------------------------------------------------------
  
  var DEFINE_KEYWORD_SUGGESTION_LIMIT = 5;
  var DEFINE_PACKAGE_RESULT_LIMT = 10;
  
  //--------------------------------------------------------------------
  
  // 数据缓存
  var cache = new SuperCache({
    store: new SuperCache.LocalStore({
      type: 'local',
      prefix: 'npmbest_',
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
        limit: DEFINE_KEYWORD_SUGGESTION_LIMIT
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
    var timestamp = Date.now();
    cache.get('packages_' + query + '_' + skip + '_' + limit, function (name, callback) {
      ajaxRequest.get('/api/search.json', {
        query: query,
        skip: skip,
        limit: limit
      }, callback);
    }, function (err, ret) {
      ret = ret || {};
      ret.spent = Date.now() - timestamp;
      callback(err, ret);
    });
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
    location.hash = '!' + $('#ipt-search').val();
  });
  
  // 显示模块列表
  function showPackagesPage (query, skip, limit) {
    query = query.trim();
    //.replace(/[^0-9a-zA-Z.\-_$+ ]/g, '');
    query = query.replace(/[^0-9a-zA-Z.\-_$ +\u3400-\u4DB5\u4E00-\u9FA5\u9FA6-\u9FBB\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFF00-\uFFEF\u2E80-\u2EFF\u3000-\u303F\u31C0-\u31EF\u2F00-\u2FDF\u2FF0-\u2FFF\u3100-\u312F\u31A0-\u31BF\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\u4DC0-\u4DFF\uA000-\uA48F\uA490-\uA4CF\u2800-\u28FF\u3200-\u32FF\u3300-\u33FF\u2700-\u27BF\u2600-\u26FF\uFE10-\uFE1F\uFE30-\uFE4F]/g, '')
    query = query.replace(/\s/, '+');
    $('#ipt-search').val(query);
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
        $('body').animate({
          scrollTop: 0
        }, 500);
        resizeWindow();
      });
    });
  }
  
  function highlightKeyword (keyword, html) {
    if (!keyword) return html;
    return html.replace(new RegExp(keyword, 'ig'), '<span class="keyword">' + keyword + '</span>');
  }
  
  //--------------------------------------------------------------------
  
  $('body').delegate('.show-packages-page', 'click', function () {
    var $me = $(this);
    showPackagesPage($me.data('query'), $me.data('skip'), $me.data('limit'));
  });
  
  //--------------------------------------------------------------------
  
  window.onhashchange = function () {
    var hash = location.hash.toString();
    if (hash.indexOf('#!') === 0) {
      showPackagesPage(hash.slice(2), 0, DEFINE_PACKAGE_RESULT_LIMT);
    }
  };
  (function () {
    var hash = location.hash.toString();
    if (hash.indexOf('#!') === 0) {
      var query = hash.slice(2);
      showPackagesPage(query, 0, DEFINE_PACKAGE_RESULT_LIMT);
    } else {
      showPackagesPage('', 0, DEFINE_PACKAGE_RESULT_LIMT);
    }
  })();
  
  // 重置footer位置
  function resizeWindow () {
    var h1 = $('body>.container:first').height();
    var h2 = $(window).height();
    var h3 = $('.page-footer').height();
    var h4 = $('body>.container:first').offset().top;
    var isFixed = (h1 + h3 + h4 + 20 < h2);
    if (isFixed) {
      $('.page-footer').addClass('page-footer-fixed');
    } else {
      $('.page-footer').removeClass('page-footer-fixed');
    }
  }
  
  $(window).resize(resizeWindow);
  resizeWindow();

});
