'use strict';

define(
  ['assets', 'world', 'Animation'],
  function (assets, world, Animation) {
  // Shell shooting from bx,by to ex,ey.
  function PropelledShell(bx, by, ex, ey) {

    // This little extra time prevents the bullet from overlapping the fireing tank
    this.lastTime = Date.now() - 100;
    this.x = this.bx = bx;
    this.y = this.by = by;

    this.penetration = PropelledShell.PENETRATION * (Math.random() + 0.5);

    this.ex = ex;
    this.ey = ey;

    // x = 1/2at² + vt + bx
    // TODO : use real math here
    this.a = 500 * (this.bx > this.ex ? -1 : 1);
    this.v = 100 * (this.bx > this.ex ? -1 : 1);

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

    this.smokeSprite = {
      img: assets.images.spritesheet,
      sx: 420,
      sy: 0,
      sw: 20,
      sh: 24,
      w: 20,
      h: 24,
      x: 0,
      y: 0
    };

    this.lastSmokeX = this.x;
  }

  PropelledShell.prototype.move = function () {
    var x, y, r, i, dist;
    var t = (Date.now() - this.lastTime) / 1000;
    var nextX = this.bx + this.v * t + this.a * t * t;

    while (!this.rightToLeft && this.lastSmokeX + 20 < this.x || this.rightToLeft && this.lastSmokeX - 20 > this.x) {
      if (this.rightToLeft)
        this.lastSmokeX -= 20;
      else
        this.lastSmokeX += 20;
      this.smokeSprite.x = this.lastSmokeX;
      this.smokeSprite.y = this.y - 12;
      world.effects.push(new Animation({
        sprite: this.smokeSprite,
        frameLength: 30,
        framesCount: 7
      }));
    }

    this.x = nextX;

    if (!this.rightToLeft && this.x >= this.ex || this.rightToLeft && this.x <= this.ex) {

      for (i = 0; i < world.units.length; i++) {
        x = world.units[i].x - this.ex;
        y = world.units[i].y - this.ey;

        if ((r = Math.sqrt(x * x + y * y)) < PropelledShell.RADIUS) {
          dist = (1 - r / PropelledShell.RADIUS);
          world.units[i].hit(PropelledShell.DAMAGE * dist * dist, PropelledShell.PENETRATION / (r * r + 1));
        }
      }

      if (this.target)
        this.target.hit(PropelledShell.DAMAGE, this.penetration);

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

  PropelledShell.prototype.getSprite = function () {
    this.sprite.transforms[0].params[0] = this.x;
    this.sprite.transforms[0].params[1] = this.y - 5;
    return this.sprite;
  };

  PropelledShell.DAMAGE = 500;
  PropelledShell.PENETRATION = 10000;
  PropelledShell.RADIUS = 30;

  return PropelledShell;
});
