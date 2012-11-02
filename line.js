define(['effin'], function() {

  var lines = document.querySelector('#linesNshit');

  var Line = function(to, from){
    var ele = this.ele = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    this._to = to || {x: 0, y: 0};
    this._from = from || this._to;
    this.redraw();
    this.hide();
    lines.appendChild(ele);
  };

  Line.prototype = {
    set: function(hash) {
      var k;
      for(k in hash) {
        this.ele.setAttribute(k, hash[k]);
      }
    },
    to: function (pos) {
      return I(this,
        this._to = pos);
    },
    from: function (pos) {
      return I(this,
        this._from = pos);
    },
    redraw: function(){
        if ([
            this._from.x,
            this._from.y,
            this._to.x,
            this._to.y,
            this._to.x
          ].some(Equal(undefined))) {
          this.hide();
          return;
        }

        this.set({
          x1: this._from.x,
          y1: this._from.y,
          x2: this._to.x,
          y2: this._to.y
        });

        return this;
    },
    show: function () {
      return I(this,
      this.set({visibility: 'visible'}));
    },
    hide: function () {
      this.set({visibility: 'hidden'});
      return this;
    },
    destroy: function () {
      this.ele.parentNode.removeChild(this.ele);
    }
  };


  return Line;
})