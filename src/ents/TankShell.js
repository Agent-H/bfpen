'use strict';

define(
  ['assets', 'world', 'Animation'],
  function (assets, world, Animation) {
    // Shell shooting from bx,by to ex,ey. Target is guaranteed to receive maximal damages. Area-based damage is dealt too.
    function TankShell(bx, by, ex, ey, target) {

      // This little extra time prevents the bullet from overlapping the fireing tank
      this.lastTime = Date.now() - 100;
      this.x = this.bx = bx;
      this.y = this.by = by;

      this.penetration = TankShell.PENETRATION * (Math.random() + 0.5);


      this.target = target;

      this.ex = ex;
      this.ey = ey;

      this.rightToLeft = this.bx > this.ex;

      this.sprite = {
        img: assets.images.spritesheet,
        sx: 282,
        sy: 106,
        sw: 35,
        sh: 16,
        w: 35,
        h: 10,
        x: 0,
        y: 0,
        transforms: [{
          name: 'translate',
          params: [0, 0]
        }, {
          name: 'rotate',
          params: [Math.atan2(ey - by, ex - bx)]
        }]
      };
    }

    TankShell.prototype.move = function () {
      this.x += (this.rightToLeft && -1 || 1) * TankShell.SPEED_PPS * (Date.now() - this.lastTime) / 1000;
      this.lastTime = Date.now();

      if (!this.rightToLeft && this.x >= this.ex || this.rightToLeft && this.x <= this.ex) {
        var x, y, r, i, dist;
        for (i = 0; i < world.units.length; i++) {
          x = world.units[i].x - this.ex;
          y = world.units[i].y - this.ey;

          if (world.units[i] !== this.target && (r = Math.sqrt(x * x + y * y)) < TankShell.RADIUS) {
            dist = (1 - r / TankShell.RADIUS);
            world.units[i].hit(TankShell.DAMAGE * dist * dist, TankShell.PENETRATION / (r * r + 1));
          }
        }

        if (this.target)
          this.target.hit(TankShell.DAMAGE, this.penetration);

        world.effects.push(new Animation({
          img: assets.images.spritesheet,
          sx: 0,
          sy: 200,
          x: this.ex - 41,
          y: this.ey - 65,
          w: 82,
          h: 72,
          frameLength: 70,
          framesCount: 8
        }));
        return true;
      } else {
        this.y = (this.x - this.bx) / (this.ex - this.bx) * (this.ey - this.by) + this.by;
      }
    };

    TankShell.prototype.getSprite = function () {
      this.sprite.transforms[0].params[0] = this.x;
      this.sprite.transforms[0].params[1] = this.y;
      return this.sprite;
    };

    TankShell.SPEED_PPS = 900;
    TankShell.DAMAGE = 200;
    TankShell.PENETRATION = 1000;
    TankShell.RADIUS = 70;

    return TankShell;
  });
