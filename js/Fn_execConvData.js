(function() {
  var AS = this, Fn = AS.Fn;
  // assign
  $.extend(Fn, {
    execConvData: execConvData
  });
  return;

  function execConvData(i, obj) {

    var b_CP = AS.Bo.CP, convt = b_CP.Value('convtarg');
    var b_TARGET = AS.Bo[convt || b_CP.Value('sel_target')];
    var fry = b_CP.Value('fry'), toy = b_CP.Value('toy');

    var sel = null, fn = null, memo = {};

    try {

      if(b_CP.Value('convfn') == "function(i, obj){\n}")
        throw Error('Function is not modified');

      sel = eval('(' + (b_CP.Value('convsel') || null) + ')');
      if(!$.isPlainObject(sel))
        throw Error('Not selector');

      fn = eval('(' + (b_CP.Value('convfn') || null) + ')');
      if(typeof fn != 'function')
        throw Error('Not function.');

    } catch(e) {
      return b_TARGET.error(e);
    }

    if(execConvData.last)
      console.log(execConvData.last);

    var sort = {};
    (convt == 0 ? function() {
      Fn.termDataSelector(sel, [fry], [toy]);
      sort.year = sort.month = sort.dat = 1;
    }: function() {
      sort._id = 1;
    });

    b_TARGET.Find(sel, {
      sort: sort
    }, function(keys) {

      var firstdfd = $.Deferred(), pipeline = firstdfd;
      var ignore = 0;

      keys.forEach(function(key, i) {

        pipeline = pipeline.pipe(function() {
          var dfd = new $.Deferred();
          setTimeout(function() {
            forEachLoadData(dfd);
          });
          return dfd;
        });

        function forEachLoadData(dfd) {
          b_TARGET.LoadForm(key, function() {

            var fobj = b_TARGET.GetForm(), hash = b_TARGET.hash[key];
            ['_id', '_hist_', '_last'].forEach(function(k){
              fobj[k] = hash[k];
            });
            
            var nval = fn.call(b_TARGET, i, $.extend(true, {}, fobj));
            if(!(nval && $.isPlainObject(nval)))
              return dfd.resolve(), ignore++;

            nval = $.extend(hash, nval);
            console.log('changing idx[' + i + ']', nval);
            b_TARGET.Put(nval, function() {
              memo[i] = {
                _id: nval._id,
                val: nval
              }, dfd.resolve();
            });

          });
        }

      });

      pipeline.done(function() {
        execConvData.last = memo;
        var sum = keys.length;
        var r = '(' + (sum - ignore) + '/' + sum + ')';
        b_TARGET.notice('データ変換完了 ' + r, Fn.noticeOpt());
      }), firstdfd.resolve();

    });

  }

}).call(window.AppSpace);
