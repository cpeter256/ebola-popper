"use strict"

function LevelSelectState(canvas, playerProgession, push_state, pop_state) {
	State.apply(this, [push_state, pop_state]);
	this.request_menu = true;
	this.menu = null;
	this.playerProgession = playerProgession;
	
	this.canvas=canvas;
}
LevelSelectState.prototype = Object.create(State.prototype);
LevelSelectState.prototype.constructor = LevelSelectState;
LevelSelectState.prototype.draw = function(canvas, ctx) {
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	console.log("in Level State");
	
	var pausemessage;
	pausemessage = "Level Select";
	ctx.save();
	ctx.fillStyle = "#FF0000";
	ctx.translate(canvas.width/2, 0);
	ctx.scale(4, 4);
	ctx.textAlign = "center";
	ctx.fillText(pausemessage, 0, 20);

	ctx.restore();
};
LevelSelectState.prototype.onmousedown = function(e) {

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
