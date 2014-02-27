(function(ns) {

  // assign
  $.extend(ns, {
    printSize: printSize,
    createA4: createA4,
    split3: split3
  });
  return;

  function printSize(type) {
    return {
      A4: [768, 1086]
    }[type];
  }

  function createA4(book, w, h, o) {
    var s = printSize('A4');
    s[0] = w || s[0], s[1] = h || s[1];
    return Synquery.ext.HybridPrint.main(book, s[0], s[1], $.extend({
      size: s[0] + 'px ' + s[1] + 'px'
    }, o));
  }

  function split3(v, mark, last) {

    var minus = v < 0;
    if(minus)
      v = v * -1;

    v = v.toString();

    var decimal = null;
    if(v.indexOf('.') != -1)
      decimal = v.substr(v.indexOf('.')), v = v.replace(decimal, '');

    var s = '';
    for( var i = v.length - 1; i >= 0; i--) {
      if(s.length != 0 && (v.length - 1 - i) % 3 == 0)
        s = mark + s;
      s = v[i] + s;
    }

    if(minus)
      s = '-' + s;

    if(decimal)
      s += decimal;

    return s
      + (last ? '<span style="font-size:70%;margin-left:8px;">' + last
        + '</span>': '');

  }

})(AppSpace.Fn);
