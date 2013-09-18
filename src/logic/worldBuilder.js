'use strict';

define(
	['ents/Gate', 'ents/TankFactory', 'ents/SoldierFactory', 'world'],
	function(Gate, TankFactory, SoldierFactory, world){

	function worldBuilder() {
		world.gates = [];
    for(var i = 0 ; i < 4 ; i++) {
      world.gates.push(new Gate(i%2, Math.floor(i/2) % 2));
    }

    world.factories = [{
      tank: new TankFactory(0),
      soldier: new SoldierFactory(0)
    }, {
      tank: new TankFactory(1),
      soldier: new SoldierFactory(1)
    }];

    return world;
	}

	return worldBuilder;
});
