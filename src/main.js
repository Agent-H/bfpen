'use strict';
requirejs.config({
  paths: {
    'lib': '../lib',
    'tmpl': '../lib/tmpl',
    'Zepto': '../lib/zepto'
  },

  shim: {
    'Zepto': {
      exports: 'Zepto'
    }
  }
});

define(
  ['assets', 'world', 'game', 'gui', 'logic/debug_context', 'logic/game_context', 'logic/worldBuilder', 'Zepto'],
  function(assets, world, game, gui, debug_context, game_context, worldBuilder, $) {

    $(function() {
      assets.load(function(){
        world.init();
        // Kind of ugly way to build the world
        worldBuilder();
        game.init(game_context);
        game.loop();
      });
    });

    // Debug exposed vars
    window.game_context = game_context;
    window.debug_context = debug_context;
    window.game = game;
});
