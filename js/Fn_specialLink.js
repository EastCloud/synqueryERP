/***/
(function() {
  var AS = this, Fn = AS.Fn;

  // assign
  $.extend(Fn, {
    specialLink: specialLink,
    getTerm: getTerm,
    setCompanyStatus: setCompanyStatus
  });
  return;

  function specialLink($targ) {

    var tag = '', cnt = 2;
    while(cnt--)
      tag += '<tr><td></td></tr>';

    var tbl = $('<table/>').append($(tag)).css({
      position: 'absolute',
      display: 'inline',
      lineHeight: '14px',
      marginTop: '-4px',
      fontSize: '50%'
    });

    var sepal = $('<span/>').text('|').css({
      padding: '0 4px'
    });

    var linka = function($obj) {
      return $obj.attr({
        href: $obj.attr('href') + (location.search || ''),
        target: '_blank'
      }).css({
        'font-size': '160%',
        'white-space': 'nowrap'
      });
    };

    var Domains = {
      Normal: '/',
      Docs: 'http://www.east-cloud.co.jp/'
    };

    var $ac = $('<a/>').attr({
      href: Domains.Normal + 'synquery/U0lIhvaW'
    }).text('教えてERP!').css({
      padding: '2px 4px',
      background: '#0a0',
      color: '#fff'
    });
    var $ad = $('<a/>').attr({
      href: Domains.Docs + 'docs/synqueryERP/'
    }).text('仕様説明書').css({
      padding: '2px 4px',
      background: '#00a',
      color: '#eef'
    });

    var tds = tbl.find('td');
    tds.eq(0).append(linka($ac));
    tds.eq(1).append(linka($ad));
    $targ.append(tbl);

    $('#_HEAD_').click(function() {
      AS.Bo.CP.Input('btn_Selectable').click();
    });

  }

  function getTerm(cmp, d) {
    var founded = new Date(cmp.founded * 1000);
    var pone0 = founded.getMonth() + 1 <= cmp.end_month ? 1: 0;
    var dnow = d instanceof Date ? d: new Date(d || Date.now());
    var pone1 = dnow.getMonth() + 1 > cmp.end_month ? 1: 0;
    return (dnow.getYear() - founded.getYear()) + pone0 + pone1;
  }

  function setCompanyStatus($wrap) {

    $wrap.empty();
    var $ctdiv = $('<div/>').appendTo($wrap).css({
      textAlign: 'center'
    });
    var $csdiv = $('<div/>').appendTo($wrap).css({
      textAlign: 'center'
    });
    var $cbdiv = $('<div/>').appendTo($wrap).css({
      textAlign: 'center',
      margin: '6px 0 4px'
    });

    var b_CMP = AS.Bo.CMP;
    b_CMP.Get(Synquery.Company, function(obj) {

      var imgkey = (obj.images && obj.images[0] || '')._id;
      imgkey ? b_CMP.getImage(imgkey, setWithImage): setWithImage();

      function setWithImage() {

        $ctdiv.append((imgkey ? b_CMP.Image(imgkey): $('<img/>')).css({
          height: 42,
          margin: '12px 12px 0 0'
        }));

        var c_name = obj.s_name || obj.name || ' ';
        var fwidth = $ctdiv.width() - $ctdiv.find('img').width() - 24 - 8;
        var f_size = Math.min(parseInt(fwidth / c_name.length), 28);

        $ctdiv.append($('<span>' + c_name + '</span>').css({
          lineHeight: '44px',
          fontSize: f_size + 'px',
          padding: '4px 0 0 0',
          textAlign: 'center',
          verticalAlign: 'bottom',
          whiteSpace: 'nowrap'
        }));

        var term = getTerm(obj);
        $csdiv.append($('<span>第 ' + term + ' 期</span>').css({
          paddingLeft: 18
        }), $('<span>決算月: ' + obj.end_month + ' 月</span>').css({
          paddingLeft: 12
        }));

        $cbdiv.append($('<button/>').click(function($e) {
          $e.preventDefault();
          if(!Synquery.CompanyAppAdmin)
            return b_CMP.alert('権限がありません。');
          b_CMP.LoadForm(Synquery.Company, function() {
            b_CMP.ChangeFormMode(true);
          });
        }).css({
          marginTop: 4,
          cursor: Synquery.CompanyAppAdmin ? 'pointer': 'auto'
        }).text('情報編集').prop('disabled', !Synquery.CompanyAppAdmin));

        $cbdiv.append($('<button/>').click(function($e) {
          $e.preventDefault(), localStorage.removeItem(AS.skeys.cmpkey);
          location.reload();
        }).css({
          marginTop: 4,
          cursor: 'pointer'
        }).text('切り替え'));

        Fn.specialLink($cbdiv);

      }

    });
  }

}).call(AppSpace);
