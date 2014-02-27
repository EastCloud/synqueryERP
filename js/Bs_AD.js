/***/
(function() {
  var AS = this;
  var Bs = AS.BookSrc, Fn = AS.Fn;

  var Book = {
    title: "[(給与)年次] 調整項目入力"
  };

  Book.structure = [
    ["year", "年", "integer", "", {
      'default': Fn.nowY(),
    }, 20],
    ECDB.SPACE(80),
    ["employee", "給与取得者", "refer", "EES", {}, 20],
    ["employeename", "", "refval", "=employee.name", {}, 30],
    ECDB.SPACE(50),
    {
      "生命保険": [
        [
          "life_insurance_items[]",
          "保険項目",
          [["lidiv", "制度", "select", {
            '': 0,
            '旧制度': 'Old',
            '新制度': 'New'
          }, {}, 30], ["lival", "証明額", "account", "", {}, 45],
            ["liimg", "#", "image", "", {}, 5]], 75, {}, 20], ECDB.SPACE(40),
        ["life_insurance", "控除合計額", "account", "", {}, [30, 30]]],
      "地震保険": [
        [
          "quake_insurance_items[]",
          "保険項目",
          [["eqdiv", "制度", "select", {
            '': 0,
            '一律': 1
          }, {}, 30], ["eqval", "証明額", "account", "", {}, 45],
            ["eqimg", "#", "image", "", {}, 5]], 75, {}, 20], ECDB.SPACE(40),
        ["quake_insurance", "控除合計額", "account", "", {}, [30, 30]]],
      "その他掛金等（社会保険料合算項目）": [
        [
          "other_diduction_items[]",
          "控除項目",
          [["oddiv", "制度", "select", {
            "": 0,
            "個人型確定拠出年金": 1
          }, "", 30], ["odval", "証明額", "account", "", "", 45],
            ["odimg", "#", "image", "", {}, 5]], 75, {}, 20], ECDB.SPACE(40),
        ["other_diduction", "控除合計額", "account", "", {}, [30, 30]]]
    }, ["base_diduction", "基礎控除", "account", "", {
      'default': 380000
    }, 15],
    ["general_supporting_diduction", "控除対象扶養親族", "integer", "", {}, 15],
    ["spouse_special_diduction", "配偶者特別控除", "account", "", {}, 15],
    ECDB.SPACE(55)];

  $.extend(Bs, {
    AD: Book
  });

  return;

}).call(AppSpace);
