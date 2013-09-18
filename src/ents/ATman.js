'use strict';

define(
  ['ents/Soldier', 'ents/PropelledShell', 'world', 'assets', 'Animation'],
  function (Soldier, PropelledShell, world, assets, Animation) {
  var ATman = Soldier.extend({
    type: 'ATman',
    shootSpeed: 6000,
    range: 300,

    thumb: 'atman-icon.png',

    craftDifficulty: 50,

    targetPreference: [
      'tank',
      'soldier'
    ],

    constructor: function (x, faction) {
      this.w = 24;
      this.h = 22;
      var sprite = {
        img: assets.images.spritesheet,
        sx: 290,
        sy: faction * 22,
        sw: 24,
        sh: 22,
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

      sprite.sx = 386;
      this.fireAnim = new Animation({
        sprite: sprite,
        frameLength: 50,
        framesCount: 1
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
    },

    doShoot: function (target) {
      world.projectiles.push(new PropelledShell(this.x, this.y - 12, target.x, target.y - 5));
    }
  });
  return ATman;
});
