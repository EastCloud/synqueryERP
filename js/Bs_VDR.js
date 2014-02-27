/***/
(function() {
  var AS = this;
  var Fn = AS.Fn;

  var Book = {
    title: "借方"
  };

  Book.structure = [
    ["dsum", "借方合計", "account", "", {}, 20],
    ECDB.SPACE(15),
    ["year", "年", "integer", "", {}, 20],
    ["month", "月", "integer", "", {
      min: 1,
      max: 12,
    }, 10],
    ["day", "日", "integer", "", {
      min: 1,
      max: 31
    }, 10],
    ["j_ty", "データタイプ", "string", "", "hidden", 0],
    ["j_id", "データID", "string", "", {
      align: 'center'
    }, 15],
    ["bind", "伝票No.", "integer", "", {
      min: 0
    }, 10],
    [
      "lines[]",
      "仕訳",
      [["type", "", "refer", "ACC", {}, 6],
        ["type.name", "科目", "", "", {}, 27],
        ["stype", "", "refer", "ACS", {}, 6],
        ["stype.name", "副科目", "", "", {}, 27],
        ["value", "金額", "account", "", {}, 25],
        ["img", "添付", "image", "", {}, 6], ["type.code", "科目コード", "", "", {
          align: 'right'
        }, 27], ["remark", "備考", "text", "", {}, 58]], 100, {
        resize: 1
      }, 9]];

  $.extend(Book, {
    onChangeForm: onChangeForm
  });

  $.extend(AS.BookSrc, {
    VDR: Book
  });

  return;

  function onChangeForm($dom) {
    var b_VDR = this;
    if($dom.jquery && /^lines\[value\]/.test(b_VDR.DomName($dom) || ''))
      b_VDR.Value('dsum', Fn.calcLinesSum.call(b_VDR, 'lines', 'value'));
  }

}).call(AppSpace);
