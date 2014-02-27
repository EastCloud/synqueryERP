/***/
(function(ns) {

  var Book = {
    title: "イベントタスク一覧"
  };

  Book.structure = [
    ["_id", "情報ID", "string", "", "pkey", 20],
    ["name", "名称", "string", "", "skey", 80],
    [
      "tasks[]",
      "タスク一覧",
      [["task_title", "タイトル", "string", "", {}, 25],
        ["task_detail", "詳細", "text", "", {}, 65]], 270, {}, 10]];

  $.extend(ns, {
    TSK: Book
  });

  return;

})(AppSpace.BookSrc);
