/***/
(function(ns) {

  var Book = {
    title: "給与／控除項目"
  };

  Book.structure = [["_id", "情報ID", "string", "", "pkey", 20],
    ["name", "名称", "string", "", "skey", 80]];

  // assign
  $.extend(ns, {
    ITM: Book
  });

  return;

})(AppSpace.BookSrc);
