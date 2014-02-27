/***/
(function(ns) {
  var AS = this, Bs = AS.BookSrc, Fn = AS.Fn;

  var Book = {
    title: "処理ロジック"
  };

  Book.structure = [
    ["_id", "_id", "string", "", {
      pkey: true
    }, 20],
    ["name", "ロジックコード", "string", "", {
      skey: true,
      explain: '"Fn.~" で始めると flexFunction で呼び出すことができます。'
    }, 55],
    ["type", "種類", "select", {
      '一般': 0,
      '帳票': 1,
      'テンプレート（一般）': 90,
      'テンプレート（帳票）': 91,
      'テンプレート': 99
    }, {
      skey: true
    }, 25],
    ["title", "", "string", "", {
      skey: true,
      placeholder: '表示タイトル'
    }, 100],
    ["explain", "説明", "text", "", "", 100],
    ["enabb_ymd", "有効開始", "datim", "", "skey|default(0)", 45],
    ["", "", "html", '<div style="text-align:center">〜</div>', {}, 10],
    ["enabe_ymd", "終了", "datim", "", "skey|default(4102412399)", 45],
    ["function", "処理ロジック", "script", "", {
      height: 300,
      'default': "function(){\n}"
    }, 100],
    ["message", "", "html", '<div style="height:12px;text-align:center;"/>',
      {}, 100]];

  //list
  Book.list = 'title name type enabb_ymd enabe_ymd';

  $.extend(Book, {
    beforeShowForm: beforeShowForm,
    onChangeMode: onChangeMode,
    onChangeForm: onChangeForm
  });

  // assign
  $.extend(Bs, {
    FNS: Book
  });

  return;

  function beforeShowForm() {
    var b_FNS = this;
    Fn.bindScriptKeyup(b_FNS.Input('function'), b_FNS.Input('message'));
  }

  function onChangeMode(mode) {

    var b_FNS = this, key = b_FNS.Key();
    mode == true && ineditControl();
    key && mode == false && outeditControl();
    return;

    function ineditControl() {
      if(b_FNS.Value('type') >= 90)
        b_FNS.Value('type', b_FNS.Value('type') - 90);
    }

    function outeditControl() {
      if(b_FNS.hash[key].company_key == Synquery.company_key) {
        b_FNS.FormButton('EDIT').hide(), b_FNS.Value('type') < 90
          && b_FNS.Value('type', b_FNS.Value('type') + 90);
      } else {
        b_FNS.FormButton('EDIT').show();
      }
    }

  }

  function onChangeForm(dom, aft, bef) {

    var b_FNS = this, key = b_FNS.Key(), mode = b_FNS.Editing;
    mode && dom && dom.jquery && dom.is(b_FNS.Input('type')) && aft >= 90
      && undoType();

    function undoType() {
      b_FNS.alert(' "テンプレート" は選択出来ません。');
      b_FNS.Value('type', bef);
    }

  }

}).call(AppSpace);
