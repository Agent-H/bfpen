'use strict';

define(
  ['ents/GroundUnit', 'mixins/Craftable', 'world', 'Animation'],
  function (GroundUnit, Craftable, world, Animation) {

    var Soldier = GroundUnit.extend(Craftable, {
      speed: 0.5,
      hp: 20,
      shield: 5,
      type: 'soldier',


      constructor: function (x, faction) {
        this.x = x;
        this.faction = faction;
        this.y = world.getGroundHeight(x, faction);

        this.w = 24;
        this.h = 20;

        this.frame = 0;
        this.animTime = 0;

        this.moveFactor = this.faction * (-2) + 1; // maps [0,1] to [-1, 1]
      },

      move: function () {
        if (this.hp < 0) {
          this.deadAnim.x = this.x - 16;
          this.deadAnim.y = this.y - this.h;
          world.effects.push(new Animation(this.deadAnim));
          return true;
        }
        if (!this.shooting) {
          this.x += this.speed * this.moveFactor;
          this.y = world.getGroundHeight(this.x, this.faction);
        }
      },

      getSprite: function () {
        var sprite;
        if (this.shooting) {
          sprite = this.fireAnim.getSprite();
        } else {
          sprite = this.anim.getSprite();
        }

        sprite.x = Math.round(this.x - this.w / 2);
        sprite.y = Math.round(this.y - this.h);

        return sprite;
      }
    });

    return Soldier;
  });
