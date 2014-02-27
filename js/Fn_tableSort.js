(function() {
  var AS = this, Fn = AS.Fn;

  // assign
  $.extend(Fn, {
    tableSort: tableSort
  });
  return;

  function tableSort(targ) {

    var b_CP = AS.Bo.CP, b_TARGET = AS.Bo[targ];
    var fry = b_CP.Value('fry'), toy = b_CP.Value('toy');
    var dfd = $.Deferred();

    // for searching
    var search_fn = b_CP.Value('search_fn');

    if(b_CP.Value('search_fn_on'))
      try {
        search_fn = eval('(' + search_fn + ')');
      } catch(e) {
      }

    var sel = {};
    Fn.termDataSelector(sel, [fry], [toy]);
    b_TARGET.Find(sel, afterFind);

    function afterFind(keys) {
      keys.length ? b_TARGET.Get(keys, function(arr) {

        arr.sort(function(a, b) {
          if(a.year < b.year)
            return -1;
          else if(a.year > b.year)
            return 1;
          if(a.month < b.month)
            return -1;
          else if(a.month > b.month)
            return 1;
          if(a.day < b.day)
            return -1;
          else if(a.day > b.day)
            return 1;
          if(!a.sort && b.sort)
            return -1;
          else if(a.sort && !b.sort)
            return 1;
          else if(a.sort && b.sort) {
            if(a.sort < b.sort)
              return -1;
            else if(a.sort > b.sort)
              return 1;
          }
          if(a._last[0] < b._last[0])
            return -1;
          else
            return 1;
        });

        var seq = b_TARGET.seq = [];
        arr.forEach(function(o, i) {
          if(!$.isFunction(search_fn) || search_fn.call(b_TARGET, i, o))
            seq.push(o._id);
        });

        showAndResolve();

      }): showAndResolve();

      function showAndResolve() {
        var tlayer = AS.tlays.children('#tlayer' + b_TARGET.name);
        tlayer.siblings().hide(), tlayer.show();
        b_TARGET.DrawTable(), b_TARGET.ShowTable();
        dfd.resolve(targ);
      }

    }

    return dfd;

  }

}).call(AppSpace);
