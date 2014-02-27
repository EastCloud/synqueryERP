/***/
(function() {
  var AS = this, Fn = AS.Fn;
  // assign
  $.extend(Fn, {
    noticeOpt: noticeOpt
  });
  return;

  function noticeOpt() {
    return {
      duration: 300,
      timeout: 700
    };
  }

})(AppSpace);
