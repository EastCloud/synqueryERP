(function() {
  var AS = this, Fn = AS.Fn;

  // assign
  $.extend(Fn, {
    execConvPrint: execConvPrint
  });
  return;

  function execConvPrint() {

    var b_FPR = AS.Bo.FPR;
    var fn = null;

    try {
      if(b_FPR.Value('convfn') == "function(i, f, a){\n}")
        throw Error('Function is not modified');
      fn = eval('(' + (b_FPR.Value('convfn') || null) + ')');
      if(typeof fn != 'function')
        throw Error('Not function.');
    } catch(e) {
      return b_FPR.error(e);
    }

    if(execConvPrint.last) // TODO remove
      console.log(execConvPrint.last);

    var fncs = b_FPR.Value('items[func]');
    var args = b_FPR.Value('items[args]');
    var memo = {};

    fncs.forEach(function(func, i) {

      var a = null;
      try {
        a = eval('(' + args[i] + ')');
      } catch(e) {
        return console.log('JSON.parse fail No.' + i, args[i]);
      }

      var nval = fn.call(b_FPR, i, func, $.extend(true, [], a));
      nval && (function() {
        console.log('changing idx[' + i + ']', a, nval);
        b_FPR.Value('items[args][' + i + ']', JSON.stringify(nval));
        memo[i] = {}, memo[i].func = func, memo[i].args = a;
      })();

    });

    execConvPrint.last = memo;
    b_FPR.notice('変換完了', Fn.noticeOpt());

  }

}).call(window.AppSpace);
