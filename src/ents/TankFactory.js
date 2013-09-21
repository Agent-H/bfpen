'use strict';

define(['ents/Factory', 'assets', 'config', 'ents/Tank'], function(Factory, assets, config, Tank) {

  var TankFactory = Factory.extend({
    constructor: function(faction) {

      this.faction = faction;

      var self = this;

      this.x = 31;
      this.y = 283;
      this.w = 47;
      this.h = 52;

      this.spawnX = 40;

      if (faction === 1) {
        this.x = config.WORLD_WIDTH - this.x - this.w;
        this.spawnX = config.WORLD_WIDTH - this.spawnX;
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

      this.addActions([{
        img: Tank.prototype.thumb,
        name: 'tank',
        title: 'create tank',
        cb: function() {
          self.enqueueUnit(Tank);
        }
      }]);

    },

    getSprite: function(){
      return this.sprite;
    }
  });

  return TankFactory;
});
