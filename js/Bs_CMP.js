/***/
(function($) {
  var AS = this;
  var Bs = AS.BookSrc, Fn = AS.Fn;

  var Book = {
    title: localStorage.getItem(AS.skeys.cmpkey) ? "情報の設定": "企業選択"
  };

  var Tabs = {};
  var TabC = Tabs['企業設定'] = [];
  var TabS = Tabs['システム設定'] = [];
  Book.structure = [['', '', 'html', '<div/>', {}, 100], Tabs];

  TabC.push(["_id", "企業ID", "string", "", {
    pkey: true,
    hidden: true,
    tableWidth: 120
  }, 0], ["name", "正式名称", "string", "", {
    skey: true,
    fill: true,
    placeholder: '必須入力項目',
    tableWidth: 360
  }, 80], ["s_name", "略記", "string", "", "", 20], {
    "BLK0:20": [["image", "", "html", "<div/>", {
      align: 'center',
      css: {
        paddingLeft: 4,
        height: 66
      }
    }, 100], ["images", "", "image", "", {}, 100]],
    "BLK1:80": [ECDB.SPACE(100), ["furi", "フリガナ", "string", "", "", [20, 80]],
      ["nameg", "英表記", "string", "", "", [20, 80]],
      ["pcode", "所在地", "zip", "", "", [20, 20]],
      ["address", "", "address", "", "", [0, 60]]]
  }, ["founded", "設立日", "date", "", {
    tableWidth: 120,
    fill: true
  }, 20], ["end_month", "決算月", "integer", "", {
    tableWidth: 96,
    'default': 3
  }, 10], ["end_term", "決算周期", "integer", "", {
    tableWidth: 96,
    'default': 12
  }, 10], ["tax_type", "消費税記帳方式", "select", {
    税抜方式: 1,
    税込方式: 2
  }, {}, 30], ["tax_payt", "事業者区分", "select", {
    課税事業者: 1,
    免税事業者: 2
  }, {
    tableWidth: 240
  }, 30], {

    "基本情報": [["tax_agency", "管轄税務署", "string", "", {}, [12, 30]],
      ["tax_agency_number", "", "string", "", {
        placeholder: "署番号"
      }, [0, 24]], ["tax_agency_order", "", "string", "", {
        placeholder: "整理番号"
      }, [0, 34]]],

    '資本構成': [["capital[]", "", [['inv_name', "", 'string', '', {
      placeholder: '引受人'
    }, 24], ['inv_addr', "", 'string', '', {
      placeholder: '住所'
    }, 52], ['inv_value', "", 'string', '', {
      placeholder: '株数'
    }, 12], ['inv_manage', "", 'string', '', {
      placeholder: '管理者'
    }, 24], ['inv_contact', "", 'string', '', {
      placeholder: '連絡先'
    }, 52], ['inv_percent', "", 'string', '', {
      placeholder: '保有率'
    }, 12], ['inv_remark', "", 'text', '', {
      placeholder: '備考'
    }, 88]], 120, {}, 12]],

    "期日設定": [[
      "end_days[]",
      "",
      [["type", "種別", "select", {
        "": 0,
        給与締日: 1,
        給与支払: 2,
        支払期日: 3,
        経費締日: 4
      }, {}, 24], ["months", "猶予 月", "integer", "", {}, 10],
        ["days", "日", "integer", "", {}, 10],
        ["day", "締日", "integer", "", {}, 10],
        ["remark", "備考", "text", "", {}, 34]], 120, {}, 12]],

    "記帳規則": [["enter_rules[]", "", [["rule", "ルール", "text", "", {}, 88]], 120,
      {}, 12]],

    "特別処理事項": [["special_reports[]", "",
      [["report_year", "年度", "integer", "", {
        'default': Fn.thisYear()
      }, 20], ["report_contents", "事項", "text", "", {}, 68]], 120, {}, 12]],

    "特記記載事項": [["special_mentions[]", "",
      [["report_year", "年度", "integer", "", {
        'default': Fn.thisYear()
      }, 20], ["report_contents", "事項", "text", "", {}, 68]], 120, {}, 12]]

  });

  var ManTabs = {};
  TabS.push(ManTabs);

  var TabM = ManTabs['ユーザー'] = [];
  var TabR = ManTabs['レシピ'] = [];
  var TabA = ManTabs['アドオン'] = [];
  TabM.push([
    "permission[]",
    'ユーザー管理',
    [['target', 'IDまたはメールアドレス', 'string', "", {}, 46],
      ['level', '#', 'integer', "", {
        min: 0,
        max: 99
      }, 10], ['auth_a', 'APP', 'select', {
        'なし': 0,
        'あり': 1
      }, {}, 10], ['auth_s', 'SYS', 'select', {
        'なし': 0,
        'あり': 1
      }, {}, 10]], 120, {}, 24]);

  Synquery.CompanySysAdmin && (function() {
    TabM.push(['recipe_code', 'レシピコード', 'string', '', {
      placeholder: '適用するレシピコード'
    }, [20, 30]], ['addon_code', 'アドオンコード', 'string', '', {
      placeholder: '適用するアドオンコード'
    }, [20, 30]], ['btn_show_url', ' ', 'button', showInviteURL, {
      label: '招待用URL, QRコードを確認'
    }, 50], ['btn_invitation', ' ', 'button', function(b_CMP) {
      b_CMP.alert('実装中！暫くお待ちください。');
    }, {
      label: 'このシステムに招待する'
    }, 50], ['toggle_production', 'このシステムを再販する', 'toggle', [0, 1], {
      align: 'center',
      hidden: true
    }, 100]);
  })();

  // System Tab >>
  var dev_url = 'https://www.synquery.com/synquery/TK6lBkEf';
  var dev_anc = '<div><a href="' + dev_url + '" target="_blank">';
  dev_anc += 'RSDの開発・管理サイトを開く' + '</a></div>';

  Synquery.CompanySysAdmin
    && (function() {

      TabR.push(['recipe', 'システムレシピ', 'script', '', {
        height: 256
      }, 100]);
      TabR.push([
        '',
        '',
        'html',
        '<span>' + '※このレシピコードは " <b> ' + Synquery.Company + ' </b>" です。'
          + '</sapn>', {
          css: {
            '-webkit-user-select': 'auto'
          }
        }, 100]);
      TabR.push(['btn_default_recipe', ' ', 'button', showDefault, {
        label: 'デフォルトのレシピを確認'
      }, 100]);
      TabR.push(['rsdid_r', '', 'string', '', {
        placeholder: '参照したい RSD の ID'
      }, 30], ['btn_getrsd_r', '', 'button', function(b_CMP) {
        getAndOpenRSD(b_CMP, b_CMP.Value('rsdid_r'));
      }, {
        label: 'RSD 情報の取得'
      }, 20], ['jumptodev_r', ' ', 'html', dev_anc, {
        align: 'center',
        css: {
          textAlign: 'center'
        }
      }, 50], ["r_message", "", "html",
        '<div style="height:12px;text-align:center;"/>', {}, 100]);

      TabA.push(['recipe_add', 'アドオンレシピ', 'script', '', {
        height: 256
      }, 100]);
      TabA.push([
        '',
        '',
        'html',
        '<span>' + '※このアドオンコードは "<b> ' + Synquery.Company + ' </b>" です。'
          + '</sapn>', {
          css: {
            '-webkit-user-select': 'auto'
          }
        }, 100]);
      TabA.push(['btn_addon_exp', ' ', 'button', showAddonExp, {
        label: '記述例を見てみる'
      }, 100]);
      TabA.push(['rsdid_a', '', 'string', '', {
        placeholder: '参照したい RSD の ID'
      }, 30], ['btn_getrsd_a', '', 'button', function(b_CMP) {
        getAndOpenRSD(b_CMP, b_CMP.Value('rsdid_a'));
      }, {
        label: 'RSD 情報の取得'
      }, 20], ['jumptodev_a', ' ', 'html', dev_anc, {
        align: 'center',
        css: {
          textAlign: 'center'
        }
      }, 50], ["a_message", "", "html",
        '<div style="height:12px;text-align:center;"/>', {}, 100]);

    })();

  Book.style = {
    noSearch: true,
    tableContext: false,
    formWidth: 600
  };

  // special function
  $.extend(Book, {
    formButton: '_RESAVE_ _QUIT_',
    list: ['_id', 'founded', 'name', 'end_month', 'end_term', 'tax_type'],
    beforeShowForm: beforeShowForm,
    onChangeForm: onChangeForm,
    onChangeMode: onChangeMode,
    beforeSaveForm: beforeSaveForm
  });

  // assign
  $.extend(Bs, {
    CMP: Book
  });

  return;

  function beforeShowForm() {

    var b_CMP = this, $f_CMP = b_CMP.Form();
    var $th_CMP = $f_CMP.find('._tabhead_');
    var $tb_CMP = $f_CMP.find('._tabbody_');

    // Hide MatrixHead of Capital
    b_CMP.MatrixHead('capital').hide();
    $tb_CMP.eq(0).find('._tabbody_').css('height', 224);
    $tb_CMP.eq(1).find('._tabbody_').css('height', 420);

    // Hide Tabhead When Creating
    AS.cmode && $th_CMP.eq(0).parent().hide();

    // Set Original Tab Action
    $th_CMP.each(function() {
      var $th = $(this), me = '._tabbody_' + $th.text();
      $th.click(function() {
        var $tb_visible = $tb_CMP.filter(':visible');
        ($.inArray(me, $tb_visible) == -1 ? function() {
          $(me).siblings().hide(), setTimeout(function() {
            $tb_CMP.filter(me).show().find('._tabhead_:first').click();
          }, 4);
        }: function() {
          setTimeout(function() {
            $tb_CMP.filter(me).find('._tabhead_:first').click();
          }, 4);
        })();
      });
    });

    // Show First Tab
    setTimeout(function() {
      $th_CMP.get(0).click();
      var $tb_capital = $tb_CMP.filter('._tabbody_資本構成');
      $tb_capital.find('._created_line_:first').css({
        borderTop: '1px solid rgb(102,102,102)'
      });
      $tb_capital.find('._matrix_').css({
        height: 192
      });
    }, 4);

    if(!Synquery.CompanySysAdmin)
      return;

    // binding
    Fn.bindScriptKeyup(b_CMP.Input('recipe'), b_CMP.Input('r_message'));
    Fn.bindScriptKeyup(b_CMP.Input('recipe_add'), b_CMP.Input('a_message'));

  }

  function onChangeForm($dom, v1, v0) {

    var b_CMP = this, isjq = $dom.jquery != null, $targ = null;

    if(!v1)
      return;

    var image_d = null, $img = b_CMP.Input('image');
    if($img.text())
      return;

    $targ = b_CMP.Input('images');
    if($dom === false)
      image_d = v1.images[0];
    else if(isjq && $dom.is($targ))
      image_d = v1[0];

    if(!image_d && b_CMP.Editing) // other item change
      return;

    var _id = image_d && image_d._id;
    $img.empty() && _id && $img.text('Loading...')
      && b_CMP.getImage(_id, function() {
        $img.text(''), $img.append(b_CMP.Image(_id).css('height', 66));
      });

  }

  function onChangeMode(n_mode, o_mode) {

    // work on "normal mode" only.
    var b_CMP = this;
    Synquery.Company && o_mode === true && (function() {
      b_CMP.HideForm();
      Fn.setCompanyStatus($('.comp_area.wrapper'));
    })();

  }

  function beforeSaveForm(obj) {
    var b_CMP = this, mes = '';
    !mes && obj.recipe && (function() {

      mes = 'レシピが変更・保存されようとしています。\n';
      mes += 'この保存はシステムに影響を与える可能性がありますが、\n';
      mes += '実行してもよろしいですか？'; // TODO DIFF

      b_CMP.confirm(mes, function() {
        b_CMP.Put($.extend(true, {}, b_CMP.hash[b_CMP.Key()], obj), function() {
          b_CMP.onChangeMode(false, true);
        });
      }, function() {
        return;
      });

    })();
    return mes;
  }

  function showDefault(b_CMP) {

    // work on "normal mode" only. with Synquery.CompanySysAdmin
    Synquery.Company && b_CMP.obj.recipe && (function($t) {
      getAndOpenRSD(b_CMP, '0CuEgsGb', {
        title: 'デフォルトレシピ',
        show: 'JavaScript'
      });
    })(b_CMP.Input('recipe'));

  }

  function showInviteURL() {

    var $SDialog = new $S.elem.dialog({
      css: {
        width: 400,
        height: 'auto',
        marginTop: $(window).height() / 2 - 120,
        marginLeft: $(window).width() / 2 - 200,
        padding: '18px 8px 8px 8px',
        textAlign: 'center'
      }
    });

    var $SDButton = new $S.elem.button();
    var $SDSNS = new $S.elem.share();

    var url = 'https://www.synquery.com/synquery/gDoFfkYA';
    url += '?recipe=' + Synquery.Company + '&addon=' + Synquery.Company;

    var $cont = $('<div class="invite_ways"/>');
    $cont.append('<div>[URL]</div>');
    $cont.append('<div><a href="' + url + '" target="_blank">' + url
      + '</a></div>', '<br/>');

    $cont.append('<div>[QRコード]</div>');
    $cont.append($('<div/>').qrcode({
      text: url,
      width: 60,
      height: 60,
      correctLevel: 1
    }), '<br/>');

    var s = '私の SynqueryERP を使ってみませんか。', sns_sty = {
      marginLeft: 4
    };

    $cont.append('<div>[SNS フィード]</div>');
    $cont.append($('<div/>').append(
      $SDSNS.generateTwitterShareIcon(url, 60, s).css(sns_sty),
      $SDSNS.generateFacebookShareIcon(url, 60, s).css(sns_sty),
      $SDSNS.generateGoogleShareIcon(url, 60, s).css(sns_sty)), '<br/>');

    $SDButton.setup('閉じる', function() {
      $SDialog.destroy();
    }).appendTo($('<div/>').appendTo($cont));

    $SDialog.setup($cont).show('body', 'blind');

  }

  function showAddonExp() {
    window.open('http://www.east-cloud.co.jp/docs/synqueryERP/', '_blank');
  }

  function getAndOpenRSD(b_CMP, key, opts) {

    opts = $.extend({
      title: '',
      show: ['JavaScript', 'HTML', 'StyleSheet']
    }, opts);

    var candidate = {
      'JavaScript': [['js', '', 'script', '', {}, 100]],
      'HTML': [['html', '', 'script', '', {}, 100]],
      'StyleSheet': [['css', '', 'script', '', {}, 100]]
    };

    var struct = {};
    [].concat(opts.show).forEach(function(k) {
      candidate[k] && (struct[k] = candidate[k]);
    });

    if(typeof key != 'string' || key.length != 8)
      return b_CMP.alert('RSD ID は8桁の文字列を指定して下さい。');

    ECDB.GetRSD(key, function(rsd) {

      if(!rsd || rsd['public'] === 0 && !rsd.UID == Synquery.UserId
        || rsd['public'] === 2) // TODO NW_wrapper
        return b_CMP.alert('RSDが見つからないか、閲覧出来ませんでした。');

      Synquery.TOP.BOOK({
        title: opts.title ? opts.title + ' (' + rsd.title + ')': rsd.title,
        structure: [struct],
        style: {
          noSearch: true
        },
        formButton: '_CLOSE_',
        beforeShowForm: function() {

          var b = this;

          struct.JavaScript && rsd.src ? (function() {
            b.Value('js', rsd.src);
          })(): (function() {
            b.Form().find('._tabhead_JavaScript').hide();
          })();

          struct.HTML && rsd.html ? (function() {
            b.Value('html', rsd.html);
          })(): (function() {
            b.Form().find('._tabhead_HTML').hide();
          })();

          struct.StyleSheet && rsd.css ? (function() {
            b.Value('css', rsd.css);
          })(): (function() {
            b.Form().find('._tabhead_StyleSheet').hide();
          })();

        }
      }).ShowForm();

    });
  }

}).call(AppSpace, $S.$);
