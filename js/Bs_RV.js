/***/
(function() {
  var AS = this, Bs = AS.BookSrc, Fn = AS.Fn;

  var Data = {
    FnsD: 'fns_d'
  };

  var Book = {
    title: "帳票計算"
  };

  Book.structure = [["type", "帳票タイプ", "select", {
    ' 帳票リスト取得中 ... ': 'noop'
  }, {}, 75], ["divout", "画面出力のみ", "toggle", [0, 1], {}, 25],
    ["explain", "", "html", "<div></div>", {
      height: 42,
      css: {
        marginTop: 4,
        padding: '2px 4px',
        borderRadius: '4px',
        color: '#444',
        background: '#fff',
        'overflow-y': 'auto',
        '-webkit-user-select': 'auto'
      }
    }, 100], ["year", "年", "integer", "", {
      'default': Fn.nowY()
    }, 15], ["month", "月", "integer", "", {
      min: 1,
      max: 12,
      'default': Fn.nowM()
    }, 10], ["fry", "開始年", "integer", "", {
      'default': Fn.nowY()
    }, 15], ["frm", "月", "integer", "", {
      min: 1,
      max: 12,
      'default': 1
    }, 10], ["frd", "日", "integer", "", {
      min: 1,
      max: 31,
      'default': 1
    }, 10], ECDB.SPACE(5), ["toy", "終了年", "integer", "", {
      'default': Fn.nowY()
    }, 15], ["tom", "月", "integer", "", {
      min: 1,
      max: 12,
      'default': 12
    }, 10], ["tod", "日", "integer", "", {
      min: 1,
      max: 31,
      'default': 31
    }, 10], ["employee", "給与取得者", "refer", "EES", {}, 15],
    ["employeename", "", "refval", "=employee.name", {}, 40], ECDB.SPACE(45),
    ["type_on", "科目分類", "toggle", [0, 1], {
      'default': 1
    }, 20], ["subtype_on", "副科目分類", "toggle", [0, 1], {
      'default': 1
    }, 20], ["j_on", "集計対象", "select", AS.j_types, {
      multiple: true,
      'default': 0
    }, 20], ["ooj_on", "簿外含める", "toggle", [0, 1], {}, 20], ECDB.SPACE(20),
    ["btn_reporting", "", "button", Fn.makeReport, {
      label: "出力"
    }, 25], ["report", "", "html", "<div/>", {
      resize: true,
      css: {
        padding: '0 8px',
        border: '1px solid #aaa',
        borderRadius: 8,
        boxShadow: 'inset 0px -1px 1px rgba(44, 44, 44, 0.4)',
        height: 240
      }
    }, 100], ECDB.SPACE(40), ["", " ", "button", function(b_RV) {
      b_RV.Form().dialog('widget').fadeOut();
    }, {
      label: "_CLOSE_"
    }, 20]];

  // style
  var style = {
    noSearch: true,
    noClose: true
  };

  // param
  $.extend(Book, {
    style: style,
    formButton: 'none'
  });

  // event function
  $.extend(Book, {
    beforeShowForm: beforeShowForm,
    onChangeForm: onChangeForm
  });

  // assign
  $.extend(Bs, {
    RV: Book
  });

  return;

  function beforeShowForm() {

    var b_RV = this;
    b_RV.ChangeFormMode(true); //waiting form button

    var f = b_RV.Input('report');
    f.parent().css({
      minHeight: f.parent().height(),
      height: 'auto',
      overflow: 'auto'
    });
    f.css({
      minHeight: f.height(),
      height: 'auto'
    });

    ['month', 'frm', 'tom'].forEach(function(k) {
      Fn.bindSimpleMinMax(b_RV.Input(k), 'change', 1, 12);
    });

    ['frd', 'tod'].forEach(function(k) {
      Fn.bindSimpleMinMax(b_RV.Input(k), 'change', 1, 31);
    });

    Fn.hideRVInput(true);
    Fn.flexFunctionList({
      type: 1
    // 帳票
    }, new Date()).done(function(datas) {

      var items = {};
      var stock = [], except = {}, fns_d = {};
      b_RV.Input('type').data(Data.FnsD, fns_d);

      // set default
      $.each({
        ' - ': 'noop'
      }, function(expl, value) {
        items[expl] = {};
        items[expl].value = value;
        items[expl].stat = getOrderdStat(expl, 0);
        fns_d[items[expl].value] = {
          explain: '(帳票説明)'
        };
      });

      datas.forEach(function(d) {

        var expl = d.title || d.explain && d.explain.split("\n").pop();
        if(d.company_key != Synquery.Company) // TEMPLATE STOCK TEMPORARY
          return d.name.indexOf('Fn.') == 0 && stock.push([expl, d]);

        if(d.name.indexOf('Fn.') != 0) {
          except[expl] = true;
          console.warn(expl + ' は "Fn." で始まる名前でないので、リストから除外されます。');
          return;
        }

        (function() {
          items[expl] = {};
          items[expl].value = d.name.replace(/^Fn./, '');
          items[expl].stat = getOrderdStat(expl, 1);
          fns_d[items[expl].value] = d;
        })();

      });

      stock.forEach(function(a) { // IF NOT EXIST, USE THE TEMPLATE
        var expl = a[0], d = a[1];
        !except[expl] && !items[expl] && (function() {
          items[expl] = {};
          items[expl].value = d.name.replace(/^Fn./, '');
          items[expl].stat = getOrderdStat(expl, 1);
          fns_d[items[expl].value] = d;
        })();
      });

      var li = {};
      Object.keys(items).sort(function(expl1, expl2) {
        var stats1 = items[expl1].stat[0], stats2 = items[expl2].stat[0];
        for( var i = 0; i < stats1.length || i < stats2.length; i++)
          if(stats1[i] != stats2[i])
            return parseInt(stats1[i]) < parseInt(stats2[i]) ? -1: 1;
        return expl1.localeCompare(expl2); // sort by name
      }).forEach(function(expl) {
        var stats = items[expl];
        li[stats.stat[1]] = stats.value;
      });

      b_RV.ChangeListItem(b_RV.Input('type'), li);
      b_RV.Value('type', 'noop');

      function getOrderdStat(v, def) {
        if(/^(\d|-)+\./.test(v))
          return (function(a) {
            return [a.shift().split('-'), a.shift()];
          })(v.split('.'));
        return [[def], v];
      }

    }).fail(function(e) {
      console.error(e);
    });

  }

  function onChangeForm(dom, aft, bef) {

    var b_RV = this;
    if(dom && typeof dom.is == 'function' && dom.is(b_RV.Input('type'))) {

      Fn.hideRVInput(), b_RV.Input('btn_reporting')[aft ? 'show': 'hide']();
      if(!aft)
        return;

      var stat = aft.split('-').slice(1);
      var stat0 = stat[0] || '', stat1 = stat[1] || '';
      var stat2 = stat[2] && stat.slice(2).join('-') || '';
      var inps = [], fns_d = b_RV.Input('type').data(Data.FnsD);

      stat0.indexOf('Y') >= 0 && inps.push('year');
      stat0.indexOf('M') >= 0 && inps.push('month');
      stat0.indexOf('EE') >= 0 && inps.push('employee', 'employeename');
      fns_d[aft].explain && b_RV.Input('explain').text(fns_d[aft].explain);

      ['Y', 'M', 'D'].forEach(function(k) {
        if(stat1.indexOf(k) >= 0)
          inps.push('fr' + k.toLowerCase(), 'to' + k.toLowerCase());
      });

      if(stat2.indexOf('ON') === 0)
        inps.push('type_on', 'subtype_on', 'j_on', 'ooj_on');

      var mtc = null;
      if(mtc = stat2.match(/-STYOFF/)) {
        b_RV.Value('subtype_on', 0);
      }

      if(mtc = stat2.match(/-J(\d*)ON/)) {
        inps.indexOf('j_on') == -1 && inps.push('j_on');
        mtc[1] ? b_RV.Value('j_on', mtc[1].split('').map(function(v) {
          return parseInt(v);
        })): b_RV.Value('j_on', [0]);
      } else {
        b_RV.Value('j_on', [0]);
      }

      inps.forEach(function(i) {
        Fn.inputWithLabel(b_RV, i).show();
      });

    }

  }

  function onBroadcast() {
    // TODO update list
  }

}).call(AppSpace);
