(function() {
  var AS = this, Fn = AS.Fn;

  // assign
  $.extend(Fn, {
    searchBSPLDefault: searchBSPLDefault,
    bindSimpleMinMax: bindSimpleMinMax,
    bindScriptKeyup: bindScriptKeyup,
    setAccountType: setAccountType
  });
  return;

  function searchBSPLDefault(i, obj) {

    if(this.name == 'AD') // 年次入力は default = true
      return true;

    // ac: 資産, ad: 負債, ae: 純資産, al: 費用, ai: 収益
    var ts = ['ac', 'ad', 'ae', 'al', 'ai'];

    for( var i = 0; i < ts.length; i++) {

      var arr = obj[ts[i] + '_items'] && obj[ts[i] + '_items'][ts[i] + '_type'];
      if(!$.isArray(arr))
        continue;

      for( var j = 0; j < arr.length; j++) {

        if(!arr[j])
          continue;

        // Accont Type
        var type = arr[j];

        // Account Sub Type
        var stype = obj[ts[i] + '_items'][ts[i] + '_stype'][j];

        // Value
        var value = obj[ts[i] + '_items'][ts[i] + '_value'][j];

        // ==================================== //

        /**
         * 【 Change to some condition. 】 If returns true, the record will be
         * listed.
         */

        if(true)
          return true;

        // ==================================== //

      }
    }

  }

  function bindSimpleMinMax($inp, evt, min, max) {
    $inp.on(evt, function() {
      var v = $inp.val();
      min != null && v < min && $inp.val(min);
      max != null && v > max && $inp.val(max);
    });
  }

  function bindScriptKeyup($i_fnc, $i_mes) {
    var fval = null;
    $i_fnc.on('keyup', 'textarea', function() {
      var cm = $i_fnc.data('script'), ok = true;
      fval != (fval = cm.getValue())
        && (function() {
          try {
            eval('(' + fval + ')');
            $i_mes.fadeOut();
          } catch(e) {
            $i_mes.html('<span style="color:#f00">構文エラー: ' + e.message
              + '</span>');
            $i_mes.fadeIn();
          }
        })();
    });
  }

  function setAccountType(a_type) {
    // TODO check "その他" always 'al' ?
    return AS.a_types[a_type] ? a_type: 'al';
  }

}).call(AppSpace);
