'use strict';

define(
  ['world', 'Graphics', 'ents/Rifleman', 'ents/ATman', 'ents/Tank'],
  function (world, Graphics, Rifleman, ATman, Tank) {

  var units = {
    'Atman': ATman,
    'Rifleman': Rifleman,
    'Tank': Tank
  };

  var DEBUG_CONTEXT = {

    dirtyRegions: [],

    initialized: false,
    firstDraw: true,

    path: [],

    dot: {
      x: 0,
      y: 0
    },
    faction: 0,
    spawntype: 'Rifleman',


    init: function () {
      this.initialized = true;

      this.graphics = new Graphics();

      this.time = 0;
      this.spawnCount = 0;

      this.dirtyRegions.push({
        x: 0,
        y: 0,
        w: world.width,
        h: world.height
      });
    },

    onActivate: function () {
      if (!this.initialized) {
        this.init();
      }
    },

    onMousedown: function (e) {
      if (e.which === 2) {
        this.faction = (this.faction + 1) % 2;
      } else if (e.which === 1) {
        world.units.push(new units[this.spawntype](this.graphics.mapCoords(e.pageX), this.faction));
      }
    },

    onMousewheel: function (e) {
      this.graphics.zoom(e.wheelDelta < 0 ? 1.05 : 0.95);
    },

    onKeydown: function (e) {
      if (e.which === 82) {
        this.spawntype = 'Rifleman';
      } else if (e.which === 65) {
        this.spawntype = 'ATman';
      } else if (e.which === 84) {
        this.spawntype = 'Tank';
      } else if (e.which === 70) {
        this.faction = (this.faction + 1) % 2;
      }
    },

    onMousemove: function (e) {
      var x = this.graphics.mapCoords(e.pageX);
      this.dot = {
        x: x,
        y: world.getGroundHeight(x, this.faction)
      };
    },

    input: function (map) {

      if (map.keyboard[37] === true) {
        this.graphics.moveViewport(-1, 0);
      } else if (map.keyboard[39] === true) {
        this.graphics.moveViewport(1, 0);
      }

      if (this.time + 600 < Date.now()) {
        var spawnCount = Math.random();
        var faction = (Math.random() > 0.5) ? 0 : 1;
        var x = (faction === 0) ? 0 : world.width;
        if (spawnCount < 0.8) {
          world.units.push(new Rifleman(x, faction));
        } else if (spawnCount < 0.95) {
          world.units.push(new ATman(x, faction));
        } else {
          world.units.push(new Tank(x, faction));
        }
        this.time = Date.now() + Math.random() * 30;
      }
    },

    AI: function () {
      var soldiersCount = world.units.length;
      for (var i = 0; i < soldiersCount; i++) {
        world.units[i].think();
      }
    },

    physics: function () {
      var i;
      for (i = 0; i < world.units.length; i++) {
        if (world.units[i].move()) {
          world.units.splice(i--, 1);
        }
      }

      for (i = 0; i < world.projectiles.length; i++) {
        if (world.projectiles[i].move()) {
          world.projectiles.splice(i--, 1);
        }
      }
    },

    logic: function () {

    },

    draw: function (ctx) {
      if (this.firstDraw) {
        if (ctx.canvas.height > world.height) {
          this.graphics.viewport.w = Math.min(ctx.canvas.width, world.width);
        } else {
          this.graphics.viewport.w = Math.min(ctx.canvas.width / ctx.canvas.height * world.height, world.width);
        }
        this.firstDraw = false;
      }

      this.graphics.draw(ctx, this.drawDebug);
    },

    drawDebug: function (ctx) {
      // Drawing cursor
      ctx.save();
      ctx.strokeStyle = '#f00';
      ctx.translate(DEBUG_CONTEXT.dot.x, DEBUG_CONTEXT.dot.y);
      ctx.rotate(world.getGroundAngle(DEBUG_CONTEXT.dot.x, DEBUG_CONTEXT.faction));

      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.lineTo(7, 0);
      ctx.lineTo(0, -7);
      ctx.lineTo(-7, 0);
      ctx.stroke();
      ctx.restore();
    }
  };
  return DEBUG_CONTEXT;
});
