;(function () {

  var ajaxLoaderImg = 'data:image/gif;base64,R0lGODlhEAAQAPQAAP///0RERPPz86mpqejo6Hd3d52dnURERISEhF5eXsHBwc/Pz1JSUra2tkZGRmtra5CQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFdyAgAgIJIeWoAkRCCMdBkKtIHIngyMKsErPBYbADpkSCwhDmQCBethRB6Vj4kFCkQPG4IlWDgrNRIwnO4UKBXDufzQvDMaoSDBgFb886MiQadgNABAokfCwzBA8LCg0Egl8jAggGAA1kBIA1BAYzlyILczULC2UhACH5BAkKAAAALAAAAAAQABAAAAV2ICACAmlAZTmOREEIyUEQjLKKxPHADhEvqxlgcGgkGI1DYSVAIAWMx+lwSKkICJ0QsHi9RgKBwnVTiRQQgwF4I4UFDQQEwi6/3YSGWRRmjhEETAJfIgMFCnAKM0KDV4EEEAQLiF18TAYNXDaSe3x6mjidN1s3IQAh+QQJCgAAACwAAAAAEAAQAAAFeCAgAgLZDGU5jgRECEUiCI+yioSDwDJyLKsXoHFQxBSHAoAAFBhqtMJg8DgQBgfrEsJAEAg4YhZIEiwgKtHiMBgtpg3wbUZXGO7kOb1MUKRFMysCChAoggJCIg0GC2aNe4gqQldfL4l/Ag1AXySJgn5LcoE3QXI3IQAh+QQJCgAAACwAAAAAEAAQAAAFdiAgAgLZNGU5joQhCEjxIssqEo8bC9BRjy9Ag7GILQ4QEoE0gBAEBcOpcBA0DoxSK/e8LRIHn+i1cK0IyKdg0VAoljYIg+GgnRrwVS/8IAkICyosBIQpBAMoKy9dImxPhS+GKkFrkX+TigtLlIyKXUF+NjagNiEAIfkECQoAAAAsAAAAABAAEAAABWwgIAICaRhlOY4EIgjH8R7LKhKHGwsMvb4AAy3WODBIBBKCsYA9TjuhDNDKEVSERezQEL0WrhXucRUQGuik7bFlngzqVW9LMl9XWvLdjFaJtDFqZ1cEZUB0dUgvL3dgP4WJZn4jkomWNpSTIyEAIfkECQoAAAAsAAAAABAAEAAABX4gIAICuSxlOY6CIgiD8RrEKgqGOwxwUrMlAoSwIzAGpJpgoSDAGifDY5kopBYDlEpAQBwevxfBtRIUGi8xwWkDNBCIwmC9Vq0aiQQDQuK+VgQPDXV9hCJjBwcFYU5pLwwHXQcMKSmNLQcIAExlbH8JBwttaX0ABAcNbWVbKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICSRBlOY7CIghN8zbEKsKoIjdFzZaEgUBHKChMJtRwcWpAWoWnifm6ESAMhO8lQK0EEAV3rFopIBCEcGwDKAqPh4HUrY4ICHH1dSoTFgcHUiZjBhAJB2AHDykpKAwHAwdzf19KkASIPl9cDgcnDkdtNwiMJCshACH5BAkKAAAALAAAAAAQABAAAAV3ICACAkkQZTmOAiosiyAoxCq+KPxCNVsSMRgBsiClWrLTSWFoIQZHl6pleBh6suxKMIhlvzbAwkBWfFWrBQTxNLq2RG2yhSUkDs2b63AYDAoJXAcFRwADeAkJDX0AQCsEfAQMDAIPBz0rCgcxky0JRWE1AmwpKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICKZzkqJ4nQZxLqZKv4NqNLKK2/Q4Ek4lFXChsg5ypJjs1II3gEDUSRInEGYAw6B6zM4JhrDAtEosVkLUtHA7RHaHAGJQEjsODcEg0FBAFVgkQJQ1pAwcDDw8KcFtSInwJAowCCA6RIwqZAgkPNgVpWndjdyohACH5BAkKAAAALAAAAAAQABAAAAV5ICACAimc5KieLEuUKvm2xAKLqDCfC2GaO9eL0LABWTiBYmA06W6kHgvCqEJiAIJiu3gcvgUsscHUERm+kaCxyxa+zRPk0SgJEgfIvbAdIAQLCAYlCj4DBw0IBQsMCjIqBAcPAooCBg9pKgsJLwUFOhCZKyQDA3YqIQAh+QQJCgAAACwAAAAAEAAQAAAFdSAgAgIpnOSonmxbqiThCrJKEHFbo8JxDDOZYFFb+A41E4H4OhkOipXwBElYITDAckFEOBgMQ3arkMkUBdxIUGZpEb7kaQBRlASPg0FQQHAbEEMGDSVEAA1QBhAED1E0NgwFAooCDWljaQIQCE5qMHcNhCkjIQAh+QQJCgAAACwAAAAAEAAQAAAFeSAgAgIpnOSoLgxxvqgKLEcCC65KEAByKK8cSpA4DAiHQ/DkKhGKh4ZCtCyZGo6F6iYYPAqFgYy02xkSaLEMV34tELyRYNEsCQyHlvWkGCzsPgMCEAY7Cg04Uk48LAsDhRA8MVQPEF0GAgqYYwSRlycNcWskCkApIyEAOwAAAAAAAAAAAA==';

  // AJAX Status
  function ajaxLoading () {
    $('.ajax-loader').show();
  }
  function ajaxDone () {
    $('.ajax-loader').hide();
  }
  $(document).ready(function () {
    $(document).ajaxStart(ajaxLoading)
               .ajaxStop(ajaxDone)
               .ajaxError(ajaxDone);
    $(document.body).append('<div class="ajax-loader"><img src="' + ajaxLoaderImg + '"></div>');
  });

  // AJAX Request
  function makeAjaxRequest (method, url, params, callback) {
    if (method === 'del') method = 'delete';
    $.ajax({
      type:     method,
      url:      url,
      data:     params,
      dataType: 'json',
      success: function (data) {
        if (data.status !== 'OK') return callback(data.error_message, data);
        callback(null, data.result, data);
      },
      error:  function (req, status, err) {
        callback(status + ' ' + err);
      }
    });
  }
  var ajaxRequest = window.ajaxRequest = {};
  ['get', 'post', 'put', 'delete', 'del', 'head', 'trace', 'option'].forEach(function (method) {
    ajaxRequest[method] = function (url, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }
      return makeAjaxRequest(method, url, params, callback);
    };
  });

  var messageBox = window.messageBox = {};
  ['warning', 'error', 'success', 'info'].forEach(function (type) {
    messageBox[type] = function (options, callback) {
      if (typeof options === 'string') {
        options = {
          title: options
        };
      }
      options.type = type;
      return swal(options, callback);
    };
  });
  
  // TinyLiquid
  var templateContext = TinyLiquid.newContext();
  function compileTemplate (fn, options) {
    var lines = fn.toString().split('\n');
    var tpl = lines.slice(1, -1).join('\n').trim();
    var renderTpl = TinyLiquid.compile(tpl, options);
    var render = function (data, callback) {
      var context = TinyLiquid.newContext();
      for (var i in data) {
        context.setLocals(i, data[i]);
      }
      context.from(templateContext);
      renderTpl(context, callback);
    };
    render.to = function (target, data, callback) {
      render(data, function (err, html) {
        if (err) return messageBox.error(err);
        $(target).html(html);
        callback && callback();
      });
    };
    return render;
  }
  
  templateContext.setFilter('friendly_time', function (str) {
    return moment(str).fromNow();
  });
  
  window.templateContext = templateContext;
  window.compileTemplate = compileTemplate;
  
  // i18n
  i18n.init({
    useCookie: true,
    cookieName: 'language',
    lngWhitelist: ['en', 'zh'],
    resGetPath: '/assets/i18n/__lng__.json'
  });
  templateContext.setFilter('i18n', function () {
    var args = Array.prototype.slice.call(arguments);
    args = args.map(function (v) {
      if (v === 0 || v === null || v === false) v = String(v);
      return v;
    });
    return i18n.t.apply(i18n, args);
  });

})();
