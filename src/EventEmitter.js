'use strict';

define(['Klass', 'utils'], function(Klass, _){

  var EventEmitter = Klass.extend({

    constructor: function() {
      this._listeners = [];
    },

    addListener: function(l) {
      this._listeners.push(l);
    },

    removeListener: function(l) {
      var pos = this._listeners.indexOf(l);
      if (pos !== -1)
        this._listeners.splice(pos, 1);
    },

    trigger: function(evt) {
      for (var i = 0 ; i < this._listeners.length ; i++) {
        _.trigger.apply(_, [this._listeners[i], evt].concat(Array.prototype.slice.call(arguments, 1)));
      }
    }
  });

  return EventEmitter;
});
