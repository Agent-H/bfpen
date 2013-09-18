'use strict';

define(function(){
  var _ = {
    trigger: function(obj, evt) {
      var cbName = 'on' + evt.substr(0, 1).toUpperCase() + evt.substring(1);
      if (cbName in obj) {
        return obj[cbName].apply(obj, Array.prototype.slice.call(arguments, 2));
      }
    },
    renderToCanvas: function (width, height, renderFunction) {
      var buffer = document.createElement('canvas');
      buffer.width = width;
      buffer.height = height;
      renderFunction(buffer.getContext('2d'));
      return buffer;
    },
    clone: function(src){
      if(typeof src !== 'object')
        return src;

      var ret = {};
      for(var i in src){
        ret[i] = src[i];
      }

      return ret;
    }
  };

  return _;
});
