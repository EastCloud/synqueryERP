(function() {
  var AS = this, Fn = AS.Fn;

  // assign
  $.extend(Fn, {
    makeReport: makeReport
  });

  return;

  function makeReport() {

    var b_RV = ECDB.BOOK('RV');
    var f = b_RV.Input('report').empty().css({
      '-webkit-user-select': 'auto'
    });

    var v = {
      year: b_RV.Value('year'),
      month: b_RV.Value('month'),
      employee: b_RV.Value('employee'),
      fry: b_RV.Value('fry'),
      frm: b_RV.Value('frm'),
      frd: b_RV.Value('frd'),
      toy: b_RV.Value('toy'),
      tom: b_RV.Value('tom'),
      tod: b_RV.Value('tod')
    };

    var fra = [v.fry, v.frm], toa = [v.toy, v.tom];
    if(b_RV.Input('frd').css('display') == 'block')
      fra.push(v.frd), toa.push(v.tod);
    v.fra = fra, v.toa = toa;

    var s = {
      type: b_RV.Value('type_on'),
      subtype: b_RV.Value('subtype_on'),
      jtype: b_RV.Value('j_on'),
      ooj: b_RV.Value('ooj_on')
    };

    var ts = AS.a_types;
    var isLeft = AS.isLeft;

    var sums = {}, nets = {};
    sums.left = 0, sums.right = 0;
    nets.stax = 0, nets.sntx = 0, nets.ctax = 0, nets.diff = 0;

    // remove trash
    $('iframe').each(function() {
      $(this).css('opacity') == 0 && $(this).remove();
    });

    var fnam = b_RV.Value('type');
    fnam != 'noop' && Fn.flexFunction(fnam, new Date(), {
      args: [AS.Bo, v, s, AS.Fn, {
        $m_tbl: $('<table/>').clone().appendTo(f),
        $tr: $('<tr/>'),
        $td: $('<td/>')
      }, {
        isLeft: isLeft,
        ts: ts,
        sums: sums,
        nets: nets
      }]
    }).done(function() {
      console.log('END OF MAKE REPORT', arguments);
    }).fail(fail);

    function fail(e) {
      var m = '"' + fnam + '" の実行でエラーが発生しました。';
      m += '\nエラー内容：';
      m += '\n  ' + e.message;
      m += '\n"' + fnam + '" の存在と有効性を確認してください。';
      m += '\n それでも解決しない時は ';
      m += '\n<a href="' + 'https://www.synquery.com/synquery/U0lIhvaW'
        + '" target="_blank">' + '教えてERP!' + '</a>';
      m += 'をご活用ください。（スマホアクセス可）';
      b_RV.alert(m), console.error(e);
    }

  }

}).call(AppSpace);
