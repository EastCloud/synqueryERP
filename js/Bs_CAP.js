/***/
(function() {
  var AS = this, Bs = AS.BookSrc;

  var Book = {
    title: "汎用属性タイプ"
  };

  Book.structure = [["_id", "情報ID", "string", "", "pkey", 20],
    ["name", "名称", "string", "", "skey", 80],
    ["tags", "タグ", "string", "", "skey", 100]];

  $.extend(Bs, {
    CAP: Book
  });

  return;

}).call(AppSpace);
