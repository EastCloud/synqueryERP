/***/
(function(ns) {

  var Book = {
    title: "給与取得者情報"
  };

  Book.structure = [
    ["_id", "情報ID", "string", "", {
      "pkey": true
    }, 20],
    ["name", "姓名", "string", "", {
      "skey": true
    }, 40],
    ["birth", "生年月日", "date", "", {}, 20],
    ["is_executive", "役員", "toggle", "", {}, 20],
    ["zip1", "〒", "zip", "", {}, 20],
    ["address[0]", "住所", "address", "", {}, 40],
    ["address[1]", "", "address", "", {}, 40],
    {
      "社会保険": [
        ["ins_type", "健康保険タイプ", "refer", "INS", {}, 25],
        ["ins_type.name", "", "", "", {}, 75],
        [
          "pens[]",
          "年金タイプ",
          [["pen_type", "", "refer", "PEN", {}, 15],
            ["pen_type.name", "", "", "", {}, 65]], 90, {}, 20],
        [
          "pays[]",
          "標準報酬月額",
          [["app_date", "", "date", "", {}, 30],
            ["std_value", "", "account", "", {}, 50]], 90, {}, 20]],
      "扶養者": [[
        "depends[]",
        "扶養タイプ",
        [["dep_type", "", "refer", "DEP", {}, 20],
          ["dep_type.name", "", "", "", {}, 60],
          ["dep_name", "被扶養者氏名", "string", "", {}, 40],
          ["dep_call", "読み方", "string", "", {}, 40],
          ["dep_birth", "生年月日", "date", "", {}, 20],
          ["dep_sex", "", "select", {
            男: 1,
            女: 2
          }, {}, 10], ["dep_rel", "続柄", "string", "", {}, 10],
          ["dep_job", "職業", "string", "", {}, 20],
          ["dep_inc", "収入", "string", "", {}, 20], ["dep_pos", "", "select", {
            同居: 1,
            別居: 2
          }, {}, 20], ["dep_fr", "開始", "date", "", {}, 20],
          ["dep_to", "終了(見込)", "date", "", {}, 20],
          ["dep_rm", "備考", "text", "", {}, 20]], 200, {}, 20]]
    }];

  $.extend(ns, {
    EES: Book
  });

  return;

})(AppSpace.BookSrc);
