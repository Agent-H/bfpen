'use strict';

define(
  ['utils', 'assets', 'config'],
  function(_, assets, config){
  var world = {

    // private :

    /* jshint quotmark: double */
    paths: {
      "ramp":[{"x":16,"y":355},{"x":276,"y":346},{"x":392,"y":446}],
      "ground":[{"x":392,"y":446},{"x":401,"y":447},{"x":414,"y":448},{"x":423,"y":451},{"x":435,"y":448},{"x":451,"y":450},{"x":482,"y":450},{"x":505,"y":457},{"x":517,"y":444},{"x":532,"y":433},{"x":539,"y":433},{"x":545,"y":425},{"x":563,"y":419},{"x":576,"y":421},{"x":584,"y":433},{"x":610,"y":433},{"x":616,"y":443},{"x":627,"y":445},{"x":629,"y":448},{"x":634,"y":448},{"x":637,"y":452},{"x":643,"y":452},{"x":647,"y":459},{"x":667,"y":456},{"x":702,"y":460},{"x":719,"y":458},{"x":734,"y":459},{"x":748,"y":458},{"x":763,"y":462},{"x":788,"y":456},{"x":818,"y":457},{"x":840,"y":457},{"x":863,"y":458},{"x":881,"y":458},{"x":889,"y":453},{"x":959,"y":451}],
      "attack":[{"x":230,"y":450},{"x":239,"y":452},{"x":252,"y":448},{"x":265,"y":451},{"x":274,"y":447},{"x":293,"y":447},{"x":299,"y":446},{"x":316,"y":444},{"x":320,"y":447},{"x":341,"y":446},{"x":359,"y":451},{"x":383,"y":449},{"x":392,"y":446}]
    },
    /* jshint quotmark: single */

    units: [],
    projectiles: [],
    effects: [],

    // Returns the angle in the given path at the given x
    angleInPath: function(path, x) {
      var prev = path[0];
      for(var i = 0 ; i < path.length ; i++) {
        if (path[i].x > x) {
          return Math.atan2((path[i].y - prev.y), path[i].x - prev.x);
        }
        prev = path[i];
      }

      return 0;
    },

    // Returns the height in the given path at the given x
    heightInPath: function(path, x) {
      var prev = path[0];
      for(var i = 0 ; i < path.length ; i++) {
        if (path[i].x > x) {
          return (x - prev.x)/(path[i].x - prev.x) * (path[i].y - prev.y) + prev.y;
        }
        prev = path[i];
      }

      return prev.y;
    },

    // public :

    width: config.WORLD_WIDTH,
    height: config.WORLD_HEIGHT,

    // Returns the ground height for a given x in the given faction
    getGroundHeight: function(x, faction) {
      // left side of the world
      if (x < this.width / 2) {
        if (x < this.paths.ground[0].x) {
          if (faction === 0)
            return this.heightInPath(this.paths.ramp, x);
          else
            return this.heightInPath(this.paths.attack, x);
        } else {
          return this.heightInPath(this.paths.ground, x);
        }
      } else {
        if (x > this.width - this.paths.ground[0].x) {
          if (faction === 1)
            return this.heightInPath(this.paths.ramp, this.width - x);
          else
            return this.heightInPath(this.paths.attack, this.width - x);
        } else {
          return this.heightInPath(this.paths.ground, this.width - x);
        }
      }
    },

    getGroundAngle: function(x, faction) {
      // left side of the world
      if (x < this.width / 2) {
        if (x < this.paths.ground[0].x) {
          if (faction === 0)
            return this.angleInPath(this.paths.ramp, x);
          else
            return this.angleInPath(this.paths.attack, x);
        } else {
          return this.angleInPath(this.paths.ground, x);
        }
      } else {
        if (x > this.width - this.paths.ground[0].x) {
          if (faction === 1)
            return -this.angleInPath(this.paths.ramp, this.width - x);
          else
            return -this.angleInPath(this.paths.attack, this.width - x);
        } else {
          return -this.angleInPath(this.paths.ground, this.width - x);
        }
      }
    },

    getGate: function(num, faction) {
      return this.gates[num + 2*faction];
    },

    /* Returns the first entity found at coordinates x, y */
    getEntityAt: function(x, y) {
      var i;
      for (i = 0 ; i < 2 ; i ++) {
        if (this.factories[i].tank.contains(x, y)) {
          return this.factories[i].tank;
        } else if (this.factories[i].soldier.contains(x, y)) {
          return this.factories[i].soldier;
        }
      }
    },

    // Check if soldier of faction 0 at x f0x can see soldier of faction 1 at x f1x (this is reciproque)
    canSee: function(f0x, f1x) {
      var flag0 = 560, spawn0 = 281;
      var spawn1 = this.width - spawn0,
          flag1 = this.width - flag0;
      return f0x > spawn0 && f1x < spawn1 && f1x > spawn0 && f0x < spawn1 &&
        (f0x < flag0 && f1x < flag0 || f1x > flag1 && f0x > flag1 ||
          f0x > flag0 && f0x < flag1 && f1x > flag0 && f1x < flag1);
    },

    update: function() {
      for (var i = 0 ; i < 2 ; i++) {
        this.factories[i].soldier.update();
        this.factories[i].tank.update();
      }
    },

    init: function() {
      var img = assets.images.background;
      this.background = _.renderToCanvas(img.width * 2, img.height, function(ctx){
        ctx.save();
        ctx.translate(img.width*2, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img,0,0);
        ctx.restore();
        ctx.drawImage(img,0,0);
      });

      this.gates = [];
      this.factories = [];
    }
  };

  return world;
});
