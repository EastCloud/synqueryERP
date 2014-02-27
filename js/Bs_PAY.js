/***/
(function(ns) {

  var Book = {
    title: "支給項目"
  };

  Book.structure = [["_id", "情報ID", "string", "", "pkey", 20],
    ["name", "名称", "string", "", "skey", 80]];

  $.extend(ns, {
    PAY: Book
  });

  return;

})(AppSpace.BookSrc);
