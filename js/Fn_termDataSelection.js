(function() {
  var AS = this, Fn = AS.Fn;

  // assign
  $.extend(Fn, {
    termDataSelection: termDataSelection
  });
  return;

  function termDataSelection(datas, fr, to, day_unit) {

    var box = [];
    datas.forEach(day_unit ? daySelection: monthSelection);
    return box;

    function getYMD(obj) {
      var y = obj.year, m = obj.month, d = obj.day;
      if(obj.apply_date) {
        var date = new Date(obj.apply_date * 1000);
        y = date.getYear() + 1900, m = date.getMonth() + 1, d = date.getDate();
      }
      return [y, m, d];
    }

    function monthSelection(obj) {
      var ymd = getYMD(obj), y = ymd[0], m = ymd[1];
      if(y == fr[0] && m >= fr[1])
        return box.push(obj);
      if(y > fr[0] && y < to[0])
        return box.push(obj);
      if(y == to[0] && m <= to[1])
        return box.push(obj);
    }

    function daySelection(obj) {

      !obj.day && console.log('unexpected data: ', obj);

      var ymd = getYMD(obj), y = ymd[0], m = ymd[1], d = ymd[2];
      if(y == fr[0] && m >= fr[1]) {
        if(y == fr[0] && m == fr[1] && d < fr[2])
          return;
        else if(y == to[0] && m > to[1])
          return;
        else if(y == to[0] && m == to[1] && d > to[2])
          return;
        return box.push(obj);
      }
      if(y > fr[0] && y < to[0])
        return box.push(obj);
      if(y == to[0] && m <= to[1]) {
        if(y == fr[0] && m == fr[1] && d < fr[2])
          return;
        else if(y == to[0] && m == to[1] && d > to[2])
          return;
        return box.push(obj);
      }
    }

  }

}).call(AppSpace);
