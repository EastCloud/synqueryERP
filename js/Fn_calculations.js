/***/
(function() {
  var AS = this, Fn = AS.Fn;

  // assign
  $.extend(Fn, {
    calcBalance: calcBalance,
    calcLinesSum: calcLinesSum,
    calcSubstituteMD: calcSubstituteMD,
    calcSubstituteSD: calcSubstituteSD
  });
  return;

  function calcBalance(i, obj) {

    var b_CP = ECDB.BOOK('CP');
    var b_TARGET = ECDB.BOOK(b_CP.Value('sel_target'));

    var sum = {
      ac: 0,
      ad: 0,
      ae: 0,
      al: 0,
      ai: 0
    };

    Object.keys(sum).forEach(function(ty) {
      var vals = b_TARGET.Value(ty + '_items[' + ty + '_value]');
      $.isArray(vals) && vals.forEach(function(val) {
        val && (sum[ty] += val);
      });
    });

    var mes = '<table style="margin:0 auto;">';
    var sty = ' style="text-align:right;"';

    $.each(sum, function(k, v) {
      mes += '<tr>';
      mes += '<td>' + AS.a_types[k] + '</td>';
      mes += '<td' + sty + '>' + Fn.split3(v, ',') + '</td>';
      mes += '</tr>';
    });

    mes += '<tr style="font-weight:bold;">';
    mes += '<td>貸借差異:</td>';
    mes += '<td' + sty + '>'
      + Fn.split3(sum.ac + sum.al - sum.ad - sum.ae - sum.ai, ',') + '</td>';
    mes += '</tr></table>';
    b_TARGET.alert(mes, null, {
      title: 'バランス表示'
    });

  }

  function calcLinesSum(matrix_id, targ_id, fn) {
    var b_TARG = this, sum = 0, cnt = b_TARG.MatrixCount(matrix_id);
    while(cnt)
      sum += b_TARG.Value(matrix_id + '[' + targ_id + '][' + (--cnt) + ']');
    return sum;
  }

  function calcSubstituteMD(ow) {
    var b_MD = this, year = b_AD.Value('year');
    alert('not implemented yet. overwrite = ' + ow);
  }

  function calcSubstituteSD(ow) {
    var b_SD = this, year = b_AD.Value('year');
    alert('not implemented yet. overwrite = ' + ow);
  }

}).call(AppSpace);
