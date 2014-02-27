(function(ns) {

  // assign
  $.extend(ns, {
    BSPL: BSPL
  });
  return;

  function BSPL(o) {

    o = $.extend({
      image: {
        ac: false,
        ad: false,
        ae: false,
        al: false,
        ai: false
      },
      date: {
        ac: false,
        ad: false,
        ae: false,
        al: false,
        ai: false
      }
    }, o);

    if(o.image === true)
      o.image = {
        ac: true,
        ad: true,
        ae: true,
        al: true,
        ai: true
      };

    if(o.date === true)
      o.date = {
        ac: true,
        ad: true,
        ae: true,
        al: true,
        ai: true
      };

    var base = {
      ac: {
        id: 'ac_items',
        label: "資産",
        vtitle: "計上額（マイナスは貸方）"
      },
      ad: {
        id: 'ad_items',
        label: "負債",
        vtitle: "計上額（マイナスは借方）"
      },
      ae: {
        id: 'ae_items',
        label: "純資産",
        vtitle: "計上額（マイナスは借方）"
      },
      al: {
        id: 'al_items',
        label: "支出",
        vtitle: "支出額"
      },
      ai: {
        id: 'ai_items',
        label: "収入",
        vtitle: "収入額"
      }
    };

    $.each(base, function(k, v) {
      var s = base[k].structure = [];
      s.push([k + "_bind", "No.", "integer", "", {
        css: {
          paddingRight: 0
        }
      }, 3]);
      s.push([k + "_line", "", "integer", "", {
        css: {
          paddingRight: 0
        }
      }, 3]);
      s.push([k + "_type", "科目", "refer", "ACC", {}, 9]);
      s.push([k + "_type.name", "", "", "", {}, 20]);
      s.push([k + "_stype", "副科目", "refer", "ACS", {}, 9]);
      s.push([k + "_stype.name", "", "", "", {}, 20]);
      s.push([k + "_value", v.vtitle, "account", "", {}, 26]);
      s.push([k + "_remark", '', "text", "", 'hidden', 0]);
      delete v.vtitle;
    });

    var arr = [];

    for( var i in o.image)
      if(o.image[i] === true) {
        var s = base[i].structure;
        s[6][5] = s[6][5] - 5; // width minus from value space
        s.push([i + '_img', "添付", "file", "", {}, 5]);
      }

    for( var i in o.date)
      if(o.date[i] === true) {
        var s = base[i].structure;
        s[4][5] = s[4][5] - 10;
        s.unshift([i + '_day', "日付", "integer", "", {
          min: 1,
          max: 31
        }, 10]);
      }

    for( var i in base) {
      var line = base[i];
      arr.push([line.id + '[]', line.label, line.structure, 75, {}, 10]);
    }

    return arr;

  }

})(AppSpace.Fn);
