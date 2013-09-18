'use strict';

define(
  ['ents/Soldier', 'assets', 'Animation'],
  function (Soldier, assets, Animation) {

    var Rifleman = Soldier.extend({
      type: 'rifleman',

      thumb: 'rifleman-icon.png',

      shootSpeed: 200,
      damage: 10,
      penetration: 2,
      range: 200,

      craftDifficulty: 10,

      targetPreference: [
        'soldier',
        'tank'
      ],

      constructor: function (x, faction) {
        var sprite = {
          img: assets.images.spritesheet,
          sx: 0,
          sy: faction * 21,
          sw: 24,
          sh: 20,
          x: this.x,
          y: this.y,
          w: this.w,
          h: this.h
        };

        this.anim = new Animation({
          sprite: sprite,
          frameLength: 100,
          framesCount: 4
        });

        sprite.sy = 42 + this.faction * 21;
        this.fireAnim = new Animation({
          sprite: sprite,
          frameLength: 50,
          framesCount: 2
        });

        this.deadAnim = {
          img: assets.images.spritesheet,
          sx: 0,
          sy: 82,
          w: 33,
          h: this.h,
          frameLength: 100,
          framesCount: 4
        };
      }
    });

    return Rifleman;
  });
