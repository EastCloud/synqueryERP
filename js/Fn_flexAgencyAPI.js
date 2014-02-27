(function() {
  var AS = this;

  // assign
  $.extend(AS.Fn, {
    flexFunction: flexFunction,
    flexFunctionList: flexFunctionList,
    flexData: flexData,
    flexDataList: flexDataList
  });
  return;

  function flexFunction(name, datim, opts) {
    Array.isArray(opts) && (opts = {
      args: opts
    });
    return _flex.call(AS.Bo.FNS, $.extend({
      prefix: 'Fn.',
      text_key: 'function'
    }, opts), arguments);
  }

  function flexFunctionList(selector, datim, opts) {
    return _flexList.call(AS.Bo.FNS, {}, arguments);
  }

  function flexData(name, datim, opts) {
    Array.isArray(opts) && (opts = {
      args: opts
    });
    return _flex.call(AS.Bo.IMP, $.extend({
      prefix: '',
      text_key: 'data'
    }, opts), arguments);
  }

  function flexDataList(selector, datim, opts) {
    return _flexList.call(AS.Bo.IMP, {}, arguments);
  }

  function _flex(param, _args) {

    var bo = this, dfd = $.Deferred();
    param = $.extend({
      args: null
    // not auto execute
    }, param);

    var prefix = param.prefix, tkey = param.text_key, args = param.args;
    var name = _args[0], datim = _args[1];

    if(!(datim instanceof Date))
      datim = new Date(datim);

    if(!datim) {
      var e = 'Date Error: flex(' + name + ').';
      return bo.alert(e);
    }

    var compv = datim.getTime() / 1000;
    bo.find({
      name: prefix + name,
      enabb_ymd: {
        $lte: compv
      },
      enabe_ymd: {
        $gte: compv
      }
    }, afterFind);
    return dfd.promise();

    function afterFind(keys, err) {

      err ? dfd.reject(err): bo.Get(keys, function(_fns, err) {
        try {

          if(err)
            throw err;

          var fns = [], ckey = false;
          _fns.forEach(function(fn) {
            fn.company_key && (ckey = true);
          });
          _fns.forEach(function(fn) {
            (ckey && fn.company_key || !ckey) && fns.push(fn);
          });

          if(fns.length != 1) {
            var kstr = '[' + keys.toString() + ']';
            throw 'Not only one ' + tkey + ' "' + name + '", ' + kstr;
          }

          var v = eval('(' + fns.pop()[tkey] + ')');
          typeof v == 'function' && param.args ? v.apply(dfd, args || []): dfd
              .resolve(v);

        } catch(e) {
          dfd.state() == 'pending' ? dfd.reject(e): (function() {
            throw e;
          })();
        }
      });
    }

  }

  function _flexList(param, _args) {

    var bo = this, dfd = $.Deferred();
    var selector = _args[0], datim = _args[1], options = $.extend({}, _args[2]);

    if(!(datim instanceof Date))
      datim = new Date(datim);

    if(!datim) {
      var e = 'Date Error: flexList(' + JSON.stringify(selector) + ').';
      return bo.alert(e);
    }

    selector && (function() {
      delete selector.enabb_ymd, delete selector.enabe_ymd;
    })();

    var compv = datim.getTime() / 1000;
    bo.find($.extend({
      enabb_ymd: {
        $lte: compv
      },
      enabe_ymd: {
        $gte: compv
      }
    }, selector), options, afterFind);
    return dfd.promise();

    function afterFind(keys, err) {
      err ? dfd.reject(err): bo.Get(keys, function(fns, err) {
        err ? dfd.reject(err): dfd.resolve(fns);
      });
    }

  }

}).call(AppSpace);
