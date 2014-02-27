/***/
(function() {
  var AS = this, Bs = AS.BookSrc;

  var Book = {
    title: "勘定科目"
  };

  var a_types = {};
  a_types["(未選択)"] = 0, $.each(AS.a_types, function(k, v) {
    a_types[v] = k;
  }), a_types['その他'] = 9;

  var t_divs = {};
  $.each(AS.t_divs, function(k, v) {
    v != 0 && (t_divs[k] = v);
  });

  var matrix_img = '<img style="width:30px;height:29px;" src="data:image/png;base64,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"/>';

  Book.structure = [
    ["code", "勘定コード", "string", "", "skey", 20],
    ["name", "名称", "string", "", "skey", 60],
    ["type", "主分類", "select", a_types, {}, 20],
    ["tax", "消費課税", "toggle", [0, 1], {
      explain: '消費税の課税対象かどうかを設定します。\n' + '（税率の細かい設定は関数にて行います。）'
    }, 20],
    ["tax_div", "課税対象区分", "select", t_divs, {
      explain: '法人所得税等の課税対象有無を選択します。\n' + '（収益、費用にのみ反映されます。）'
    }, 20],
    ["state_div", "決算書区分", "select", AS.s_divs, {}, 20],
    ["list_lev", "配置順レベル", "integer", "", {
      explain: 'レベルの高い勘定科目が、決算書のより上に表示されます。'
    }, 20],
    ["_id", "情報ID", "string", "", "pkey", 20],
    [
      "to_matrix",
      "",
      "html",
      '<div>' + matrix_img + '<span class="link red" style="'
        + 'display: inline-block;' + 'vertical-align: top;' + 'margin: 9px;'
        + 'font-size: 80%;' + '">' + ' 一括登録/編集はこちらから ' + '</span>' + '</div>',
      {
        css: {
          textAlign: 'center',
          marginTop: 4,
          cursor: 'pointer'
        }
      }, 100]];

  $.extend(Book, {
    onChangeMode: onChangeMode
  });

  $.extend(Bs, {
    ACC: Book
  });

  return;

  function onChangeMode(aft, bef) {
    var b_ACC = this;
    if(aft === true && bef === false)
      b_ACC.Input('to_matrix').parents('._input_row_:first').hide('blind');
    if(aft === false && bef === true)
      b_ACC.Input('to_matrix').parents('._input_row_:first').show('blind');
  }

}).call(AppSpace);
