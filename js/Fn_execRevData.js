(function() {
  var AS = this, Fn = AS.Fn;
  // assign
  $.extend(Fn, {
    execRevData: execRevData
  });
  return;

  function execRevData(d) {

    var b_CP = ECDB.BOOK('CP');
    var b_TARGET = ECDB.BOOK(b_CP.Value('sel_target'));
    if(!execConvData.last)
      return b_TARGET.notice('戻しデータなし', Fn.noticeOpt());

    var dfds = [];
    $.each(execConvData.last, function(i, mem) {
      var dfd = new $.Deferred();
      dfds.push(dfd);
      b_TARGET.Put(mem.val, function() {
        dfd.resolve();
      });
    });

    $.when.apply($, dfds).done(function() {
      b_TARGET.notice('データ戻し完了', Fn.noticeOpt());
    });

  }

}).call(window.AppSpace);
