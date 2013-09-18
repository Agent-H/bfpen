'use strict';

define(
  ['world'],
  function (world) {
  function Graphics() {

    // assert viewport.w <= world.width;
    this.viewport = {
      x: 0,
      y: 0,
      w: world.width,
      h: 0
    };

    this.offsetY = 0;

    this.screen = {
      w: 0,
      h: 0
    };

    this.canvas = document.createElement('canvas');
    this.canvas.width = world.width;
    this.canvas.height = world.height;
    this.canvasCtx = this.canvas.getContext('2d');
  }

  Graphics.prototype.mapCoords = function (x, y) {
    if (y === undefined) {
      return x * this.viewport.w / this.screen.w + this.viewport.x;
    }

    return {
      x: x * this.viewport.w / this.screen.w + this.viewport.x,
      y: (y - this.offsetY) * this.viewport.h / this.screen.h + this.viewport.y
    };
  };

  Graphics.prototype.moveViewport = function (x, y) {
    this.viewport.x += x;
    this.viewport.y += y;

    if (this.viewport.x < 0) this.viewport.x = 0;
    else if (this.viewport.x > world.width - this.viewport.w) this.viewport.x = world.width - this.viewport.w;

    if (this.viewport.y < 0) this.viewport.y = 0;
    else if (this.viewport.y > world.height - this.viewport.h) {
      this.viewport.y = world.height - this.viewport.h;
      if (this.viewport.y < 0) this.viewport.y = 0;
    }
  };

  Graphics.prototype.zoom = function (delta) {
    var newW = this.viewport.w * delta;
    var newH = newW * this.viewport.h / this.viewport.w;

    this.viewport.x = Math.max(this.viewport.x + (this.viewport.w - newW) / 2, 0);
    this.viewport.y = Math.max(this.viewport.y + (this.viewport.h - newH) / 2, 0);

    this.viewport.h = newH;
    this.viewport.w = newW;

    if (this.viewport.h + this.viewport.y > world.height) this.viewport.y = Math.max(world.height - this.viewport.h, 0);

    if (this.viewport.w > world.width) this.viewport.w = world.width;
    if (this.viewport.w + this.viewport.x > world.width) this.viewport.x = world.width - this.viewport.w;
  };

  Graphics.prototype.draw = function (out, hook) {
    var ctx = this.canvasCtx;
    var i, j;

    this.viewport.h = this.viewport.w * out.canvas.height / out.canvas.width;

    ctx.drawImage(world.background, 0, 0);

    // drawing gates
    for (i = 0; i < world.gates.length; i++) {
      s = world.gates[i].getSprite();
      ctx.drawImage(s.img, s.sx, s.sy, s.sw, s.sh, s.x, s.y, s.w, s.h);

      // debug
      var gate = world.gates[i];
      ctx.fillStyle = (gate.hp > 100) ? '#0f0' : '#f00';
      ctx.fillText(gate.hp.toFixed(2), s.x, s.y - 10);
    }

    // drawing factories
    for (i = 0 ; i < 2 ; i ++) {
      s = world.factories[i].tank.getSprite();
      ctx.drawImage(s.img, s.sx, s.sy, s.sw, s.sh, s.x, s.y, s.w, s.h);
      s = world.factories[i].soldier.getSprite();
      ctx.drawImage(s.img, s.sx, s.sy, s.sw, s.sh, s.x, s.y, s.w, s.h);
    }

    // Drawing units, projectiles and effects
    var unitsCount = world.units.length,
      sprites = new Array(unitsCount + world.effects.length + world.projectiles.length),
      s, count = 0;

    for (i = 0; i < unitsCount; i++) {
      sprites[count++] = world.units[i].getSprite();
      //*
      // Print debug infos about unit
      // var unit = world.units[i];

      // ctx.fillStyle = (unit.hp > 20) ? '#0f0' : '#f00';
      // ctx.fillText(unit.hp.toFixed(2), unit.x - 20, unit.y - 30);
      // ctx.fillStyle = (unit.shooting) ? '#0f0' : '#f00';
      // ctx.fillText('shooting: ' + unit.shooting, s.x, s.y - 20);
      // ctx.fillStyle = '#00f';
      // ctx.fillText('range: ' + unit.range.toFixed(2), s.x, s.y - 30);
      // ctx.fillText('damage: ' + unit.damage.toFixed(2), s.x, s.y - 40);
      //*/
    }

    for (i = 0; i < world.projectiles.length; i++) {
      sprites[count++] = world.projectiles[i].getSprite();
    }

    for (i = 0; i < world.effects.length; i++) {
      s = world.effects[i].getSprite();
      if (world.effects[i].finished) {
        world.effects.splice(i, 1);
        i--;
      } else {
        sprites[count++] = s;
      }
    }

    // Drawing all sprites together, hopefully the browser can optimize this
    i = 0;
    while (i < count) {
      s = sprites[i];
      if (s == null) break;

      ctx.save();
      if (s.transforms) {
        for (j = 0; j < s.transforms.length; j++) {
          ctx[s.transforms[j].name].apply(ctx, s.transforms[j].params);
        }
      }
      ctx.drawImage(s.img, s.sx, s.sy, s.sw, s.sh, s.x, s.y, s.w, s.h);
      ctx.restore();

      i++;
    }


    var width = out.canvas.width;
    var height = out.canvas.height;
    this.screen.w = width;
    this.screen.h = height;
    var vWidth = this.viewport.w;
    var vHeight = Math.floor(height * vWidth / width);
    var offsetY = 0;

    if (vHeight > world.height) {
      offsetY = (vHeight - world.height) * width / vWidth / 2;
      vHeight = world.height;
      height = vHeight * width / vWidth;
    }

    if (hook) {
      hook(ctx);
    }

    this.offsetY = offsetY;

    out.drawImage(this.canvas, this.viewport.x, this.viewport.y, vWidth, vHeight, 0, offsetY, width, height);
  };

  return Graphics;
});
