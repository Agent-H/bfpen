'use strict';

define(function(){

  var Selectable = {

    selType: 'default',

    constructor: function(){
      this.actions = [];
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
