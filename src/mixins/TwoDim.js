'use strict';

define(function(){
  var TwoDim = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,

    contains: function(x, y) {
      return x >= this.x && y >= this.y && x <= this.x + this.w && y < this.y + this.h;
    }
  };

  return TwoDim;
});
