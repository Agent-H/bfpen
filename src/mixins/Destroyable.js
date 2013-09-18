'use strict';

define(
  ['utils'],
  function (_) {

    var Destroyable = {
      hp: 100,
      shield: 10,

      hit: function (damage, penetration) {
        if (!penetration) penetration = 0;
        var factor = (penetration - this.shield + 100) / 200;
        factor = (factor > 0) ? (factor < 1) ? factor : 1 : 0;
        if ((this.hp -= damage * factor) <= 0) {
          _.trigger(this, 'destroy');
        }
      },

      isDestroyed: function () {
        return this.hp <= 0;
      }
    };

    return Destroyable;
  });
