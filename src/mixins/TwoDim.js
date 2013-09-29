'use strict';

define(function(){
  var TwoDim = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,

    width: function() {
      return this.w;
    },

    height: function() {
      return this.h;
    },

    pos: function() {
      return {x: this.x, y: this.y};
    },

    contains: function(x, y) {
      return x >= this.x && y >= this.y && x <= this.x + this.w && y < this.y + this.h;
    }
  };

  return TwoDim;
});
