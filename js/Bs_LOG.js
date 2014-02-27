/***/
(function() {
  var AS = this;
  var Fn = AS.Fn, Bs = AS.BookSrc, Bt = AS.BookType;

  var Book = {
    title: "更新ログ"
  };
  var selects = {};
  $.each(Bt.Master, function(k) {
    selects[k + ':' + Bs[k].title] = k;
  });
  $.each(Bt.Data, function(k) {
    selects[k + ':' + Bs[k].title] = k;
  });
  $.each(Bt.Control, function(k) {
    ['CP', 'LOG'].indexOf(k) == -1 && (selects[k + ':' + Bs[k].title] = k);
  });

  Book.structure = [["_id", "ログID", "string", "", {
    align: 'center'
  }, 20], ["book", "操作データ", "select", selects, {
    skey: true,
    align: 'center'
  }, 80], ["func", "操作", "string", "", {
    align: 'center'
  }, 20], ["name", "オペレータ", "string", "", {
    align: 'center'
  }, 30], ["date", "日時", "datim", "", {
    skey: true,
    align: 'center'
  }, 50], ["data", ""/*送信データ*/, "text", "", "hidden", 0],
    ["diff", ""/*差分*/, "text", "", "hidden", 0],
    ["extd", ""/*付属情報*/, "text", "", "hidden", 0],
    ["wrap_data", "送信データ", "html", "<div/>", {
      height: 120,
      css: {
        padding: '5px 0px',
        overflow: 'scroll'
      }
    }, 100], ["wrap_diff", "差分データ(KEY:BEFORE => AFTER)", "html", "<div/>", {
      height: 120,
      css: {
        padding: '5px 0px',
        overflow: 'auto'
      }
    }, 100]];

  Book.style = {
    color: 'mono'
  };

  $.extend(Book, {
    formButton: false,
    tableButton: 'CLOSE',
    beforeShowForm: beforeShowForm,
    beforeShowTable: beforeShowTable,
    onChangeMode: onChangeMode,
    onDrawTable: onDrawTable,
    list: '_id book name date'
  });

  $.extend(AS.BookSrc, {
    LOG: Book
  });

  return;

  function beforeShowForm($dom) {
    var b_LOG = this;
    var $fwidget = $dom.dialog('widget');
    $fwidget.find('._center_text_').text('');
  }

  function beforeShowTable($dom) {
    var b_LOG = this;
    var $fwidget = b_LOG.Form().dialog('widget');
    var $twidget = $dom.dialog('widget');

    var fw = $fwidget.offset().left + $fwidget.width();
    var tw = $twidget.offset().left + $twidget.width() / 2;
    tw < fw && setTimeout(function() {
      $twidget.mousedown().animate({
        left: tw - 120,
        top: $fwidget.offset().top + 8
      });
    }, 1200);

    $twidget.find('._center_text_').text('');
    $twidget.find('.SB_CLOSE').click(function() {
      b_LOG.HideTable();
    });
  }

  function onDrawTable($dom, i, val, obj) {
    var b_LOG = this;
    if(val != obj._id) // not _id column
      return;
    if($dom.closest('table').find('tr').index($dom.parent())) // not first row
      return;
    setTimeout(function() {
      var $twidget = b_LOG.Table().dialog('widget');
      $twidget.mousedown();
    }, 1200);
  }

  function onChangeMode(mode) {

    var b_LOG = this, b_SRC = AS.Bo[b_LOG.Value('book')];
    Fn.changeInputColor(b_SRC, b_LOG, 'book');

    var w_data = b_LOG.Input('wrap_data').empty();
    b_LOG.objectBox({}, b_LOG.Value('data') || {}).dialog('destroy').dialog(
      'widget').css({
      display: 'block',
      width: 'auto',
      height: 'auto',
      minHeight: 104,
      webkitUserSelect: 'auto'
    }).appendTo(w_data);

    var w_diff = b_LOG.Input('wrap_diff').empty();
    b_LOG.objectBox({}, b_LOG.Value('diff') || {}).dialog('destroy').dialog(
      'widget').css({
      display: 'block',
      width: 'auto',
      height: 'auto',
      minHeight: 104,
      webkitUserSelect: 'auto'
    }).appendTo(w_diff);

  }

}).call(AppSpace);
