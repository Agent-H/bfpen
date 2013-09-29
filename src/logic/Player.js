'use strict';

define(
  ['EventEmitter'],
  function (EventEmitter) {

  var Player = EventEmitter.extend({

    constructor: function(faction) {
      this._money = 500;
      this.faction = faction;

      /*this.factories = {
        'soldier': new Factory(SOLDIER_FACTORY_X, faction),
        'tank': new Factory(TANK_FACTORY_X, faction)
      };*/
    },

    addMoney: function (m) {
      if (this._money >= -m) {
        this._money += m;
        this.trigger('update');
        return true;
      }
      return false;
    },

    setMoney: function (m) {
      if (m <= 0) return false;
      this._money = m;
      this.trigger('update');
    },

    getMoney: function() {
      return this._money;
    }
  });

  return Player;
});
