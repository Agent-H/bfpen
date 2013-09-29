'use strict';

define(
  ['logic/Player'],
  function (Player) {
  var game_state = {
    players: [
      new Player(0),
      new Player(1)
    ],

    player_faction: 0,

    getActualPlayer: function() {
      return game_state.players[game_state.player_faction];
    }
  };
  return game_state;
});
