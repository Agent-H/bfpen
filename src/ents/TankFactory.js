'use strict';

define(['ents/Factory', 'assets', 'config'], function(Factory, assets, config) {

  var TankFactory = Factory.extend({
    constructor: function(faction) {

      this.x = 31;
      this.y = 283;
      this.w = 47;
      this.h = 52;

      if (faction === 1) {
        this.x = config.WORLD_WIDTH - this.x - this.w;
      }

      this.sprite = {
        img: assets.images.spritesheet,
        sx: 290,
        sy: 44,
        sw: this.w,
        sh: this.h,
        w: this.w,
        h: this.h,
        x: this.x,
        y: this.y
      };

    },

    getSprite: function(){
      return this.sprite;
    }
  });

  return TankFactory;
});
