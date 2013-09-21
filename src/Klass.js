'use strict';

define(function(){
  function Klass () {
    for(var i = 0 ; i < this._ctrs.length ; i++){
      this._ctrs[i].apply(this, arguments);
    }
  }

  Klass.prototype._ctrs = [];

  /* Klass.extend(prototypes...); */
  Klass.extend = function() {
    var fn = function() {
      Klass.apply(this, arguments);
    };
    var i, j, proto;

    fn.extend = Klass.extend;
    fn.prototype._ctrs = this.prototype._ctrs.slice(0);

    for(i in this.prototype) {
      if (i !== '_ctrs')
        fn.prototype[i] = this.prototype[i];
    }

    for(j = 0 ; j < arguments.length ; j++) {
      proto = arguments[j];
      for(i in proto) {
        if(i === 'constructor'){
          fn.prototype._ctrs.push(proto[i]);
        } else if(i !== '_ctrs') {
          fn.prototype[i] = proto[i];
        } else {
          fn.prototype._ctrs = fn.prototype._ctrs.concat(proto[i]);
        }
      }
    }

    return fn;
  };

  return Klass;
});
