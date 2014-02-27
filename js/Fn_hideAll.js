(function(ns, bo) {

  // assign
  $.extend(ns, {
    hideRVInput: hideRVInput
  });
  return;

  function hideRVInput(async) {

    // async support for system launch
    async === true ? foonyah.nextTick(hide): hide();

    function hide() {
      ['year', 'month', 'fry', 'toy', 'frm', 'tom', 'frd', 'tod', 'employee',
        'employeename', 'type_on', 'subtype_on', 'j_on', 'ooj_on',
        'btn_reporting'].forEach(function(i) {
        ns.inputWithLabel(bo.RV, i).hide();
      });
    }

  }

})(AppSpace.Fn, AppSpace.BookObject);
