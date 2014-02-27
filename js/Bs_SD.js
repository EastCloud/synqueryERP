/***/
(function() {
  var AS = this;
  var Bs = AS.BookSrc, Fn = AS.Fn;
  var Tabs = ['勘定', '国税関係書類／各種記録', '設定／備考'];

  var Book = {
    title: "随時入力"
  };

  Book.structure = [
    ["year", "年", "integer", "", {
      'default': Fn.nowY()
    }, 20],
    ["month", "月", "integer", "", {
      min: 1,
      max: 12,
      'default': Fn.nowM()
    }, 10],
    ["day", "日", "integer", "", {
      min: 1,
      max: 31,
      'default': Fn.nowD()
    }, 10],
    ECDB.SPACE(10),
    ["journal_type", "データ種別", "select", AS.j_types, {}, 20],
    ["_id", "データID", "string", "", "pkey", 15],
    ECDB.SPACE(15),
    ["sort", "", "integer", "", {
      hidden: true,
      'default': 0.5
    }, 0],
    {

      "勘定": Fn.BSPL({
        image: true
      }),
      "国税関係書類／各種記録": [
        [
          "contracts[]",
          "書類",
          [["cname", "名称", "string", "", {}, 46], ["ctype", "種類", "select", {
            "": "",
            "契約(機密保持/NDA)": "CON_N",
            "契約(不動産)": "CON_R",
            "契約(その他)": "CON_O",
            "(受) 見積": "EST_R",
            "(送) 受注": "AOO",
            "(送) 納品/請求": "INV_R",
            "(受) 領収": "REC_R",
            "[送] 見積": "EST",
            "[送] 発注": "POI_R",
            "[受] 請求": "INV",
            "源泉徴収票": "TWH",
            "法定調書": "DOR"
          }, {}, 17], ["climit", "有効期限", "datim", "", {}, 17],
            ["cremark", "備考", "text", "", {}, 5],
            ["cimgs", "画像", "file", "", {}, 5]], 150, {}, 10],
        ["recordings[]", "", [["rname", "名称", "string", "", {
          autocomplete: 'name'
        }, 85], ["rimgs", "画像", "file", "", {}, 5]], 150, {}, 10]],

      '設定／備考': [['out_of_journal', '簿外', 'toggle', [0, 1], {}, 20],
        ['out_of_journal_attr', '簿外属性', 'refer', 'CAP', '', 20],
        ['out_of_journal_attr.name', '', 'refval', '', '', 60],
        ['remark', '備考', 'text', "", {}, 100],
        ['sub_remarks', '', 'text', "", 'hidden', 0]]

    }];

  // list
  Book.list = 'year month day journal_type' + ' ac_items[ac_type].name'
    + ' ad_items[ad_type].name' + ' al_items[al_type].name'
    + ' ai_items[ai_type].name';

  // event function
  $.extend(Book, {
    beforeShowForm: beforeShowForm,
    beforeSaveForm: beforeSaveForm,
    onChangeMode: onChangeMode,
    onSaveForm: onSaveForm
  });

  // assign
  $.extend(Bs, {
    SD: Book
  });

  return;

  function beforeShowForm() {
    var b_SD = this;
    Tabs.forEach(function(tabn) {
      b_SD.TabHead(tabn).on('click mouseout', function() {
        setTimeout(setWhetherDataExist);
      });
    });
    Fn.bindSimpleMinMax(b_SD.Input('month'), 'change', 1, 12);
    Fn.bindSimpleMinMax(b_SD.Input('day'), 'change', 1, 31);
  }

  function onChangeMode() {
    var b_SD = this;
    setWhetherDataExist();
  }

  function setWhetherDataExist() {
    var b_SD = AS.Bo.SD;
    Tabs.forEach(function(tabn) {
      b_SD.TabHead(tabn).css('opacity', 1);
    });
    [hasAccJurData, hasPapersData, hasRemarkData].forEach(function(jfn, i) {
      !jfn(b_SD) && b_SD.TabHead(Tabs[i]).css('opacity', 0.4);
    });
  }

  function beforeSaveForm() {
    var b_SD = this;
    if(hasAccJurData(b_SD) == false) {
      b_SD.alert('勘定科目が設定されていないレコードが存在します。');
      return false;
    }
  }

  function hasAccJurData(b_SD) {
    for( var a_type in AS.a_types) {
      var ivals = b_SD.Value(a_type + '_items');
      var tvals = ivals && ivals.type;
      if(!$.isArray(tvals))
        continue; // no data
      for( var j = 0; j < tvals.length; j++)
        if(!/^\w{8}/.test(tvals[j]))
          return false;
    }
    return true;
  }

  function hasPapersData(b_SD) {
    var i_types = ['contracts', 'recordings'];
    for( var i = 0; i < i_types.length; i++) {
      var itype = i_types[i];
      var ivals = b_SD.Value(itype);
      var nvals = ivals && ivals[itype.charAt(0) + 'name'];
      if(!$.isArray(nvals))
        continue; // no data
      if(!/^\s*$/.test(nvals.join(" ")))
        return true;
    }
    return false;
  }

  function hasRemarkData(b_SD) {
    var i_types = ['out_of_journal', 'remark'];
    for( var i = 0; i < i_types.length; i++) {
      var itype = i_types[i];
      var ivals = b_SD.Value(itype);
      if(ivals)
        return true;
    }
    return false;
  }

  function onSaveForm(d) {
    var b_SD = this;
    d.sort = [0.5, 0.1, 0.9, 0.2, 0.8, 0.01, 0.99, 0.999][b_SD
        .Value('journal_type')];
  }

}).call(AppSpace);
