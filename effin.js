define(function() {
  // declare a whole mess of globals - I can do this because
  // a) I'm awesome
  // b) these functions should exist
  // c) lisp does it
  // 4) this is throwaway code
      K = function (x) { return function () { return x; };};
      I = function (x) { return x; };
      Equal = function (x) { return function (y) { return x === y; };};
      LessThan = function (y) { return function (x) {return x < y; };};
      To = function (x) { return function (y) { return y[x]; };};
      Chain = function () {
        var args = Array.prototype.slice.call(arguments),
          len = args.length;
          return function (x) {
            var i, ret = x;
            for(i=0; i<len; i++) {
              ret = args[i](ret);
            }
            return ret;
          };
      };
      LogI = function (x) { return I(x, console.log(x)); };
      RandomKey = function (obj) {
        if (typeof obj != 'object') { return; }
        var k = Object.keys(obj), l = k.length;
        var i = Math.floor(Math.random() * l);
        return k[i];
      };
});