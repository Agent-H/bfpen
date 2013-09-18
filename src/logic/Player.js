'use strict';

define(
  [],
  function () {
  var SOLDIER_FACTORY_X = 105;
  var TANK_FACTORY_X = 45;


  function Player(faction) {
    this.money = 100;
    this.faction = faction;

    /*this.factories = {
      'soldier': new Factory(SOLDIER_FACTORY_X, faction),
      'tank': new Factory(TANK_FACTORY_X, faction)
    };*/
  }

  Player.prototype.getFactory = function (type) {
    return this.factories[type];
  };

  Player.prototype.update = function () {
    /*this.factories.soldier.update();
    this.factories.tank.update();*/
  };

  Player.prototype.createUnit = function (factory, unitType) {

  };
  return Player;
});
