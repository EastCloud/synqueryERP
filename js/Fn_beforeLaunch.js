(function($) {
  var AS = this;
  var Fn = AS.Fn, Bt = AppSpace.BookType;

  // assign
  $.extend(Fn, {
    beforeLaunch: beforeLaunch,
    beforeLaunchSlight: beforeLaunchSlight,
    beforeLaunchNewface: beforeLaunchNewface
  });
  return;

  function beforeLaunch() {
    offUnload();

    var fomemo_key = AS.skeys.fomemo, fomemo = null;
    var ratios_key = AS.skeys.ratios, ratios = null;
    var viewin_key = AS.skeys.viewin, viewin = null;

    try {
      fomemo = localStorage.getItem(fomemo_key) || '';
      ratios = JSON.parse(localStorage.getItem(ratios_key)) || {};
      viewin = JSON.parse(localStorage.getItem(viewin_key)) || {};
    } catch(e) {
      !fomemo && (fomemo = '');
      !ratios && (ratios = {});
      !viewin && (viewin = {});
    }

    $(window).on('beforeunload', function() {
      localStorage.setItem(fomemo_key, AS.Bo.CP.Input('fmemo').val());
    });

    var sys = this, divs = sys.Divide('_BODY_', {
      'left_block': ratios['left_block'] || '20%',
      'right_block': ratios['right_block'] || '79%'
    });

    var vdivs = sys.Divide(divs.divided(1), {
      'right_top_block': ratios['right_top_block'] || '50%',
      'right_bottom_block': ratios['right_bottom_block'] || '50%'
    }, {
      vertical: true
    });

    var thdivs = sys.Divide(vdivs.divided(0), {
      'rtop_left_block': '50%',
      'rtop_right_block': '50%'
    });

    var bhdivs = sys.Divide(vdivs.divided(1), {
      'rbottom_left_block': ratios['rbottom_left_block'] || '50%',
      'rbottom_right_block': ratios['rbottom_right_block'] || '50%'
    });

    $(window).on('beforeunload', function() {

      var r = {}, twin = function(targs, name0, name1, vert) {
        var fn = vert ? 'height': 'width';
        var w0 = targs.divided(0)[fn]();
        var w1 = targs.divided(1)[fn]();
        var wa = w0 + w1;
        r[name0] = w0 / wa * 100;
        r[name1] = w1 / wa * 100;
      };

      twin(divs, 'left_block', 'right_block');
      twin(vdivs, 'right_top_block', 'right_bottom_block', true);
      //      twin(thdivs, 'rtop_left_block', 'rtop_right_block');
      // not save. when 100%, 0% then layout is broken
      twin(bhdivs, 'rbottom_left_block', 'rbottom_right_block');

      $.each(r, function(k, v) {
        r[k] = parseInt(v * 10) / 10 + '%';
      });

      localStorage.setItem(ratios_key, JSON.stringify(r));

    });

    var flays = AS.flays = sys.Multiple('rtop_left_block', ['flayerHide',
      'flayerAD', 'flayerMD', 'flayerSD', 'flayerDR']);
    flays.display('flayerHide');

    var vlays = AS.vlays = sys.Multiple('rtop_right_block', ['vlayerHide', '',
      '', '', 'vlayerCR']);
    vlays.display('flayerHide');

    var tlays = AS.tlays = sys.Multiple('rbottom_left_block', ['tlayerHide',
      'tlayerAD', 'tlayerMD', 'tlayerSD']);
    tlays.display('tlayerHide');

    $(window).on('beforeunload', function() {

      var v = {};

      var $f_visible = flays.children(':not(:hidden)');
      var fid = ($f_visible.attr('id') || '').substr(-2);

      'DR' == fid && (fid = AS.Bo['VDR'].Value('j_ty'));
      fid = /^(AD|MD|SD)$/.test(fid) ? fid: '';

      var fkey = fid && AS.Bo[fid].Key();
      fid && (function() {
        v['f_visible'] = [fid, fkey];
      })();

      var $t_visible = tlays.children(':not(:hidden)');
      var tid = ($t_visible.attr('id') || '').substr(-2);
      tid = /^(AD|MD|SD)$/.test(tid) ? tid: '';

      var tseq = tid && AS.Bo[tid].seq || '';
      tid && (function() {
        v['t_visible'] = [tid, tseq];
      })();

      localStorage.setItem(viewin_key, JSON.stringify(v));

    });

    var $mlay0 = $('<div class="mcase"/>').appendTo(divs.divided(0));
    var $clay0 = $('<div class="ccase"/>').appendTo(divs.divided(0));

    var $mwrap = $('<div class="menu_area wrapper"/>').appendTo($mlay0);
    var $cwrap = $('<div class="comp_area wrapper"/>').appendTo($clay0);
    var dfds = new Array(1, 2, 3, 4).map(function() {
      return $.Deferred();
    });

    setTimeout(function() {

      var DFDS_FOR_TEST = [], PUSH_DFD = (function(webtest) {
        return function() {
          var dfd = $.Deferred();
          return webtest && DFDS_FOR_TEST.push(dfd), dfd;
        };
      })(/(\?|&)webtest/.test(location.search));

      // after setting AppSpace.Bo
      Fn.setCompanyStatus($cwrap);

      // >> set menu buttons as defined >>
      $.each(AS.mlist || {}, function(btype, arr) {

        // category bar
        appendDiv('menu_hed ' + btype, btype, $mwrap);
        var $wrap = appendDiv('menu_bod', '', $mwrap);

        arr.forEach(function(k) {

          var b = AS.Bo[k], t = b ? '[' + k + '] ' + b.title: '';
          var idx = [null, 'AD', 'MD', 'SD'].indexOf(k);

          // ADD MENU BAR OF THIS BOOK
          var $btn = appendDiv(['menu_btn', btype, k].join(' '), t, $wrap);
          b && $btn.click(function() {
            0 < idx && (function(flay) {
              var b_CP = AS.Bo.CP;
              b_CP.Value('sel_target', k), Fn.focusForm(k);
              b_CP.TabHead("入力フォーム操作").click();
              k == 'SD' && !AS.Bo.SD.Key() && b_CP.Input('btn_NEW').click();
            })(flays.body(idx)), b.ShowForm();
          });

        });

      });
      // << set menu buttons as defined <<

      // >> set for each book action >> 
      $.each(Bt, function(btype, books) {
        $.each(books, function(k) {

          var b = AS.Bo[k]; // setup finish signal
          var t = '[' + k + '] ' + b.title;
          var idx = [null, 'AD', 'MD', 'SD'].indexOf(k);
          var accepts = [Synquery.Company];

          if(k == 'CMP') {
            Fn.putCallbackWrap(b, '_id', accepts);
            return;
          }

          if(AS.Bt.Master[k] || AS.Bt.Data[k]) {
            Fn.putCallbackWrap(b, 'company_key', accepts);
          }

          if(AS.Bt.Control[k]) {
            accepts.push(undefined);
            Fn.putCallbackWrap(b, 'company_key', accepts);
          }

          (k == 'CP' ? function() {

            b.InlineForm(bhdivs.divided(1));

          }: AS.Bt.View[k] ? function() {
            (k == 'VDR' ? function() {

              var layer = flays.body(4);
              layer.siblings().hide(), layer.show();
              b.InlineForm(layer), layer.css({
                marginLeft: 3
              }).find('._inline_divide_').css({
                borderRightWidth: 0
              });
              b.Form().find('._input_row_:first').css({
                height: 49
              });

              var $mtx = b.Form().find('._matrix_').css({
                borderRight: '0 none'
              });
              $mtx.siblings().css({
                borderRight: '0 none'
              }), b.Form().css({
                padding: '5px 0 0 8px'
              }), layer.hide();

            }: function() { // k == 'VCR'

              var layer = vlays.body(4);
              layer.siblings().hide(), layer.show();
              b.InlineForm(layer), layer.css({
                marginLeft: -3
              }).find('._inline_divide_').css({
                borderLeftWidth: 0
              });

              var $mtx = b.Form().find('._matrix_').css({
                borderLeft: '0 none'
              });
              $mtx.siblings().css({
                borderLeft: '0 none'
              }), b.Form().css({
                padding: '5px 8px 0 0'
              });
              layer.hide(), dfds[0].resolve();

            })();
          }: function() {

            b.seq == null && (AS.Bt.Master[k] || /IMP|FNS|FPR/.test(k))
              && (function() { // create master indexes
                var $DFD = PUSH_DFD();
                b.Find(function(keys) {

                  b.seq = keys;
                  if(b.index)
                    return $DFD.resolve();

                  var skeys = b.skeyObject.map(function(skeyo) {
                    return skeyo.name;
                  }), index = [];

                  b.Get(keys, function(arr) {

                    arr.forEach(function(obj) {
                      var label = skeys.map(function(name) {
                        return obj[name];
                      }).join(' ');
                      index.push({
                        label: '(' + obj._id + ') ' + label,
                        value: obj._id
                      });
                    });

                    b.index = index;
                    $DFD.resolve();

                  });

                });
              })();

            // SET LAYER AD/MD/SD
            0 < idx && (function($DFD) {
              setTimeout(function() {
                $.when(dfds[0]).done(function() {
                  setAtLayer(idx);
                });
                function setAtLayer(n) {
                  var flay = flays.body(n).show(), tlay = tlays.body(n).show();
                  b.InlineForm(flay), b.InlineTable(tlay);
                  b.ChangeFormMode(false), flay.hide(), tlay.hide();
                  dfds[idx].resolve(), $DFD.resolve();
                }
              }, 500);
            })(PUSH_DFD());

          })();

        }); // END OF FOR EACH BOOK
        // << set for each book action <<

        (function() {
          var $DFD = PUSH_DFD();
          setTimeout(function() {
            AS.Bo.CP.Input('fmemo').val(fomemo);
            $DFD.resolve();
          }, 50);
        })();

        var f_visible = viewin.f_visible || [];
        f_visible[0] && (function(type, key) {
          var $DFD = PUSH_DFD();
          setTimeout(function() {
            var b_TARG = this, vlay = flays.children('#flayer' + type);
            AS.Bo.CP.Value('sel_target', type);
            key ? b_TARG.Get(key, function(v) {
              v ? $.when.apply($, dfds).done(function() {
                b_TARG.LoadForm(key, function() {
                  Fn.focusForm(type), $DFD.resolve();
                });
              }): $DFD.resolve();
            }): $DFD.resolve();
          }.bind(this), 1000);
        }).apply(AS.Bo[f_visible[0]], f_visible);

        var t_visible = viewin.t_visible || [];
        t_visible[0] && (function(type, seq) {
          var $DFD = PUSH_DFD();
          setTimeout(function() {
            var b_TARG = this, tlay = tlays.children('#tlayer' + type);
            seq ? b_TARG.Get(seq, function(vals) {
              var seq = vals.filter(function(v) {
                return !!v;
              }).map(function(v) {
                return v._id;
              });
              seq ? (function() {
                b_TARG.DrawTable(seq);
                tlay.siblings().hide(), tlay.show(), $DFD.resolve();
              })(): $DFD.resolve();
            }): $DFD.resolve();
          }.bind(this), 1000);
        }).apply(AS.Bo[t_visible[0]], t_visible);

      }); // << END OF FOR EACH BOOK TYPE

      // [FOR WEB TEST] >>
      (function() {
        var f = foonyah;
        var src_host = 'https://webtest.cloudplus.me/';
        var src_path = 'js/plugin/githubsrc/ystskm/doping-js/master/';
        if(DFDS_FOR_TEST.length)// read test client
          $.when.apply($, DFDS_FOR_TEST).done(function() {
            ['doping.js', 'doping-client.js'].forEach(function(js) {
              f.writeToHead(f.createJs(src_host + src_path + js));
            });
          }), window.DFDS_FOR_TEST = DFDS_FOR_TEST; // TODO remove
      })();
      // << FOR WEB TEST

      // emit ready event
      $S.emit(AS.Event.SysReady);

    }, 80);

    function appendDiv(cls, cont, $tgt) {
      return $('<div class="' + cls + '">' + cont + '</div>').appendTo($tgt);
    }

  }

  function beforeLaunchSlight() {
    offUnload();

    var divs = _makeThreeDivide(this, 40);
    setTimeout(function() {

      var t_expl = $('<span>' + '利用する対象企業を選択または追加して下さい。' + '</span>');
      divs.divided(0).css({
        textAlign: 'center',
        fontSize: '120%',
        fontWeight: 'bold',
        lineHeight: '48px'
      }).append(t_expl);

      AS.Bo.CMP.InlineTable(divs.divided(1));
      AS.Bo.CMP.DrawTable(AS.ckeys);

      var b_NEW = AS.Bo.CMP.SystemButton('_NEW_').off('click mouseup');
      b_NEW.click(function() {
        location.href = location.href.replace(/(\?.*)?#.*$/, '') + '?company';
      });

      divs.divided(2).css({
        textAlign: 'center'
      }).append(b_NEW.css({
        padding: '2px 42px'
      }));

    }, 4);
  }

  function beforeLaunchNewface() {
    offUnload();

    var divs = _makeThreeDivide(this, 10);
    setTimeout(function() {

      var b_CMP = AS.Bo.CMP;
      var t_expl = $('<span>' + '作成する企業情報を入力して下さい。' + '</span>');
      divs.divided(0).css({
        textAlign: 'center',
        fontSize: '120%',
        fontWeight: 'bold',
        lineHeight: '48px'
      }).append(t_expl);

      b_CMP.InlineForm(divs.divided(1));

      var b_SAVE = b_CMP.SystemButton('_SAVE_').off('click mouseup');
      var b_LIST = b_CMP.SystemButton('一覧に戻る').off('click mouseup');

      b_SAVE.click(function() {
        b_CMP.SaveForm(function(obj, err) {
          err ? b_CMP.alert(err.message): b_LIST.click();
        });
      });

      b_LIST.click(function() {
        location.href = location.href.replace(/\?.*$/, '');
      });

      divs.divided(2).css({
        textAlign: 'center'
      }).append(b_SAVE.css({
        padding: '2px 42px'
      }), b_LIST.css({
        padding: '2px 42px'
      }));

    }, 4);
  }

  function offUnload() {
    window.onbeforeunload = null, $(window).off('beforeunload');
  }

  function _makeThreeDivide(sys, btm) {
    var hdivs = sys.Divide('_BODY_', {
      'l_block': '20%',
      'c_block': '60%',
      'r_block': '20%'
    });
    return sys.Divide(hdivs.divided(1), {
      't_block': '10%',
      'm_block': (90 - btm) + '%',
      'b_block': btm + '%'
    }, {
      vertical: true
    });
  }

}).call(AppSpace, $S.$);
