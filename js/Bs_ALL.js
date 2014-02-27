/***/
(function() {

  var AS = this;
  var Bs = AS.BookSrc, Bt = AS.BookType, Ba = AS.BookAll, colors = AS.b_colors;
  var Fn = AS.Fn;

  Ba.forEach(function(type, i) {

    var rsd = Bs[type];
    if(!rsd)
      return;

    if(!rsd.style)
      rsd.style = {};

    // TODO partly set history
    $.extend(rsd.style, {
      noIndex: true,
      history: 0,
      readOnce: 0,
      color: AS.d_colors[type] || colors[i % colors.length]
    });

    if(Bt.Control[type])
      delete rsd.style.color;

    // when save form, check company key.
    rsd.beforeSaveForm = (function(fn) {
      return function(d) {
        if(type == 'CMP' && d._id == null) // new company
          true;
        else if(!Synquery.Company || !AS.Bo.CMP.hash[Synquery.Company])
          return this.alert('会社が選択されていません。'), true;
        return $.isFunction(fn) ? fn.call(this, d): false;
      };
    })(rsd.beforeSaveForm);

    // when save form, force putting a log
    rsd.onSaveForm = (function(fn) {
      return function(d) {

        AS.Bo.LOG.Put({
          date: parseInt(Date.now() / 1000),
          book: type,
          func: d._id ? 'update': 'insert',
          name: Synquery.UserName,
          data: d,
          diff: Fn.createDiffJSON(AS.Bo[type].hash[d._id], d, eachCompare),
          extd: {
            userAgent: navigator.userAgent,
            UID: Synquery.UserId,
            email: Synquery.Email
          }
        });
        return $.isFunction(fn) ? fn.call(this, d): d;

        function eachCompare(k, b, a) {
          return [empty(b), empty(a)].join(' => ');
          function empty(v) {
            return !v && typeof v != 'number' ? '(empty)': v;
          }
        }

      };
    })(rsd.onSaveForm);

    if(!Bt.Master[type])
      return;

  });

  var DAT = 'AD MD SD'.split(/\s/);
  DAT.forEach(function(type, i) {

    var rsd = Bs[type];

    // style
    rsd.style = $.extend(rsd.style, {
      ty: 3,
      titleSize: '90%'
    });

    // when inedit/outedit
    var _onChangeMode = rsd.onChangeMode || $.noop;
    rsd.onChangeMode = function() {
      var book = this, flag = arguments[0];
      book.Form()[(flag ? 'add': 'remove') + 'Class']('editmode');
      Fn.reflectToButtons(book.name);
      _onChangeMode.apply(book, arguments);
    };

    // when table click
    rsd.onClickTableLine = function(e, dom, key) {
      var b_TARG = AS.Bo[type];
      if(b_TARG.Editing == false)
        Fn.focusForm(type).LoadForm(key);
      else
        b_TARG.View(key);
      return false;
    };

    // when form data is loaded
    rsd.onPutForm = function(obj) {
      var b_CP = AS.Bo.CP;
      if(b_CP.Value('sel_target') != this.name)
        b_CP.Value('sel_target', this.name);
      if(AS.Bo[type].Editing == false)
        b_CP.TabHead("入力フォーム操作").click();
      return obj;
    };

  });
}).call(AppSpace);
