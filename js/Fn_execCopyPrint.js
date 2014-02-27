/***/
(function() {
  var AS = this, Fn = AS.Fn;
  // assign
  $.extend(Fn, {
    execCopyPrint: execCopyPrint
  });
  return;

  function execCopyPrint() {

    var b_FPR = ECDB.BOOK('FPR');
    var sk = b_FPR.Value('copy_key');
    var sr = b_FPR.Value('copy_src') - 1;
    var dr = b_FPR.Value('copy_dst') - 1;
    var cn = b_FPR.Value('copy_num');
    var src_d = sk ? b_FPR.HashValue(sk): b_FPR.GetVal();

    if(!$.isPlainObject(src_d))
      return b_FPR.error('Data not found: ' + sk);

    while(cn--) {
      b_FPR.Value('items[func][' + dr + ']', src_d.items.func[sr]);
      b_FPR.Value('items[args][' + dr + ']', src_d.items.args[sr]);
      dr++, sr++;
    }

    b_FPR.notice('コピー完了', Fn.noticeOpt());

  }

}).call(window.AppSpace);
