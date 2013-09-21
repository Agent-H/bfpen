'use strict';

define(
  ['ents/GroundUnit', 'mixins/Craftable', 'world', 'Animation', 'assets', 'ents/TankShell'],
  function (GroundUnit, Craftable, world, Animation, assets, TankShell) {

    var Tank = GroundUnit.extend(Craftable, {
      type: 'tank',

      shootSpeed: 5000,
      shield: 100,
      hp: 400,

      craftDifficulty: 5,

      targetPreference: [
        'tank',
        'ATman',
        'rifleman'
      ],

      constructor: function (x, faction) {
        this.x = x;
        this.faction = faction;
        this.w = 54;
        this.h = 25;

        this.minRange = Tank.MIN_RANGE * (0.9 + Math.random() * 0.2);
        this.maxRange = Tank.MAX_RANGE * (0.9 + Math.random() * 0.2);
        this.shootTime = Tank.SHOOT_TIME * (0.9 + Math.random() * 0.2);

        this.moveFactor = this.faction * (-2) + 1; // maps [0,1] to [-1, 1]

        this.sprite = {
          img: assets.images.spritesheet,
          sx: 0,
          sy: 120 + faction * this.h,
          sw: this.w,
          sh: this.h,
          x: -this.w / 2,
          y: -this.h,
          w: this.w,
          h: this.h,
          transforms: [{
            name: 'translate',
            params: [this.x - this.w / 2, this.y - this.h]
          }, {
            name: 'rotate',
            params: [world.getGroundAngle(x, faction)]
          }]
        };

        this.anim = new Animation({
          sprite: this.sprite,
          frameLength: 100,
          framesCount: 4
        });

        this.deadAnim = {
          img: assets.images.spritesheet,
          sx: 0,
          sy: 200,
          w: 82,
          h: 72,
          frameLength: 70,
          framesCount: 8
        };
      },

      getSprite: function () {
        var s = (this.shooting) ? this.anim.getFrame(0) : this.anim.getSprite();
        s.transforms[0].params[0] = this.x;
        s.transforms[0].params[1] = this.y;
        return s;
      },

      doShoot: function (target) {
        var y = (target.type === 'gate') ? target.y + 30 : target.y;
        world.projectiles.push(new TankShell(this.x, this.y - Tank.CANNON_HEIGHT, target.x, y, target));
      },

      move: function () {
        if (this.hp < 0) {
          this.deadAnim.x = this.x - 41;
          this.deadAnim.y = this.y - 65;
          world.effects.push(new Animation(this.deadAnim));
          return true;
        }

        if (!this.shooting) {
          this.x += Tank.SPEED * this.moveFactor;
          this.y = world.getGroundHeight(this.x, this.faction);

          var x1 = this.x - this.w / 2 + Tank.LEFT_WHEEL,
            x2 = this.x - this.w / 2 + Tank.RIGHT_WHEEL;
          var y1 = world.getGroundHeight(x1, this.faction);
          var y2 = world.getGroundHeight(x2, this.faction);
          this.sprite.transforms[1].params[0] = Math.atan2(y2 - y1, x2 - x1);
          this.y = (this.x - x1) / (x2 - x1) * (y2 - y1) + y1;

          // run-over

          // !!! inefficient & dirty
          var soldierX, unit, units = world.getUnits();
          for (var i = 0; i < units.length; i++) {
            if (units[i].faction === this.faction) continue;
            unit = units[i];
            soldierX = unit.x;
            if (Math.abs(soldierX - this.x) < Tank.RUN_OVER_DIST && unit.isType('soldier') && soldierX > 375 && soldierX < world.width - 375 &&
              (this.faction === 0 && soldierX > this.x ||
                this.faction === 1 && soldierX < this.x)
            ) {
              unit.hit(1000, 1000); // Sprotch
              break;
            }
          }
        }
      }
    });

    Tank.SPEED = 0.5;
    Tank.MIN_RANGE = 100;
    Tank.MAX_RANGE = 400;
    Tank.SHOOT_TIME = 5000;
    Tank.LEFT_WHEEL = 15;
    Tank.RIGHT_WHEEL = 35;
    Tank.CANNON_HEIGHT = 20;
    Tank.RUN_OVER_DIST = 19;

    return Tank;
  });
