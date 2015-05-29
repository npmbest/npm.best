$(document).ready(function () {
  
  templateContext.setFilter('ms_to_s', function (n) {
    return (n / 1000).toFixed(2);
  });
  
  //--------------------------------------------------------------------
  
  var DEFINE_KEYWORD_SUGGESTION_LIMIT = 10;
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
    ttl: 10
  });
  
  // 搜索输入框提示
  function querySearchInputSuggestions (query, callback) {
    cache.get('package_names_' + query, function (name, callback) {
      ajaxRequest.get('/api/search/input/suggestions', {
        type: 'start',
        query: query,
        limit: DEFINE_KEYWORD_SUGGESTION_LIMIT
      }, function (err, ret) {
        if (err) {
          console.error(err);
          callback(null, {list: []});
        } else {
          callback(null, {list: ret.list});
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
  
  function highlightKeyword (keyword, html) {
    if (!keyword) return html;
    return html.replace(new RegExp(keyword, 'ig'), '<span class="keyword">' + keyword + '</span>');
  }
  
  //--------------------------------------------------------------------
  
  // 顶栏搜索框
  $('#ipt-search').keyup(function (e) {
    var c = e.keyCode || e.charCode || e.which;
    if (c === 13) {
      $('#start-search').click();
    } else {
      var query = $(this).val().trim();
      querySearchInputSuggestions(query, function (ret) {
        renderTplSearchInputGuggestions.to('#search-input-suggestions', ret, function () {
          clearTimeout(iptSearchTid);
          $('#search-input-suggestions .highlight-keyword').each(function () {
            var $me = $(this);
            $me.html(highlightKeyword(query, $me.html()));
          });
          $('#search-input-suggestions').show();
        });
      });
    }
  });
  var iptSearchTid;
  $('#ipt-search').focusout(function () {
    clearTimeout(iptSearchTid);
    iptSearchTid = setTimeout(function () {
      $('#search-input-suggestions').hide();
    }, 200);
  });
  
  // 选择提示名称的列表项
  $('#search-input-suggestions').delegate('.list-group-item', 'click', function () {
    $('#ipt-search').val($(this).text().trim());
    $('#start-search').click();
  });
  
  // 开始搜索
  $('#start-search').click(function () {
    $('#search-input-suggestions').hide();
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
        $('#packages').show();
        $('#call-to-action').hide();
        $('body').animate({
          scrollTop: 0
        }, 500);
        resizeWindow();
      });
    });
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
      if (query) {
        return showPackagesPage(query, 0, DEFINE_PACKAGE_RESULT_LIMT);
      }
    }
    $('#packages').hide();
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
  
  // Call to Action 变色
  (function () {
    var colors = ["#000000","#000033","#000066","#000099","#0000CC","#0000FF","#003300","#003333","#003366","#003399","#0033CC","#0033FF","#006600","#006633","#006666","#006699","#0066CC","#0066FF","#009900","#009933","#009966","#009999","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#00FF00","#00FF33","#00FF66","#00FF99","#00FFCC","#00FFFF","#330000","#330033","#330066","#330099","#3300CC","#3300FF","#333300","#333333","#333366","#333399","#3333CC","#3333FF","#336600","#336633","#336666","#336699","#3366CC","#3366FF","#339900","#339933","#339966","#339999","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#33FF00","#33FF33","#33FF66","#33FF99","#33FFCC","#33FFFF","#660000","#660033","#660066","#660099","#6600CC","#6600FF","#663300","#663333","#663366","#663399","#6633CC","#6633FF","#666600","#666633","#666666","#666699","#6666CC","#6666FF","#669900","#669933","#669966","#669999","#6699CC","#6699FF","#66CC00","#66CC33","#66CC66","#66CC99","#66CCCC","#66CCFF","#66FF00","#66FF33","#66FF66","#66FF99","#66FFCC","#66FFFF","#990000","#990033","#990066","#990099","#9900CC","#9900FF","#993300","#993333","#993366","#993399","#9933CC","#9933FF","#996600","#996633","#996666","#996699","#9966CC","#9966FF","#999900","#999933","#999966","#999999","#9999CC","#9999FF","#99CC00","#99CC33","#99CC66","#99CC99","#99CCCC","#99CCFF","#99FF00","#99FF33","#99FF66","#99FF99","#99FFCC","#99FFFF","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC6666","#CC6699","#CC66CC","#CC66FF","#CC9900","#CC9933","#CC9966","#CC9999","#CC99CC","#CC99FF","#CCCC00","#CCCC33","#CCCC66","#CCCC99","#CCCCCC","#CCCCFF","#CCFF00","#CCFF33","#CCFF66","#CCFF99","#CCFFCC","#CCFFFF","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF6666","#FF6699","#FF66CC","#FF66FF","#FF9900","#FF9933","#FF9966","#FF9999","#FF99CC","#FF99FF","#FFCC00","#FFCC33","#FFCC66","#FFCC99","#FFCCCC","#FFCCFF","#FFFF00","#FFFF33","#FFFF66","#FFFF99","#FFFFCC","#FFFFFF","#000000","#000033","#000066","#000099","#0000CC","#0000FF","#003300","#003333","#003366","#003399","#0033CC","#0033FF","#006600","#006633","#006666","#006699","#0066CC","#0066FF","#009900","#009933","#009966","#009999","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#00FF00","#00FF33","#00FF66","#00FF99","#00FFCC","#00FFFF","#000000","#000033","#000066","#000099","#0000CC","#0000FF","#330000","#330033","#330066","#330099","#3300CC","#3300FF","#660000","#660033","#660066","#660099","#6600CC","#6600FF","#990000","#990033","#990066","#990099","#9900CC","#9900FF","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#000000","#003300","#006600","#009900","#00CC00","#00FF00","#330000","#333300","#336600","#339900","#33CC00","#33FF00","#660000","#663300","#666600","#669900","#66CC00","#66FF00","#990000","#993300","#996600","#999900","#99CC00","#99FF00","#CC0000","#CC3300","#CC6600","#CC9900","#CCCC00","#CCFF00","#FF0000","#FF3300","#FF6600","#FF9900","#FFCC00","#FFFF00","#000000","#111111","#222222","#333333","#444444","#555555","#666666","#777777","#888888","#999999","#AAAAAA","#BBBBBB","#CCCCCC","#DDDDDD","#EEEEEE","#FFFFFF","#333333","#333366","#333399","#3333CC","#336633","#336666","#336699","#3366CC","#339933","#339966","#339999","#3399CC","#33CC33","#33CC66","#33CC99","#33CCCC","#663333","#663366","#663399","#6633CC","#666633","#666666","#666699","#6666CC","#669933","#669966","#669999","#6699CC","#66CC33","#66CC66","#66CC99","#66CCCC","#993333","#993366","#993399","#9933CC","#996633","#996666","#996699","#9966CC","#999933","#999966","#999999","#9999CC","#99CC33","#99CC66","#99CC99","#99CCCC","#CC3333","#CC3366","#CC3399","#CC33CC","#CC6633","#CC6666","#CC6699","#CC66CC","#CC9933","#CC9966","#CC9999","#CC99CC","#CCCC33","#CCCC66","#CCCC99","#CCCCCC","#666666","#666699","#6666CC","#6666FF","#669966","#669999","#6699CC","#6699FF","#66CC66","#66CC99","#66CCCC","#66CCFF","#66FF66","#66FF99","#66FFCC","#66FFFF","#996666","#996699","#9966CC","#9966FF","#999966","#999999","#9999CC","#9999FF","#99CC66","#99CC99","#99CCCC","#99CCFF","#99FF66","#99FF99","#99FFCC","#99FFFF","#CC6666","#CC6699","#CC66CC","#CC66FF","#CC9966","#CC9999","#CC99CC","#CC99FF","#CCCC66","#CCCC99","#CCCCCC","#CCCCFF","#CCFF66","#CCFF99","#CCFFCC","#CCFFFF","#FF6666","#FF6699","#FF66CC","#FF66FF","#FF9966","#FF9999","#FF99CC","#FF99FF","#FFCC66","#FFCC99","#FFCCCC","#FFCCFF","#FFFF66","#FFFF99","#FFFFCC","#FFFFFF"];
    var i = 0;
    var $logo = $('#call-to-action');
    var tid = setInterval(function () {
      if (!$logo.is(':visible')) {
        clearInterval(tid);
      }
      $logo.css({color: colors[i]});
      i++;
      if (i >= colors.length) i = 0;
    }, 500);
  })();

});
