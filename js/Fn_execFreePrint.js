(function() {
  var AS = this, Fn = AS.Fn;
  // assign
  $.extend(Fn, {
    execFreePrint: execFreePrint
  });
  return;

  function execFreePrint(opts) {

    var b_FPR = ECDB.BOOK('FPR');
    var s = Fn.printSize('A4'), w = s[0], h = s[1];
    opts = $.extend({

      sheet: null,
      data: {},

      width: s[0],
      height: s[1]

    }, opts instanceof ECBOOK ? {}: opts);
    opts.print = opts.print == 'boolean' ? opts.print: !opts.sheet;

    var sheet = opts.sheet || (function() {
      !b_FPR.Value('width') && b_FPR.Value('width', w);
      !b_FPR.Value('height') && b_FPR.Value('height', h);
      return Fn.createA4(b_FPR, b_FPR.Value('width'), b_FPR.Value('height'));
    })();

    var d = opts.data, images = d.images ? d.images: b_FPR.Value('images');
    var fncs = d.items ? d.items.func: b_FPR.Value('items[func]');
    var args = d.items ? d.items.args: b_FPR.Value('items[args]');

    var dfds = [];
    fncs.forEach(function(fn, i) {

      if(!fn)
        return;

      var a = null;
      try {
        a = eval('(' + args[i] + ')');
      } catch(e) {
        return console.log(e, 'JSON.parse fail No.' + i, args[i], a);
      }

      if(!$.isArray(a))
        return console.log('Not array parameter No.' + i, a);

      dfds.push(forEachDeferred);
      function forEachDeferred() {

        var dfd = new $.Deferred();
        if(!$.isPlainObject(a[a.length - 1]))
          a.push({});

        if(fn == 'image') {

          var img = images[a[0]];
          if(!img || !img._id)
            return console.log('Unexpected image parameter No.' + i, a);

          b_FPR.getImage(images[a[0]]._id, function(obj) {
            if(!a[1].width)
              a[1].width = obj.width;
            else if(/%/.test(String(a[1].width)))
              a[1].imageWidth = obj.width;
            !a[1].height && (a[1].height = obj.height);
            a[0] = obj.src, exec(), dfd.resolve();
          });

        } else {
          exec(), dfd.resolve();
        }
        return dfd;

        function exec() {
          sheet[fn].apply(sheet, a);
        }

      }

    });

    var pipeline = $.when(true);
    while(dfds.length)
      pipeline = pipeline.pipe(dfds.shift());

    return opts.print ? pipeline.done(function() {
      sheet.print();
    }): pipeline;

  }

}).call(window.AppSpace);
