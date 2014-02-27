/***/
(function() {
  var AS = this, Bs = AS.BookSrc;

  var Book = {
    title: "データ取り込み"
  };

  var exp = '※本機能は処理ロジック関数内で利用するデータをアップロードする機能です。'
    + '「Master」データのインポートは [メニュークリック] > [一覧] > [インポート]、'
    + '「Data」データのインポートは [コントロールパネル] ' + ' から行って下さい。';
  Book.structure = [["html", "", 'html', '<div>' + exp + '</div>', {
    height: 88,
    css: {
      fontWeight: 'bold',
      paddingTop: 10
    }
  }, 100], ["_id", "_id", "string", "", {
    pkey: true
  }, 20], ["name", "データ名称", "string", "", {
    skey: true
  }, 80], ["type", "データタイプ", "select", {
    '': 0,
    '健康保険料率(協会けんぽ)': 1,
    '厚生年金保険(協会けんぽ)': 2,
    '年末調整用給与等金額表': 3
  }, {}, 50], ["logic", "変換ロジック", "refer", "FNS", {}, 15],
    ["logic.name", "", "", "", {}, 35],
    ["enabb_ymd", "適用開始", "datim", "", "default(0)", 45],
    ["", "", "html", '<div style="text-align:center">〜</div>', {}, 10],
    ["enabe_ymd", "終了", "datim", "", "default(4102412399)", 45],
    ["", "添付欄", "text", "", {
      height: 135
    }, 100], ECDB.SPACE(35), ["", " ", "button", function() {
      this.Value('');
    }, {
      label: "変換"
    }, 30], ECDB.SPACE(70), ECDB.SPACE(15), ["data", "データ", "text", "", {
      height: 135
    }, 100]];

  // event function
  $.extend(Book, {});

  // assign
  $.extend(Bs, {
    IMP: Book
  });

  return;

}).call(AppSpace);
