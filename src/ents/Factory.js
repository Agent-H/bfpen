'use strict';

define(
  ['utils', 'Klass', 'mixins/TwoDim', 'world', 'mixins/Selectable', 'EventEmitter', 'logic/game_state'],
  function (_, Klass, TwoDim, world, Selectable, EventEmitter, game_state) {

    var Factory = EventEmitter.extend(TwoDim, Selectable, {

      // units/seconds crafted
      craftSpeed: 1,
      queueLength: 6,

      currentProgress: 0,

      lastTime: 0,

      selType: 'factory',

      constructor: function (faction) {
        this.faction = faction;
        this.queue = [];
        this.player = game_state.players[this.faction];
        console.log(game_state);
      },

      getCurrentUnitProgress: function () {
        if (this.queue.length === 0)
          return 0;
        return this.currentProgress / this.queue[0].craftDifficulty * 100;
      },

      craftLater: function(craftable) {
        return _.bind(function() {
          this.craft(craftable);
        }, this);
      },

      craft: function (craftable) {
        if(this.player.addMoney(-craftable.prototype.price)) {
          this.enqueueUnit(craftable);
          return true;
        }
        return false;
      },

      enqueueUnit: function (UnitType) {
        if (this.queue.length === this.queueLength) {
          return false;
        }
        if (this.queue.length === 0) {
          this.currentProgress = 0;
          this.lastTime = Date.now();
        }

        this.queue.push(new UnitType(this.spawnX, this.faction));

        this.trigger('update');

        return true;
      },

      abortUnit: function (queueId) {
        if (queueId < 0 || queueId > this.queue.length) return;

        if (queueId === 0) {
          this.resetProgress();
        }
        var u = this.queue.splice(queueId, 1);

        this.player.addMoney(u[0].price);

        this.trigger('update');
      },

      resetProgress: function() {
        this.currentProgress = 0;
        this.lastTime = Date.now();
      },

      update: function () {
        var curTime;
        if (this.queue.length > 0) {
          curTime = Date.now();
          this.currentProgress += (curTime - this.lastTime) / 1000 * this.craftSpeed;
          if (this.currentProgress > this.queue[0].craftDifficulty) {
            world.addUnit(this.queue[0]);
            this.queue.splice(0, 1);
            this.currentProgress = 0;
            this.trigger('update');
          }
          this.lastTime = curTime;
        }
      }
    });
    return Factory;
});
