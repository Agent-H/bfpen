'use strict';

define(
  ['Unit', 'world', 'mixins/Shooting'],
  function (Unit, world, Shooting) {

    var GroundUnit = Unit.extend(Shooting, {
      type: 'groundUnit',

      targetPreference: [],

      constructor: function () {
        this.gateRange = 150 * (0.7 + Math.random() * 0.6);
      },

      prefers: function (one, to) {
        for (var i = 0; i < this.targetPreference.length; i++) {
          if (to.isType(this.targetPreference[i]))
            return false;
          if (one.isType(this.targetPreference[i]))
            return true;
        }

        return false;
      },

      think: function () {
        this.shooting = false;
        var soldierX, i, gate, selected, unit;
        var minRange = (this.minRange != null) ? this.minRange : 0;
        var maxRange = (this.maxRange != null) ? this.maxRange : this.range;
        // !!! inefficient & dirty
        for (i = 0; i < world.units.length; i++) {
          unit = world.units[i];
          soldierX = world.units[i].x;

          if (unit.faction === this.faction) continue;

          if (world.canSee(soldierX, this.x) &&
            Math.abs(soldierX - this.x) <= maxRange && Math.abs(soldierX - this.x) >= minRange &&
            (selected === undefined || this.prefers(unit, selected)) &&
            ((this.faction === 0 && soldierX > this.x) || (this.faction === 1 && soldierX < this.x))
          ) {
            selected = unit;
          }
        }
        if (selected !== undefined) {
          this.shootAt(selected);
          return;
        }
        for (i = 0; i < 2; i++) {
          gate = world.getGate(i, 1 - this.faction);
          if (!gate.isDestroyed() && Math.abs(gate.x - this.x) < this.gateRange) {
            this.shootAt(gate);
            break;
          }
        }
      }
    });

    return GroundUnit;
  });
