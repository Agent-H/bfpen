'use strict';

define(
  ['Klass', 'mixins/TwoDim', 'world', 'mixins/Selectable', 'EventEmitter'],
  function (Klass, TwoDim, world, Selectable, EventEmitter) {

    var Factory = EventEmitter.extend(TwoDim, Selectable, {

      // units/seconds crafted
      craftSpeed: 1,
      queueLength: 6,

      currentProgress: 0,

      lastTime: 0,

      constructor: function (x, faction) {
        this.faction = faction;
        this.spawnX = x;
        this.queue = [];
      },

      getCurrentUnitProgress: function () {
        if (this.queue.length === 0)
          return 0;
        return this.currentProgress / this.queue[0].craftDifficulty * 100;
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
        if (queueId === 0) {
          this.currentProgress = 0;
        }
        this.queue.splice(queueId, 1);
        this.trigger('update');
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
