(function() {
  var AS = this, Fn = AS.Fn;

  // assign
  $.extend(Fn, {
    makeMasterHash: makeMasterHash
  });
  return;

  function makeMasterHash(book, callback) {
    var hash = {};
    book.Find({}, {
      sort: {
        code: 1,
        list_lev: 1,
        name: 1
      }
    }, function(keys) {
      book.Get(keys, function(v) {
        v.forEach(function(v) {
          hash[v._id] = v;
        });
        callback(hash);
      });
    });
  }

}).call(AppSpace);
