/***/
(function() {
  var AS = this;
  var Bs = AS.BookSrc, Bt = AS.BookType, Fn = AS.Fn;

  var Book = {
    title: "コントロールパネル"
  };

  var selects = {};
  $.each(Bt.Data, function(k) {
    selects[k + ':' + Bs[k].title] = k;
  });

  $.extend(Fn, {
    focusForm: focusForm,
    focusView: focusView,
    changeInputColor: changeInputColor,
    createDiffJSON: createDiffJSON,
    reflectToButtons: reflectToButtons
  });

  function focusForm(type) {

    var mcs = Object.keys(AS.Bt.Master).concat(Object.keys(AS.Bt.Control));
    var ok = true;
    mcs.forEach(function(ty) {
      if(ok !== true)
        return;

      var b_TARG = AS.Bo[ty];
      b_TARG.isEditing && (ok = b_TARG);

      ok === true && ['FORM', 'TABLE', 'SEARCH'].forEach(function(f) {
        var d = Synquery.$('#' + f + '_' + ty);
        d.length && d.dialog('widget').css('display', 'none');
      });
    });

    if(ok !== true)
      return ok.alert(ok.title + ' が編集中です。');

    var idx = [null, 'AD', 'MD', 'SD'].indexOf(type);
    [AS.flays.body(idx), AS.vlays.body(0)].forEach(function(lay) {
      if(lay.css('display') == 'none')
        lay.siblings().hide(), lay.show();
    });

    var lw = AS.flays.width(), rw = AS.vlays.width(), sw = lw + rw;
    var arr = [parseInt(lw / sw * 100) + '%', parseInt(rw / sw * 100) + '%'];
    localStorage.setItem(AS.skeys.viewin + type, JSON.stringify(arr));

    AS.flays.width('100%'), AS.vlays.width('0%');
    return AS.Bo[type];

  }

  function focusView(type, bOnly) {

    var b_TARG = AS.Bo[type], isEditing = b_TARG.Editing;
    var b_VDR = AS.Bo.VDR, b_VCR = AS.Bo.VCR;

    if(!b_TARG.Key() && !isEditing)
      return b_TARG.alert('[' + b_TARG.name + '] データの表示中または入力中でありません。');

    // >> initialize journal forms >>
    var bnow = b_VDR.Input('bind').val();
    var oty = b_VDR.Value('j_ty'), oid = b_VDR.Value('j_id');
    !/^\w{8}$/.test(oid) && (oid == '');

    [b_VDR, b_VCR].forEach(function(book) {
      book.ChangeFormMode(true), book.InitForm();
    });

    var init = false;

    oty && b_VDR.Value('j_ty', oty);
    !bOnly && oty != type && (function() {
      init = true;
      b_VDR.Value('bind', bnow = 1), b_VDR.Value('j_ty', type);
    })();

    oid && b_VDR.Value('j_id', oid);
    !bOnly && oid != b_TARG.Key() && (function() {
      init = true;
      var j_id = b_TARG.Key() || '';
      b_VDR.Value('bind', bnow = 1), b_VDR.Value('j_id', j_id);
    })();

    !b_VDR.Value('j_id') && b_VDR.Value('j_id', '新規作成');
    init === false && bnow != null && (function() {
      b_VDR.Value('bind', bnow);
    })();

    ['year', 'month', 'day'].forEach(function(id) {
      b_VDR.Value(id, b_TARG.Value(id));
    });

    changeInputColor(b_TARG, b_VDR, ['j_id', 'j_ty']);
    // << initialize journal forms <<

    dataTransfer(bnow, b_TARG, b_VDR, b_VCR);

    // >> mode control >>

    [b_VDR, b_VCR].forEach(function(book) {
      book.ChangeFormMode(isEditing);
    });
    isEditing && setTimeout(function() {
      b_VDR.Input('bind').focus();
    }, 120);

    b_VDR.Input('bind').off('change').on('change', function() {
      transferToForm(type).done(function(targ) {
        focusView(targ, true);
      });
    }).ReadOnly(false); // always false

    ['dsum', 'year', 'month', 'day', 'j_ty', 'j_id'].forEach(function(id) {
      b_VDR.Input(id).ReadOnly(true);
    }); // always true
    ['dsum'].forEach(function(id) {
      b_VCR.Input(id).ReadOnly(true);
    }); // always true

    // << mode control <<

    [AS.flays.body(4), AS.vlays.body(4)].forEach(function(lay) {
      if(lay.css('display') == 'none')
        lay.siblings().hide(), lay.show();
    });

    var arr = [];
    try {
      arr = JSON.parse(localStorage.getItem(AS.skeys.viewin + type)) || [];
    } catch(e) {
    }
    [AS.flays, AS.vlays].forEach(function(lays, i) {
      /0%|100%/.test(arr[i]) && (arr[i] = '');
      lays.width(/%/.test(arr[i]) ? arr[i]: '50%');
    });

    return AS.Bo[type];

  }

  function transferToForm(type) {

    var b_TARG = AS.Bo[type], isEditing = b_TARG.Editing;
    var b_VDR = AS.Bo.VDR, b_VCR = AS.Bo.VCR;

    var dfd = $.Deferred();
    if(!isEditing) {
      dfd.resolve(type);
      return dfd;
    }

    var bnow = b_VDR.Value('bind');
    var know = b_VDR.Value('j_id');
    var bval = {}; // for each a_types

    var j_cols = ['bind', 'line', 'type', 'stype', 'value', 'img', 'remark'];
    var vJD = b_TARG.GetForm(), remove_idx = {}; // for each a_type
    var vDR = b_VDR.GetForm(), vCR = b_VCR.GetForm();

    // get removed record indexes from target journals
    $.each(AS.a_types, function(a_type) {
      var j_items = vJD[a_type + '_items'];
      var r_index = remove_idx[a_type] = [];
      !j_items && (vJD[a_type + '_items'] = {});
      (j_items[a_type + '_bind'] || []).forEach(function(bind, i) {
        bind == bnow && r_index.push(i - r_index.length);
      });
    });

    var firstdfd = $.Deferred(), pipeline = firstdfd;

    // check now entries
    [vDR.lines || {}, vCR.lines || {}].forEach(assignASidePipeline);
    function assignASidePipeline(lines, i) {

      var is_left_side = i === 0, r_cnt = 0;
      $.isArray(lines.type)
        && lines.type.forEach(function(type, row) {

          if(!type)
            return;

          var line = null; // memorize journal position
          pipeline = pipeline.pipe(function() {
            var dfd = $.Deferred();
            AS.Bo.ACC.Get(type, function(obj, err) {

              if(err)
                return dfd.reject(err);

              if(!obj) {
                var m = '勘定科目 "' + type + '" が見つかりません。';
                return dfd.reject(new Error(m));
              }

              var a_type = obj.type;
              if(!a_type) {
                var m = '勘定科目 "' + type + '" は分類不明です。(' + obj.type + ')';
                return dfd.reject(new Error(m));
              }

              var is_left_title = /ac|al/.test(a_type);
              var minus = !(is_left_side && is_left_title || !is_left_side
                && !is_left_title);

              var jval = {};

              // line > 0. "!line" treats as OLD_STYLE_DATA.
              line = ++r_cnt, !bval[a_type] && (bval[a_type] = []),
                bval[a_type].push(jval);

              j_cols.forEach(function(col) {
                var c_key = a_type + '_' + col;
                if(col == 'bind')
                  return jval[c_key] = bnow;
                if(col == 'line')
                  return jval[c_key] = line;
                jval[c_key] = col == 'value' ? (function(v) {
                  return minus ? -1 * v: v;
                })(lines[col][row]): lines[col][row];
              });

              dfd.resolve();

            });
            return dfd;
          });

        });
    }

    pipeline = pipeline.pipe(function(e) {
      // remove original 
      $.each(AS.a_types, function(a_type) {
        var j_items = vJD[a_type + '_items'];
        j_cols.forEach(function(col) {
          var c_key = a_type + '_' + col;
          var j_values = (j_items[c_key] || []);
          j_values.length && remove_idx[a_type].forEach(function(idx) {
            j_values.splice(idx, 1);
          }), j_items[c_key] = j_values;
        });
      });
    });

    pipeline = pipeline.pipe(function() {

      //      console.log('BEF', vJD['ac_items']['ac_bind']);
      // push entries
      $.each(bval, function(a_type, a_vals) {

        a_type = Fn.setAccountType(a_type);
        var a_key = a_type + '_items';

        var j_items = vJD[a_key];
        var r_cnt = j_items[a_type + '_bind'].length;// length now.

        a_vals.forEach(function(a_val, i) {
          var r_val = r_cnt + i;
          j_cols.forEach(function(col, j) {
            var c_key = a_type + '_' + col;
            j_items[c_key][r_val] = a_val[c_key];
          });
        });

      });
      //      console.log('AFT', vJD['ac_items']['ac_bind']);
      // sub_remarks
      var subr = b_TARG.Value('sub_remarks') || [];
      subr[bnow] = b_VCR.Value('remark'), b_TARG.Value('sub_remarks', subr);

    });

    pipeline = pipeline.pipe(function() {

      // set to form
      console.log('SET TARGET OBJECT: ', vJD);
      $.each(AS.a_types, function(a_type) {

        var a_key = a_type + '_items';
        j_cols.forEach(function(col, idx) {

          var c_key = a_type + '_' + col;
          var c_val = vJD[a_key][c_key] || [];
          for( var i = 0; i < c_val.length; i++)
            // undefined, null may exist
            c_val[i] == null && (c_val[i] = '');

          // c_key == "xx_bind"
          idx == 0 && (function(now, req) {
            now != req && (function() {
              b_TARG.CreateLines(a_key, req);
            })();
          })(b_TARG.MatrixCount(a_key), c_val.length || 1);

          c_val.length == 0 && c_val.push('');
          b_TARG.val[a_key][c_key] = c_val; // HACK FOR DECREASE SITUATION
          b_TARG.Value(a_key + '[' + c_key + ']', c_val);

        });
      });

    });

    pipeline = pipeline.pipe(function() {

      // clean up SD form
      $.each(AS.a_types, function(a_type) {
        var a_key = a_type + '_items';
        if(b_TARG.MatrixCount(a_key) < 2)
          return;
        if(!b_TARG.Value(a_key + '[' + a_type + '_type][0]'))
          b_TARG.MatrixLine(a_key).eq(0).find('._delete_button_').mouseup();
      });

    });

    pipeline = pipeline.done(function() {
      dfd.resolve(type);
    }).fail(function(e) {
      b_TARG.alert(e);
    }), firstdfd.resolve();
    return dfd;

  }

  function dataTransfer(bnow, b_TARG, b_VDR, b_VCR) {

    var cvdr = 0, cvcr = 0, svdr = 0, svcr = 0;

    // type
    Object.keys(AS.a_types).forEach(
      function(k, i) {

        var is_left_title = /ac|al/.test(k);
        var items = b_TARG.Value(k + '_items');
        var binds = items[k + '_bind'];
        if(!$.isArray(binds))
          return;

        binds.forEach(function(bind, i) {

          if(bind != bnow)
            return;

          var type = get('type', i);
          if(!type)
            return;

          var value = get('value', i);
          var is_dr_record = is_left_title && value >= 0 || !is_left_title
            && value < 0;
          value < 0 && (value = -1 * value);

          var targj = is_dr_record ? b_VDR: b_VCR;
          var targr = is_dr_record ? cvdr: cvcr;
          targj.CreateLines('lines', targr + 1);

          ['type', 'stype', 'img', 'remark'].forEach(function(key) {
            var targk = 'lines[' + key + '][' + targr + ']';
            var v = get(key, i);
            targj.Value(targk, ''), targj.Value(targk, v == null ? '': v);
          });
          targj.Value('lines[value][' + targr + ']', value);

          (is_dr_record ? function() {
            cvdr++, svdr += value;
          }: function() {
            cvcr++, svcr += value;
          })();

        });

        var subr = b_TARG.Value('sub_remarks')[bnow];
        subr && b_VCR.Value('remark', subr);

        b_VDR.Value('dsum', svdr);
        b_VCR.Value('dsum', svcr);

        function get(t, i) {
          var key = k + '_' + t;
          return items[key] && items[key][i];
        }

      });
  }

  Book.structure = [

    ["sel_target", "ターゲットデータ", "select", selects, {}, 50],
    ECDB.SPACE(20),

    ["fry", "開始年", "integer", "", {
      'default': Fn.nowY()
    }, 15],
    ["toy", "終了年", "integer", "", {
      'default': Fn.nowY()
    }, 15],
    {

      // table sort
      "テーブル操作": [
        ["btn_tableSort", " ", "button", function(b_CP) {
          var targ = b_CP.Value('sel_target');
          Fn.tableSort(targ).done(reflectToButtons);
        }, {
          label: "データサーチ"
        }, 20],
        ["search_fn_on", "ロジック利用", "toggle", [0, 1], {
          'default': 1
        }, 20],
        ["btn_EXPORT", ' ', 'button', function(b_CP) {
          var targ = b_CP.Value('sel_target');
          AS.Bo[targ].exportTable();
        }, {
          label: '_EXPORT_'
        }, 20],
        ["btn_IMPORT", ' ', 'button', function(b_CP) {
          var targ = b_CP.Value('sel_target');
          AS.Bo[targ].importTable();
        }, {
          label: '_IMPORT_'
        }, 20],
        ECDB.SPACE(20),
        [
          "search_fn",
          "検索ロジック(カーソルオーバーで検索の記述例表示)",
          "script",
          "",
          {
            explain: '36行目("if(true)")の書き換えで想いの侭にデータ検索が可能です！\n'
              + '10月のみ: if(obj.month==10)\n'
              + '10月1日のみ: if(obj.month==10&&obj.day==1)\n'
              + '勘定科目が"XAABACDX"のもの: if(type=="XAABACDX")\n'
              + '補助科目が"aabbccdd"のもの: if(stype=="aabbccdd")\n'
              + '値が 500万円以下のもの: if(value<=5000000)\n'
              + '値が 100万円〜500万円のもの: if(1000000<=value&&value<=5000000)',
            height: 240,
            'default': Fn.searchBSPLDefault.toString()
          }, 100]],

      // data calc, data check
      "入力フォーム操作": [["btn_PREV", ' ', 'button', function(b_CP) {
        var targ = b_CP.Value('sel_target');
        focusForm(targ).PrevForm(), reflectToButtons(targ);
      }, {
        label: '_PREV_'
      }, 10], ["lbl_FPOS", '?', 'label', '', {
        align: 'center'
      }, 20], ["btn_NEXT", ' ', 'button', function(b_CP) {
        var targ = b_CP.Value('sel_target');
        focusForm(targ).NextForm(), reflectToButtons(targ);
      }, {
        label: '_NEXT_'
      }, 10], ["btn_NEW", ' ', 'button', function(b_CP) {
        var targ = b_CP.Value('sel_target');
        targ == 'SD' ? dialogForNewForm(b_CP): focusForm(targ).NewForm();
      }, {
        label: '_NEW_'
      }, 20], ["btn_EDIT", ' ', 'button', function(b_CP) {
        var targ = b_CP.Value('sel_target');
        focusForm(targ).EditForm(true);
      }, {
        label: '_EDIT_'
      }, 20], ["btn_FORK", ' ', 'button', function(b_CP) {
        var targ = b_CP.Value('sel_target');
        focusForm(targ).ForkForm();
      }, {
        label: '_FORK_'
      }, 20], ["btn_SAVE", ' ', 'button', function(b_CP) {

        var targ = b_CP.Value('sel_target'), f_mode = formFocusMode();
        f_mode ? sysAction(): transferToForm(targ).done(sysAction);

        function sysAction() {
          focusForm(targ).SaveForm();
        };

      }, {
        label: '_SAVE_'
      }, 20], ["btn_RESAVE", ' ', 'button', function(b_CP) {

        var targ = b_CP.Value('sel_target'), f_mode = formFocusMode();
        f_mode ? sysAction(): transferToForm(targ).done(sysAction);

        function sysAction() {
          focusForm(targ).ResaveForm();
        };

      }, {
        label: '_RESAVE_'
      }, 20], ["btn_RESET", ' ', 'button', function(b_CP) {

        var targ = b_CP.Value('sel_target'), f_mode = formFocusMode();
        f_mode ? sysAction(): transferToForm(targ).done(sysAction);

        function sysAction() {
          focusForm(targ).ResetForm();
        };

      }, {
        label: '_RESET_'
      }, 20], ["btn_QUIT", ' ', 'button', function(b_CP) {

        var targ = b_CP.Value('sel_target'), f_mode = formFocusMode();
        f_mode ? sysAction(): transferToForm(targ).done(sysAction);

        function sysAction() {
          focusForm(targ).QuitForm();
        };

      }, {
        label: '_QUIT_'
      }, 20], ECDB.HR(), ["btn_showJournal", " ", "button", function(b_CP) {
        var targ = b_CP.Value('sel_target'), f_mode = formFocusMode();
        f_mode ? focusView(targ): transferToForm(targ).done(focusForm);
      }, {
        label: "貸借表示切替"
      }, 20], ["btn_calcBalance", " ", "button", Fn.calcBalance, {
        label: "仕訳バランス"
      }, 20], ["btn_calcEmpty", " ", "button", function(b_CP) {
        var targ = b_CP.Value('sel_target'), book = AS.Bo[targ];
        if(book.Editing !== true)
          return book.alert('対象が編集モードにありません。');
        Fn.flexFunction('calcSubstitute' + targ, [{
          book: book,
          form: book.Form() && book.Form().is(':visible') ? book.Form(): false,
          overwrite: !b_CP.Value('overwrite_false'),
          VCR: AS.Bo.VCR,
          VDR: AS.Bo.VDR
        }]).done(function() {
          book.alert('自動計算完了。');
        }).fail(function(e) {
          book.alert('自動計算失敗: ' + (e.message || e));
        });
      }, {
        label: "自動計算"
      }, 20], ["overwrite_false", "上書しない", "toggle", "", {}, 20], ECDB.HR(),
        ["btn_Selectable", ' ', 'button', selectable(true), {
          label: '文字選択を可能にする'
        }, 40], ["btn_Unselectable", ' ', 'button', selectable(false), {
          label: '不可にする'
        }, 20], ["btn_Closedialogs", ' ', 'button', closeDialogs, {
          label: 'ダイアログを全て閉じる'
        }, 40]],
      // data converting
      "データ一括操作": [["convtarg", "対象テーブル", "select", $.extend({
        ターゲットデータ: 0
      }, AS.BookType.Master), {}, 50], ECDB.SPACE(50),
        ["convsel", "セレクタ", "script", "", {
          height: 60,
          'default': '{}'
        }, 100], ["convfn", "コンバート", "script", "", {
          height: 166,
          'default': "function(i, obj){\n}"
        }, 100], ECDB.SPACE(20),
        ["btn_convert", "", "button", Fn.execConvData, {
          label: '変換'
        }, 30], ["btn_revert", "", "button", Fn.execRevData, {
          label: '戻し'
        }, 30], ECDB.SPACE(20)],

      // calculator
      "計算機": [
        [
          "formula",
          "計算式(カーソルオーバーで関数の利用例表示)",
          "string",
          "",
          {
            explain: '四則演算: +,-,*,/\n' + '切捨: Math.floor(v)\n'
              + '切上: Math.ceil(v)\n' + 'べき乗: Math.pow(e, p)\n'
              + '商: parseInt(v/b)\n' + '余り: %'
          }, 50], ["fresult", "結果", "string", "", {
          align: 'right'
        }, 30], ["fbspl", " ", 'button', function(b_CP) {
          var now = b_CP.Input('fresult').val().replace(/,/g, '');
          b_CP.Input('fresult').val(Fn.split3(now, ','));
        }, {
          label: ',',
          css: {
            fontSize: 12,
            lineHeight: '12px'
          }
        }, 10], ["fbmem", " ", 'button', function(b_CP) {
          var now = b_CP.Input('fmemo').val();
          var add = b_CP.Input('fresult').val();
          b_CP.Value('fmemo', [now, add].join(' '));
        }, {
          label: 'メモ'
        }, 10], ["fmemo", '', 'text', "", {
          height: 60
        }, 100]]
    }];

  // style
  Book.style = {
    ty: 3,
    round: 0,
    titleSize: '90%'
  };

  // param
  $.extend(Book, {
    formButton: 'none'
  });

  // event function
  $.extend(Book, {
    beforeShowForm: beforeShowForm,
    onChangeForm: onChangeForm
  });

  // assign
  $.extend(Bs, {
    CP: Book
  });

  return;

  function beforeShowForm() {

    var b_CP = this;
    b_CP.TabHead('入力フォーム操作').click(function() {
      setTimeout(function() {
        var targ = b_CP.Value('sel_target');
        updateCounter.call(b_CP, targ);
        reflectToButtons.call(b_CP, targ);
      }, 100);
    });

    b_CP.TabHead('テーブル操作').click(function() {
      var targ = b_CP.Value('sel_target');
      reflectToButtons.call(b_CP, targ);
    });

    b_CP.Input('sel_target').blur(function() {
      setTimeout(function() {
        changeSelectColor.call(b_CP, b_CP.Value('sel_target'));
      }, 100);
    });

    b_CP.Input('formula').keyup(function() {
      try {
        var formula = b_CP.Input('formula').val();
        var fresult = eval('(function(){ return ' + formula + '})')();
        b_CP.Input('fresult').val(fresult);
      } catch(e) {
        b_CP.Input('fresult').val('NaN');
      }
    });

    b_CP.Input('fry').add(b_CP.Input('toy')).change(function() {
      b_CP.TabHead('テーブル操作').click();
    });

    b_CP.Input('fbspl').css({
      padding: 0
    });

    b_CP.Input('btn_tableSort').ButtonColor('blue');
    b_CP.Input('btn_NEW').ButtonColor('green');
    b_CP.Input('btn_EDIT').ButtonColor('orange');
    b_CP.Input('btn_SAVE').ButtonColor('blue');
    b_CP.Input('btn_RESAVE').ButtonColor('blue');
    b_CP.Input('btn_QUIT').ButtonColor('red');
    b_CP.Input('btn_showJournal').ButtonColor('olive');
    b_CP.Input('btn_Closedialogs').ButtonColor('darkred');

    control.call(b_CP, ['IMPORT', 'EXPORT'], true);

  }

  function onChangeForm($dom, v1, v0) {

    var b_CP = this;

    if($dom.jquery) {
      if($dom.is(b_CP.Input('sel_target'))) {
        changeSelectColor.call(b_CP, v1);
        updateCounter.call(b_CP, v1), reflectToButtons.call(b_CP, v1);
        AS.Bo[v1].Editing === true && focusForm(v1);
      }
    }

  }

  function changeSelectColor(t) {
    var b_CP = this;
    changeInputColor(AS.Bo[t], b_CP, 'sel_target');
  }

  function formFocusMode() {
    return AS.vlays.body(4).css('display') == 'none';
  }

  function dialogForNewForm(b_CP) {

    var b_SD = AS.Bo.SD, d_def = b_SD.Key()
      && parseInt(new Date([b_SD.Value('year'), b_SD.Value('month'),
        b_SD.Value('day')].join('/')) / 1000) || parseInt(Date.now() / 1000);

    var book = Synquery.TOP.BOOK({
      title: '伝票日付の選択',
      structure: [["date", "", "date", "", {}, 100], ECDB.SPACE(10),
        ["btn_open", ' ', 'button', function() {

          var date = new Date(book.Value('date') * 1000);
          focusForm('SD').NewForm();

          b_SD.Value('year', date.getFullYear());
          b_SD.Value('month', date.getMonth() + 1);
          b_SD.Value('day', date.getDate());
          b_CP.Input('btn_showJournal').click(), close();

        }, {
          label: '伝票を開く'
        }, 60], ["btn_close", ' ', 'button', close, {
          label: '閉じる'
        }, 20], ECDB.SPACE(10)],
      style: {
        color: b_SD.style.color,
        formWidth: 280,
        noSearch: true,
        noClose: true
      },
      formButton: false
    });

    book.ShowForm().Value('date', d_def).ChangeFormMode(true);
    book.Input('date').datepicker('option', {
      changeYear: true
    });

    function close() {
      book.HideForm(), book.Form().remove();
    }

  }

  function changeInputColor(b_SRC, b_TARG, targs) {
    var p = (AppSpace.Bo.CP instanceof ECBOOK ? b_SRC.param: b_SRC) || '';
    var bc = p.background, tc = p.titleColor;
    [].concat(targs).forEach(function(id) {
      b_TARG.Input(id).css({
        backgroundColor: bc,
        borderColor: tc,
        color: tc
      });
    });
  }

  function createDiffJSON(bef, aft, decorate, diff) {

    diff = diff || {};
    decorate = $.isFunction(decorate) ? decorate: function() {
      return Array.prototype.slice.call(arguments).slice(1);
    };

    bef = $.extend(true, {}, bef);
    aft = $.extend(true, {}, aft);

    $.each(bef || {}, function(k, v) {
      !equals(v, aft[k]) && (function() {
        if($.isPlainObject(v) || $.isArray(v))
          return diff[k] = createDiffJSON(v, aft[k], decorate, {});
        diff[k] = decorate(k, bef[k], aft[k]); // return pattern KEY:[BEFORE, AFTER]
      })(), delete bef[k], delete aft[k];
    });

    $.each(aft || {}, function(k, v) {
      !equals(null, aft[k]) && (diff[k] = decorate(k, null, aft[k]));
    });

    return diff;

    function equals(a, b) {
      if(!a && !b)
        return true;
      if(!a && b || a && !b)
        return false;
      return JSON.stringify(a) == JSON.stringify(b);
    }

  }

  function updateCounter(t) {
    var b_CP = this, b_TARG = AS.Bo[t], seq = b_TARG.seq || [];
    var p = seq.indexOf(b_TARG.Key()) + 1;
    b_CP.Value('lbl_FPOS', p + ' / ' + seq.length);
  }

  function reflectToButtons(t) {

    var b_CP = AS.Bo.CP, b_TARG = AS.Bo[t], btns = {
      'VIEW': ['PREV', 'NEXT', 'NEW', 'EDIT', 'FORK', 'IMPORT', 'EXPORT'],
      'EDIT': ['SAVE', 'RESAVE', 'RESET', 'QUIT']
    };

    if(b_TARG.Editing === true) {
      control.call(b_CP, btns.VIEW, true);
      control.call(b_CP, btns.EDIT, false);
      control.call(b_CP, b_TARG.Key() ? 'SAVE': 'RESAVE', true);
    } else {
      control.call(b_CP, btns.VIEW, false);
      control.call(b_CP, btns.EDIT, true);
      var seq = b_TARG.seq;

      if(!$.isArray(seq) || seq.indexOf(b_TARG.Key()) === 0)
        control.call(b_CP, 'PREV', true);
      if(!$.isArray(seq) || seq.indexOf(b_TARG.Key()) === seq.length - 1)
        control.call(b_CP, 'NEXT', true);
      if(!$.isArray(seq) || seq.length == 0)
        control.call(b_CP, ['EXPORT'], true);
      if(!b_TARG.Key())
        control.call(b_CP, ['EDIT', 'FORK'], true);
    }

    // hide journal mode
    var hideCondition = t == 'AD' || !b_TARG.Editing && !b_TARG.Key();
    control.call(b_CP, ['貸借方式表示', '仕訳バランス'], hideCondition);

  }

  function selectable(enabled) {
    return function() {
      var $t = $();
      ['constant_', 'label_', 'divide_0', 'divide_1', 'divide_2']
          .forEach(function(cls) {
            $t = $t.add($('._' + cls));
          });
      $t.css('-webkit-user-select', enabled ? 'auto': 'none');
    };
  }

  function closeDialogs(b_CP) {

    var editing = 0, close = 0;
    Object.keys(AS.Bt.Master).concat(Object.keys(AS.Bt.Control)).forEach(
      forEachBook);

    editing > 0 ? (function() {
      b_CP.alert('編集中の ' + editing + 'フォームは' + 'マニュアル操作してください。');
    })(): (function() {
      close == 0 && b_CP.alert('閉じたダイアログは' + 'ありません。');
    })();

    function forEachBook(k) {

      var b = AS.Bo[k];
      if(k == b_CP.name)
        return;

      var form = b.Form();
      if(form && form.is(':visible'))
        ['RV', 'LOG'].indexOf(k) == -1 && b.Editing ? editing++: (function() {
          b.Form().dialog('widget').hide(), close++;
        })();

      var table = b.Table();
      if(table && table.is(':visible'))
        true && (function() {
          b.HideTable(), close++;
        })();

      var search = $('#SEARCH_' + k);
      if(search && search.is(':visible'))
        true && (function() {
          search.dialog('widget').find('.SB_CANCEL').click(), close++;
        })();

      var aearch = $('._ADVANCED_' + k);
      if(aearch && aearch.is(':visible'))
        true && (function() {
          aearch.dialog('widget').find('.SB_CANCEL').click(), close++;
        })();

    }

  }

  function control(arr, flag) {
    var b_CP = this;
    [].concat(arr).forEach(function(btn) {
      var $btn = b_CP.Button(/^[A-Z]/.test(btn) ? '_' + btn + '_': btn);
      $btn[(flag ? 'add': 'remove') + 'Class'](ECDB.CL.LB);
      b_CP.DisableControl($btn, flag);
    });
  }

}).call(AppSpace);
