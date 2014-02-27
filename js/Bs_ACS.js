/***/
(function() {
  var AS = this, Bs = AS.BookSrc;

  var Book = {
    title: "副科目"
  };

  var t_divs = {};
  t_divs['(科目から継承)'] = 0, $.each(AS.t_divs, function(k, v) {
    v != 0 && (t_divs[k] = v);
  });

  Book.structure = [["code", "副科目コード", "string", "", "skey", 20],
    ["name", "名称", "string", "", "skey", 60], ECDB.SPACE(20),
    ["acc", "勘定科目", "refer", "ACC", {}, 20],
    ["acc.code", "コード", "refval", "", {}, 20],
    ["acc.name", "", "refval", "", {}, 40],
    ["_id", "情報ID", "string", "", "pkey", 20],
    ["tax", "消費課税", "select", AS.s_taxd, {}, 35],
    ["tax_div", "課税対象区分", "select", t_divs, {}, 30],
    ["cost_div", "原価性", "select", AS.c_divs, {}, 35]];

  $.extend(Bs, {
    ACS: Book
  });

  return;

}).call(AppSpace);
