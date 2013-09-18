'use strict';

define(
  ['utils'],
  function (_) {

    function Animation(params) {
      this.sx = (params.sx !== undefined) ? params.sx : (params.sprite && params.sprite.sx);
      this.sy = (params.sy !== undefined) ? params.sy : (params.sprite && params.sprite.sy);

      this.finished = false;

      this.framesCount = params.framesCount;
      this.frameLength = params.frameLength;
      this.lastTime = Date.now();

      this.frame = params.firstFrame || 0;

      this.sprite = _.clone(params.sprite) || {
        img: params.img,
        sx: params.sx,
        sy: params.sy,
        sw: params.sw || params.w,
        sh: params.sh || params.h,
        x: params.x || 0,
        y: params.y || 0,
        w: params.w || params.sw,
        h: params.h || params.sh
      };
    }

    Animation.prototype.getSprite = function () {
      if (this.lastTime + this.frameLength < Date.now()) {
        this.frame = (this.frame + 1) % this.framesCount;
        this.sprite.sx = this.sx + this.sprite.sw * this.frame;
        this.lastTime = Date.now();
        this.finished = (this.frame === 0);
      }
      return this.sprite;
    };

    Animation.prototype.getFrame = function (num) {
      this.sprite.sx = this.sx + this.sprite.sw * num;
      return this.sprite;
    };

    return Animation;
  });
