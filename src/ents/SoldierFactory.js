'use strict';

define(['ents/Factory', 'assets', 'config', 'ents/Rifleman', 'ents/ATman'], function(Factory, assets, config, Rifleman, ATman) {

  var SoldierFactory = Factory.extend({
    constructor: function(faction) {
      var self = this;
      this.faction = faction;

      this.x = 90;
      this.y = 280;
      this.w = 47;
      this.h = 52;

      this.spawnX = 105;


      if (faction === 1) {
        this.x = config.WORLD_WIDTH - this.x - this.w;
        this.spawnX = config.WORLD_WIDTH - this.spawnX;
      }

      this.sprite = {
        img: assets.images.spritesheet,
        sx: 337,
        sy: 44,
        sw: this.w,
        sh: this.h,
        w: this.w,
        h: this.h,
        x: this.x,
        y: this.y
      };

      this.addActions([{
        img: Rifleman.prototype.thumb,
        name: 'rifleman',
        title: 'create rifleman',
        cb: function() {
          self.enqueueUnit(Rifleman);
        }
      }, {
        img: ATman.prototype.thumb,
        name: 'atman',
        title: 'create anti-tank',
        cb: function() {
          self.enqueueUnit(ATman);
        }
      }]);
    },

    getSprite: function(){
      return this.sprite;
    }
  });

  return SoldierFactory;
});
