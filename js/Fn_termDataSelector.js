(function() {
  var AS = this, Fn = AS.Fn;
  
  // assign
  $.extend(Fn, {
    termDataSelector: termDataSelector
  });
  return;

  function termDataSelector(sel, fr, to) {
    if(fr[0] === to[0]) {
      sel.year = fr[0];
      if(fr[1] && to[1])
        sel.month = {
          $gte: fr[1],
          $lte: to[1]
        };
    } else
      sel.year = {
        $gte: fr[0],
        $lte: to[0]
      };
  }

}).call(AppSpace);
