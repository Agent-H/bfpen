'use strict';

define(
  ['utils', 'config'],
  function(_, config) {

  var game = {

    //private
    context: {
      input: function() {},

      AI: function() {},

      physics: function() {},

      logic: function() {},

      draw: function( /*ctx*/ ) {}
    },

    inputMap: {
      keyboard: new Array(255),
      mouse: {
        x: 0,
        y: 0,
        buttons: []
      }
    },

    initEvents: function() {
      var inputMap = game.inputMap;

      var inputDevice = window;

      inputDevice.onkeydown = function(e) {
        if (inputMap.keyboard[e.which]) return; // disables keyrepeat
        inputMap.keyboard[e.which] = true;
        _.trigger(game.context, 'keydown', e);
      };

      inputDevice.onkeyup = function(e) {
        inputMap.keyboard[e.which] = false;
        _.trigger(game.context, 'keyup', e);
      };

      window.onresize = function(e) {
        game.initCanvas();
        _.trigger(game.context, 'screenResize', e);
      };

      inputDevice.onmousewheel = function(e) {
        _.trigger(game.context, 'mousewheel', e);
      };

      inputDevice.onmousedown = function(e) {
        _.trigger(game.context, 'mousedown', e);
      };

      inputDevice.onmousemove = function(e) {
        inputMap.mouse.x = e.pageX;
        inputMap.mouse.y = e.pageY;
        _.trigger(game.context, 'mousemove', e);
      };

      inputDevice.onclick = function(e) {
        _.trigger(game.context, 'click', e);
      };
    },

    initCanvas: function() {
      var ctx = game.drawCtx = document.getElementById('screen').getContext('2d');
      ctx.canvas.width = this.canvasWidth = window.innerWidth;
      ctx.canvas.height = this.canvasHeight = window.innerHeight - config.GUI_HEIGHT;
    },

    //public
    init: function(context) {
      if (context) {
        _.trigger(context, 'activate');
        game.context = context;
      }

      game.initCanvas();
      game.initEvents();
    },

    loop: function() {
      window.requestAnimationFrame(game.loop);

      game.context.input(game.inputMap);
      game.context.AI();
      game.context.physics();
      game.context.logic();
      game.context.draw(game.drawCtx);
    },

    swapContext: function(context) {
      _.trigger(game.context, 'deactivate');
      context.willActivate();
      _.trigger(context, 'activate');
      this.context = context;
    }
  };

  return game;
});
