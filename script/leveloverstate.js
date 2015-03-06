"use strict";

function LevelOverState(victory, canvas, push_state, pop_state) {
	State.apply(this, [push_state, pop_state]);
	this.request_menu = true;
	this.menu = null;
	this.type = "levelover";
	
	this.victory = victory;
	this.canvas = canvas;
}
LevelOverState.prototype = Object.create(State.prototype);
LevelOverState.prototype.constructor = LevelOverState;
LevelOverState.prototype.draw = function(canvas, ctx) {
	ctx.globalAlpha = .2;
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 1;
	
	var message1;
	var message2;
	if (this.victory == true) {
		message1 = "You win!";
		message2 = "Press any key to advance";
	} else {
		message1 = "You lose!";
		message2 = "Press any key to try again";
	}
	
	ctx.save();
	ctx.fillStyle = "#FF0000";
	ctx.translate(canvas.width/2, canvas.height/2);
	ctx.scale(4, 4);
	ctx.textAlign = "center";
	ctx.fillText(message1, 0, 0);
	ctx.fillText(message2, 0, 10);
	
	ctx.restore();
};
LevelOverState.prototype.onmousedown = function(e) {
	this.pop_state(this);
	this.menu.pop_world();
	
	if (this.victory) {
		if (this.menu.current_level < this.menu.levels.length-1) this.menu.current_level++;
	}
	
	this.menu.launch_current_level();
};
LevelOverState.prototype.onkeydown = function(key) {
	this.pop_state(this);
	this.menu.pop_world();
	
	if (this.victory) {
		if (this.menu.current_level < this.menu.levels.length-1) this.menu.current_level++;
	}
	
	this.menu.launch_current_level();
};