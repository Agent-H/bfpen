'use strict';

define(
  ['Graphics', 'config', 'Zepto', 'world', 'logic/game_state', 'EventEmitter'],
  function (Graphics, config, $, world, game_state, EventEmitter) {

    var CURSOR_SCROLL_MARGIN = 20;
    var VIEWPORT_MOVE_SPEED = 5;

    var PLAYER_TEAM = 0;


    /*
        +--+ <- TOP_Y / TOP_X
        |  |
        |  |
      +-+  +-+ <-- MID_Y / MID_X
       \    /
        \  /
         \/ <- BASE_Y

         ++ <- ref
    */
    var ARROW_TOP_Y = 20;
    var ARROW_TOP_X = 4;
    var ARROW_MID_Y = 8;
    var ARROW_MID_X = 9;
    var ARROW_BASE_Y = 0;
    var ARROW_COLOR = '#903';


    var GameContext = EventEmitter.extend({

      init: function () {
        this.pos = {x: 0, y: 0};
        this.graphics = new Graphics();

        this.highlight = null;
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
          this.highlight = ent;
        } else
          this.highlight = null;
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


        var self = this;
        this.graphics.draw(ctx, function(ctx) {
          if (self.highlight) {
            self.drawArrow(ctx, self.highlight);
          }
          if (self.selectedEntity) {
            self.drawArrow(ctx, self.selectedEntity);
          }
        });


      },

      drawArrow: function (ctx, ent) {
        ctx.beginPath();

        var x = ent.pos().x + ent.width() / 2;
        var y = ent.pos().y;

        ctx.moveTo(x, y + ARROW_BASE_Y);
        ctx.lineTo(x - ARROW_MID_X, y - ARROW_MID_Y);
        ctx.lineTo(x - ARROW_TOP_X, y - ARROW_MID_Y);
        ctx.lineTo(x - ARROW_TOP_X, y - ARROW_TOP_Y);
        ctx.lineTo(x + ARROW_TOP_X, y - ARROW_TOP_Y);
        ctx.lineTo(x + ARROW_TOP_X, y - ARROW_MID_Y);
        ctx.lineTo(x + ARROW_MID_X, y - ARROW_MID_Y);
        ctx.lineTo(x, y + ARROW_BASE_Y);

        ctx.fillStyle = ARROW_COLOR;
        ctx.fill();
      }
    });

    return new GameContext();
  });
