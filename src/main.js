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
  ['assets', 'world', 'game', 'gui', 'logic/game_context', 'Zepto'],
  function(assets, world, game, gui, game_context, $) {

    $(function() {
      assets.load(function(){
        world.init();
        game.init(game_context);
        game.loop();
      });
    });

});
