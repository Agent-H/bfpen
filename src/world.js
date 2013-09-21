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

    getUnitArrayIdAt: function(x) {
      return Math.floor(x / this.partitionWidth);
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

    addUnit: function(unit) {
      var partId = this.getUnitArrayIdAt(unit.x);
      unit._partId = partId;
      unit._lastIt = 0;
      this._units[partId].push(unit);
    },

    getGate: function(num, faction) {
      return this.gates[num + 2*faction];
    },

    getUnits: function() {
      return Array.prototype.concat.apply([], this._units);
    },

    getUnitsNear: function(x) {
      var id = Math.floor(x / this.partitionWidth);
      return this._units[id];
    },

    getUnitsInRange: function(x1, x2) {
      var id1 = Math.max(Math.floor(x1 / this.partitionWidth), 0);
      var id2 = Math.min(Math.floor(x2 / this.partitionWidth), config.SPACE_PARTITIONS);

      return Array.prototype.concat.apply([], this._units.slice(id1, id2 + 1));
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

      var units = this.getUnitsInRange(x - 30, x + 30);
      for(i = 0 ; i < units.length ; i++) {
        if (units[i].contains(x, y)) {
          return units[i];
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
      var i, j, unit;
      var curPart, nextPartId;

      var curIt = ++this.iteration;

      for (i = 0; i < this._units.length ; i++) {
        curPart = this._units[i];

        for (j = 0 ; j < curPart.length ; j++) {
          unit = curPart[j];

          if (unit._lastIt === curIt)
            continue;

          if (unit.move()) {
            curPart.splice(j--, 1);
          } else {
            nextPartId = this.getUnitArrayIdAt(unit.x);

            if (nextPartId != unit._partId) {
              curPart.splice(j--, 1); // Removing from current partition
              this._units[nextPartId].push(unit);
              unit._partId = nextPartId;
            }

            unit._lastIt = curIt;
          }
        }
      }

      for (i = 0; i < world.projectiles.length; i++) {
        if (world.projectiles[i].move()) {
          world.projectiles.splice(i--, 1);
        }
      }

      for (i = 0 ; i < 2 ; i++) {
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

      if (this.width / config.SPACE_PARTITIONS - Math.floor(this.width / config.SPACE_PARTITIONS) !== 0)
        throw "[ERROR] number of space partitions does not divide world width";

      this.partitionWidth = this.width / config.SPACE_PARTITIONS;
      this._units = new Array(config.SPACE_PARTITIONS);
      for (var i = 0 ; i < config.SPACE_PARTITIONS ; i++) {
        this._units[i] = [];
      }

      this.gates = [];
      this.factories = [];

      this.iteration = 0;
    }
  };

  return world;
});
