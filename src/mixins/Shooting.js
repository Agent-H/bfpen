'use strict';

define(function(){
  var Shooting = {
    shootSpeed: 100,
    lastShoot: 0,
    shooting: false,

    doShoot: function(target) {
      target.hit(this.damage, this.penetration);
    },

    shootAt: function(target){
      this.shooting = true;
      if (this.lastShoot + this.shootSpeed < Date.now()) {
        this.doShoot(target);
        this.lastShoot = Date.now();
      }
    }
  };

  return Shooting;
});
