'use strict';

define(['Klass', 'mixins/TwoDim'], function(Klass, TwoDim){

  // Variation of TwoDim where
  var Ground2D = Klass.extend(TwoDim.prototype, {
    constructor: function() {
      console.log('hello ground');
    },

    pos: function() {
      return {
        x: this.x - this.w/2,
        y: this.y - this.h
      };
    },

    contains: function(x, y) {
      var xOff = this.w/2;
      var yOff = this.h;
      return x >= this.x - xOff && y >= this.y - yOff && x <= this.x + xOff && y < this.y;
    }
  }).prototype;

  return Ground2D;
});
