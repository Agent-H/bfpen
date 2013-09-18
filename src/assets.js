'use strict';

define(function(){
  var assets = {

    images: {
      'background': 'background.png',
      'spritesheet': 'spritesheet.png'
    },

    load: function(done) {
      var img, imgCount = Object.keys(this.images).length, loaded = 0;

      for (var i in this.images) {
        img = new Image();
        img.src = this.images[i];
        assets.images[i] = img;
        img.onload = onLoad;
      }

      function onLoad() {
        if (++loaded === imgCount) {
          done();
        }
      }
    }
  };

  return assets;
});
