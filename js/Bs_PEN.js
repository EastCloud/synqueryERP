/***/
(function(ns) {

  var Book = {
    title: "年金タイプ"
  };

  Book.structure = [
    ["_id", "情報ID", "string", "", "pkey", 20],
    ["name", "名称", "string", "", "skey", 80],
    ["url", "URL", "url", "", "", 100],
    [
      "datas[]",
      "取込データ",
      [["data_id", "", "refer", "IMP", {}, 15],
        ["data_id.name", "", "", "", {}, 65]], 90, {}, 20]];

  $.extend(ns, {
    PEN: Book
  });

  return;

})(AppSpace.BookSrc);
