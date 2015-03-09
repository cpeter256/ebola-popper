"use strict";

function LevelOverState(par, player_moves, victory, canvas, push_state, pop_state) {
	State.apply(this, [push_state, pop_state]);
	this.request_menu = true;
	this.menu = null;
	this.type = "levelover";
	this.par = par;
	this.player_moves = player_moves;
	
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
	var message3;
	if (this.victory == true) {
		message1 = "You win!";
		message2 = "You won in " + this.player_moves + (this.player_moves == 1 ? " move" : " moves");
		message3 = "Par is " + this.par;
	} else {
		message1 = "You lose!";
		message2 = "You failed to clear the level.";
		message3 = "Try again?";
	}
	
	ctx.save();
	ctx.fillStyle = "#FF0000";
	ctx.translate(canvas.width/2, 80);
	ctx.scale(4, 4);
	ctx.textAlign = "center";
	ctx.fillText(message1, 0, 0);
	ctx.fillText(message2, 0, 20);
	ctx.fillText(message3, 0, 40);
	
	ctx.restore();
	ctx.drawImage(sprites["PlayButton"], 20, 350);
	ctx.drawImage(sprites["LevelButton"], canvas.width-276, 350);
	
};//256,96
LevelOverState.prototype.onmousedown = function(e) {
	/*this.pop_state(this);
	this.menu.pop_world();
	
	if (this.victory) {
		if (this.menu.current_level < this.menu.levels.length-1) this.menu.current_level++;
	}
	
	this.menu.launch_current_level();*/
	if(e.button == 0){
		if(e.layerX>=20 && e.layerX<=20+256 && e.layerY>=350 && e.layerY<=350+96){
			this.nextLevel();
			this.goToMainMenu();
		}
		if(e.layerX>=this.canvas.width-276 && e.layerX<=this.canvas.width-20 && e.layerY>=350 && e.layerY<=350+96){
			this.nextLevel();
			this.goToMainMenu();
			this.menu.launch_current_level();
		}
	}
};
LevelOverState.prototype.nextLevel = function(){
	if (this.victory) {
		if (this.menu.current_level < all_levels.length-1){
			this.menu.current_level++; 
			if (this.menu.current_level == this.menu.max_level || this.menu.current_level > this.menu.max_level){
				this.menu.max_level++;
			}
		}
	}
};
LevelOverState.prototype.goToMainMenu = function(){
	this.pop_state(this);
	this.menu.pop_world();
};

















