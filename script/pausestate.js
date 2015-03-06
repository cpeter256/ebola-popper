"use strict";

//Implement the pause state here
//Look to state.js and worldstate.js for examples

function PauseState(world, push_state, pop_state) {
	State.apply(this, [push_state, pop_state]);
	this.pop_world = function() {world.force_pop();};
	this.type = "pause";
}
PauseState.prototype = Object.create(State.prototype);
PauseState.prototype.constructor = PauseState;
PauseState.prototype.draw = function(canvas, ctx) {
	ctx.globalAlpha = .2;
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 1;
};
PauseState.prototype.onkeydown = function(key) {
	if (key == "Esc" || key == "Escape") {
		this.pop_state(this);
	} else if (key == "q") {
		this.pop_state(this);
		this.pop_world();
	}
};