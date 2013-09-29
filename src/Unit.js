'use strict';

define(
  ['Klass', 'mixins/TwoDim', 'mixins/Destroyable', 'mixins/Selectable', 'EventEmitter'],
  function(Klass, TwoDim, Destroyable, Selectable, EventEmitter){

  var Unit = EventEmitter.extend(TwoDim, Destroyable, Selectable, {

    _types: ['unit'],

    selType: 'unit',

    isType: function(type) {
      for(var i = 0 ; i < this._types.length ; i++) {
        if (type === this._types[i])
          return true;
      }


      return false;
    }
  });
  Unit.extend = function() {
    var fn = Klass.extend.apply(this, arguments);
    fn.extend = Unit.extend;
    fn.prototype._types = this.prototype._types.slice(0);
    for(var i = 0 ; i < arguments.length ; i++){
      if(arguments[i].type) {
        fn.prototype._types.push(arguments[i].type);
      }
    }
    return fn;
  };

  return Unit;
});
