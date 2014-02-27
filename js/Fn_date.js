(function(ns) {

  var now = new Date();
  
  // assign
  $.extend(ns, {
    thisYear: thisYear,
    thisMonth: thisMonth,
    thisDay: thisDay,
    nowY: nowY,
    nowM: nowM,
    nowD: nowD
  });
  return;

  function thisYear(d) {
    return (d || new Date()).getYear() + 1900;
  }

  function thisMonth(d) {
    return (d || new Date()).getMonth() + 1;
  }

  function thisDay(d) {
    return (d || new Date()).getDate();
  }

  function now(){
    return now;
  }
  
  function nowY(){
    return thisYear(now);
  }
  
  function nowM(){
    return thisMonth(now);
  }
  
  function nowD(){
    return thisDay(now);
  }
  
})(AppSpace.Fn);
