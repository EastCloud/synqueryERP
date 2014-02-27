(function(ns) {

  // assign
  $.extend(ns, {
    inputWithLabel: inputWithLabel
  });
  return;

  function inputWithLabel(book, i, type) {
    return book[type || 'Input'](i).add(book.Label(i));
  }

})(AppSpace.Fn);
