'use strict';

define(function(){

  var Selectable = {
    constructor: function(){
      this.actions = [];
      this.thumb = null;
    },

    addAction: function(a) {
			this.actions[a.name] = a;
    },

    addActions: function(as) {
			var i;
			for(i = 0 ; i < as.length ; i++) {
				this.addAction(as[i]);
			}
    },

    getAction: function(name) {
			return this.actions[name];
    }
  };

  return Selectable;
});
