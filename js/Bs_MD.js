/***/
(function() {
  var AS = this;
  var Bs = AS.BookSrc, Fn = AS.Fn;

  var Book = {
    title: "[(給与)月次] 締入力"
  };

  Book.structure = [
    ["year", "年", "integer", "", {
      'default': Fn.thisYear()
    }, 20],
    ["month", "月", "integer", "", {
      min: 1,
      max: 12,
      'default': Fn.thisMonth()
    }, 10],
    ECDB.SPACE(70),

    ["employee", "給与取得者", "refer", "EES", {}, 20],
    ["employeename", "", "refval", "=employee.name", {}, 30],
    ["has_remark", "備考等の記載あり", "toggle", [0, 1], {}, 30],
    ECDB.SPACE(20),

    {
      "基本／勤務": [["day", "適用日", "integer", "", {}, 20],
        ["apply_date", "実施日", "date", "", {}, 30], ECDB.SPACE(50),
        ["commit_days", "日数", "integer", "", {}, 20],
        ["commit_time", "時間", "float", "", {}, 30], ECDB.SPACE(50)],

      "所得": [
        ["salary", "課税所得", "account", "", {}, 30],
        [
          "salary_items[]",
          "給与項目",
          [["stype", "種類", "refer", "ITM", {}, 15],
            ["stype.name", "", "", "", {}, 20],
            ["svalue", "所得額", "account", "", {}, 45]], 75, {}, 20],
        ["tf_salary", "非課税所得", "account", "", {}, 30],
        [
          "tf_salary_items[]",
          "給与項目",
          [["tfs_type", "種類", "refer", "ITM", {}, 15],
            ["tfs_type.name", "", "", "", {}, 20],
            ["tfs_value", "所得額", "account", "", {}, 45]], 75, {}, 20],
        ["ex_salary", "経費精算", "account", "", {}, 30],
        [
          "ex_salary_items[]",
          "経費項目",
          [["exs_type", "種類", "refer", "ITM", {}, 15],
            ["exs_type.name", "", "", "", {}, 20],
            ["exs_value", "清算額", "account", "", {}, 45]], 75, {}, 20]],

      "控除": [
        ["diduction", "所得控除", "account", "", {}, 30],
        [
          "diduction_items[]",
          "控除項目",
          [["dtype", "種類", "refer", "ITM", {}, 15],
            ["dtype.name", "", "", "", {}, 20],
            ["dvalue", "控除額", "account", "", {}, 45]], 75, {}, 20],
        ["diducting_tax", "調整前 源泉徴収税額", "account", "", {}, 30],
        [
          "diducting_tax_items[]",
          "税項目",
          [["ttype", "種類", "refer", "ITM", {}, 15],
            ["ttype.name", "", "", "", {}, 20],
            ["tvalue", "税額", "account", "", {}, 45]], 75, {}, 20],
        ["special_diducting_tax", "特別徴収税", "account", "", {}, 30],
        [
          "special_diducting_tax_items[]",
          "税項目",
          [["sdt_type", "種類", "refer", "ITM", {}, 15],
            ["sdt_type.name", "", "", "", {}, 20],
            ["sdt_tvalue", "税額", "account", "", {}, 45]], 75, {}, 20]],

      "支給": [
        ["paying", "支給計", "account", "", {}, 30],
        [
          "paying_items[]",
          "配分",
          [["ptype", "種類", "refer", "PAY", {}, 15],
            ["ptype.name", "", "", "", {}, 40],
            ["pvalue", "支給額", "account", "", {}, 25]], 75, {}, 20]],

      "勘定": Fn.BSPL({
        image: true
      }),

      "設定／備考": [["remark", "備考", "text", "", {}, 100],
        ['sub_remarks', '', 'text', "", 'hidden', 0]]

    }];

  Book.list = 'year month employee.name salary'
    + ' diduction diducting_tax special_diducting_tax paying';
  Book.onIndexEnd = onIndexEnd;

  $.extend(Bs, {
    MD: Book
  });

  return;

  function onIndexEnd() {
    var b_MD = this;
    b_MD.Find({}, {
      sort: {
        year: 1,
        employee: 1,
        month: 1
      }
    }, function(keys) {
      b_MD.seq = keys;
    });
  }

}).call(AppSpace);
