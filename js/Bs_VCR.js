/***/
(function() {
  var AS = this;
  var Fn = AS.Fn;

  var Book = {
    title: "貸方"
  };

  Book.structure = [
    ["remark", "備考等", "text", "", {
      height: 24
    }, 80],
    ["dsum", "貸方合計", "account", "", {}, 20],
    [
      "lines[]",
      "",
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
    VCR: Book
  });

  return;

  function onChangeForm($dom) {
    var b_VCR = this;
    if($dom.jquery && /^lines\[value\]/.test(b_VCR.DomName($dom) || ''))
      b_VCR.Value('dsum', Fn.calcLinesSum.call(b_VCR, 'lines', 'value'));
  }

}).call(AppSpace);
