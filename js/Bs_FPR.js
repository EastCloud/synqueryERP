/***/
(function(ns, Fn) {

  var Book = {
    title: "自由帳票"
  };

  Book.structure = [
    ["_id", "_id", "string", "", {
      pkey: true
    }, 20],
    ["name", "帳票名称", "string", "", {
      skey: true
    }, 80],
    ["width", "横", "string", "", {}, 20],
    ["height", "縦", "string", "", {}, 20],
    ["margins", "余白目安", "string", "", {}, 30],
    ECDB.SPACE(30),
    {
      "印刷": [
        [
          "items[]",
          "配置",
          [
            ["func", "関数", "select",
              ['line', 'rect', 'text', 'image', 'circle', 'ellipse'], {}, 18],
            ["args", "引数", "text", "", {}, 70]], "240", {}, 12],
        ["images", "画像登録", "image", "", {}, 100], ECDB.SPACE(35),
        ["btn_execute", "", "button", Fn.execFreePrint, {
          label: '印刷'
        }, 30], ECDB.SPACE(35)],
      "データ操作": [
      // data copying
      ["copy_key", "ソースキー", "string", "", {}, 30],
        ["copy_src", "ソース始点", "integer", "", {}, 10],
        ["copy_dst", "ディスト始点", "integer", "", {}, 10],
        ["copy_num", "行数", "integer", "", {}, 10], ECDB.SPACE(10),
        ["btn_copy", "", "button", Fn.execCopyPrint, {
          label: 'コピー開始'
        }, 30],
        // data converting
        ["convfn", "コンバート", "script", "", {
          height: 300,
          'default': "function(i, f, a){\n}"
        }, 100], ECDB.SPACE(20),
        ["btn_convert", "", "button", Fn.execConvPrint, {
          label: '変換'
        }, 30], ["btn_revert", "", "button", Fn.execRevPrint, {
          label: '戻し'
        }, 30], ECDB.SPACE(20)]
    }];

  // list
  Book.list = 'name';

  // style
  var style = {
    formWidth: 680,
    maxRow: 200
  };

  // param
  $.extend(Book, {
    style: style
  });

  // assign
  $.extend(ns, {
    FPR: Book
  });

  return;

})(AppSpace.BookSrc, AppSpace.Fn);
