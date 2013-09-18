'use strict';

define(
  ['Unit', 'config', 'assets'],
  function (Unit, config, assets) {
    var Gate = Unit.extend({
      constructor: function (num, faction) {
        this.w = 17;
        this.h = 38;
        this.x = (faction === 1) ? (config.WORLD_WIDTH - Gate.pos[num].x - this.w) : Gate.pos[num].x;
        this.y = Gate.pos[num].y;

        this.faction = faction;

        this.sprite = {
          img: assets.images.spritesheet,
          sx: 200 + faction * 34,
          sy: 0,
          sw: this.w,
          sh: this.h,
          x: this.x,
          y: this.y,
          w: this.w,
          h: this.h
        };
      },

      onDestroy: function () {
        this.sprite.sx = 200 + this.faction * 34 + 17;
      },
      hp: 10000,
      shield: 700,
      type: 'gate',
      getSprite: function () {
        return this.sprite;
      }
    });

    Gate.pos = [{
      x: 285,
      y: 408
    }, {
      x: 262,
      y: 409
    }];

    return Gate;
  });
