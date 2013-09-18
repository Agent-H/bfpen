'use strict';

define(
  ['logic/Player'],
  function (Player) {
  var game_state = {
    players: [
      new Player(0),
      new Player(1)
    ]
  };
  return game_state;
});
