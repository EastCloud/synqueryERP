/***/
(function(ns) {

  var Book = {
    title: "扶養タイプ"
  };

  Book.structure = [["_id", "情報ID", "string", "", "pkey", 20],
    ["name", "名称", "string", "", "skey", 80]];

  $.extend(ns, {
    DEP: Book
  });

  return;

})(AppSpace.BookSrc);
