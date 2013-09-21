'use strict';

define(
  ['Graphics', 'config', 'Zepto', 'world', 'logic/game_state', 'EventEmitter'],
  function (Graphics, config, $, world, game_state, EventEmitter) {

    var CURSOR_SCROLL_MARGIN = 20;
    var VIEWPORT_MOVE_SPEED = 5;

    var PLAYER_TEAM = 0;

    var GameContext = EventEmitter.extend({

      init: function () {
        this.pos = {x: 0, y: 0};
        this.graphics = new Graphics();

        this.highlight = {
          enable: false,
          x: 0,
          y: 0
        };
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

        this.pos = this.graphics.mapCoords(map.mouse.x, map.mouse.y);

        var worldCoords = this.graphics.mapCoords(map.mouse.x, map.mouse.y);
        var ent = world.getEntityAt(worldCoords.x, worldCoords.y);

        if (ent != null) {
          this.highlight.enable = true;
          this.highlight.x = ent.x + ent.w/2;
          this.highlight.y = ent.y;
        } else
          this.highlight.enable = false;
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


        var highlight = this.highlight;
        this.graphics.draw(ctx, function(ctx) {
          if (highlight.enable) {
            ctx.beginPath();
            ctx.moveTo(highlight.x, highlight.y);
            ctx.lineTo(highlight.x - 20, highlight.y - 15);
            ctx.lineTo(highlight.x - 10, highlight.y - 15);
            ctx.lineTo(highlight.x - 10, highlight.y - 40);
            ctx.lineTo(highlight.x + 10, highlight.y - 40);
            ctx.lineTo(highlight.x + 10, highlight.y - 15);
            ctx.lineTo(highlight.x + 20, highlight.y - 15);
            ctx.lineTo(highlight.x, highlight.y);

            ctx.fillStyle = '#c51';
            ctx.fill();
          }

        });
      }
    });

    return new GameContext();
  });
