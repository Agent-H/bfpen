'use strict';

define(
  ['world', 'Graphics', 'ents/Rifleman', 'ents/ATman', 'ents/Tank', 'config'],
  function (world, Graphics, Rifleman, ATman, Tank, config) {

  var units = {
    'ATman': ATman,
    'Rifleman': Rifleman,
    'Tank': Tank
  };

  var CURSOR_SCROLL_MARGIN = 20;
  var VIEWPORT_MOVE_SPEED = 5;

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
        world.addUnit(new units[this.spawntype](this.graphics.mapCoords(e.pageX), this.faction));
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
      var x = map.mouse.x,
        y = map.mouse.y;
      if (x > $(window).width() - CURSOR_SCROLL_MARGIN) {
        this.graphics.moveViewport(VIEWPORT_MOVE_SPEED, 0);
      } else if (x < CURSOR_SCROLL_MARGIN) {
        this.graphics.moveViewport(-VIEWPORT_MOVE_SPEED, 0);
      }

      if (y > $(window).height() - CURSOR_SCROLL_MARGIN) {
        this.graphics.moveViewport(0, VIEWPORT_MOVE_SPEED);
      } else if (y < CURSOR_SCROLL_MARGIN) {
        this.graphics.moveViewport(0, -VIEWPORT_MOVE_SPEED);
      }

      var worldCoords = this.graphics.mapCoords(map.mouse.x, map.mouse.y);
      var ent = world.getEntityAt(worldCoords.x, worldCoords.y);

      if (ent != null) {
        this.highlight = ent;
      } else
        this.highlight = false;

      /*if (map.keyboard[37] === true) {
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
      }*/
    },

    AI: function () {
      var units = world.getUnits();

      for (var i = 0; i < units.length ; i++) {
        units[i].think();
      }
    },

    physics: function () {
      world.update();
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
      var i;

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

      ctx.beginPath();
      ctx.strokeStyle = '#f00';

      var step = config.WORLD_WIDTH / config.SPACE_PARTITIONS;
      for(i = 0 ; i < config.SPACE_PARTITIONS ; i++) {
        ctx.moveTo(i*step, 0);
        ctx.lineTo(i*step, config.WORLD_HEIGHT);
      }

      ctx.stroke();


      var units = world.getUnits();
      for (i = 0 ; i < units.length ; i++) {
        ctx.fillText(units[i]._partId, units[i].x, units[i].y - units[i].h);
        // ctx.strokeRect(units[i].x - units[i].w-2, units[i].y - units[i].h, units[i].w, units[i].h);
      }

      if (DEBUG_CONTEXT.highlight) {
        ctx.strokeStyle = '#f00';
        ctx.strokeRect(DEBUG_CONTEXT.highlight.x - DEBUG_CONTEXT.highlight.w/2, DEBUG_CONTEXT.highlight.y - DEBUG_CONTEXT.highlight.h, DEBUG_CONTEXT.highlight.w, DEBUG_CONTEXT.highlight.h);
      }
    }
  };
  return DEBUG_CONTEXT;
});
