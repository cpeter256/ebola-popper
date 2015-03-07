"use strict";

//Implement the pause state here
//Look to state.js and worldstate.js for examples

function PauseState(canvas, push_state, pop_state) {
	State.apply(this, [push_state, pop_state]);
	this.request_menu = true;
	this.menu = null;
	this.type = "pause";
	
	this.canvas=canvas;
}
PauseState.prototype = Object.create(State.prototype);
PauseState.prototype.constructor = PauseState;
PauseState.prototype.draw = function(canvas, ctx) {
	ctx.globalAlpha = .2;
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 1;

	var pausemessage;
	pausemessage = "PAUSED";
	ctx.save();
	ctx.fillStyle = "#FF0000";
	ctx.translate(canvas.width/2, 80);
	ctx.scale(4, 4);
	ctx.textAlign = "center";
	ctx.fillText(pausemessage, 0, 40);

	ctx.restore();
	ctx.drawImage(sprites["PlayButton"], 20, 350); //placeholder button, should be Unpausebutton
	ctx.drawImage(sprites["LevelButton"], canvas.width-276, 350); //Placeholder, need quit/main menu button
};

PauseState.prototype.onkeydown = function(keyCode) {
	if (keyCode == 27) { //escape
		this.pop_state(this);
	} else if (keyCode == 81) { //q
		this.pop_state(this);
		this.menu.pop_world();
	}
}; //not sure if we need to use key if we have buttons

PauseState.prototype.onmousedown = function(e) {

	if(e.button == 0){
		if(e.layerX>=20 && e.layerX<=20+256 && e.layerY>=350 && e.layerY<=350+96){
			this.pop_state(this);
		}
		if(e.layerX>=this.canvas.width-276 && e.layerX<=this.canvas.width-20 && e.layerY>=350 && e.layerY<=350+96){
			this.pop_state(this);
			this.menu.pop_world();
		}
	}
};
