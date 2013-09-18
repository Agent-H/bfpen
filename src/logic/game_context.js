'use strict';

define(
  ['Graphics', 'config', 'Zepto', 'world', 'logic/worldBuilder', 'logic/game_state', 'EventEmitter'],
  function (Graphics, config, $, world, worldBuilder, game_state, EventEmitter) {

    var CURSOR_SCROLL_MARGIN = 20;
    var VIEWPORT_MOVE_SPEED = 5;

    var PLAYER_TEAM = 0;

    var GameContext = EventEmitter.extend({

      init: function () {
        this.pos = {x: 0, y: 0};
        this.graphics = new Graphics();

        // Kind of ugly way to build the world
        worldBuilder();
      },

      onActivate: function () {
        if (!this.initialized) {
          this.init();
        }
      },

      onClick: function (e) {
        var worldCoords = this.graphics.mapCoords(e.pageX, e.pageY);
        var ent = world.getEntityAt(worldCoords.x, worldCoords.y);

        if (ent != null) {
          this.trigger('selectEntity', ent);
          this.selectedEntity = ent;
        }
      },

      onMousemove: function (e) {
        this.pos = this.graphics.mapCoords(e.pageX, e.pageY);
      },

      onMousewheel: function (e) {
        this.graphics.zoom(e.wheelDelta < 0 ? 1.05 : 0.95);
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
        game_state.players[0].update();
        game_state.players[1].update();
        world.update();
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


        this.graphics.draw(ctx);
      }
    });

    return new GameContext();
  });
