"use strict";

function LevelSelectState(canvas, push_state, pop_state) {
	State.apply(this, [push_state, pop_state]);
	this.request_menu = true;
	this.menu = null;
	//this.max_level = max_level;
	
	this.canvas = canvas;
}
LevelSelectState.prototype = Object.create(State.prototype);
LevelSelectState.prototype.constructor = LevelSelectState;
LevelSelectState.prototype.draw = function(canvas, ctx) {
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	var pausemessage;
	pausemessage = "Level Select";
	ctx.save();
	ctx.fillStyle = "#FF0000";
	ctx.translate(canvas.width/2, 0);
	ctx.scale(4, 4);
	ctx.textAlign = "center";
	ctx.fillText(pausemessage, 0, 10);

	ctx.restore();
	ctx.drawImage(sprites["Levelone"], 45, 80); //placeholder button, should be level
	ctx.drawImage(sprites["Levelone"], 165, 80);
	ctx.drawImage(sprites["Levelone"], 285, 80); 
	ctx.drawImage(sprites["Levelone"], 405, 80); 
	ctx.drawImage(sprites["Levelone"], 525, 80); 
	ctx.drawImage(sprites["Levelone"], 45, 180); //placeholder button, should be level
	ctx.drawImage(sprites["Levelone"], 165, 180);
	ctx.drawImage(sprites["Levelone"], 285, 180); 
	ctx.drawImage(sprites["Levelone"], 405, 180); 
	ctx.drawImage(sprites["Levelone"], 525, 180); 
	ctx.drawImage(sprites["Levelone"], 45, 280); //placeholder button, should be level
	ctx.drawImage(sprites["Levelone"], 165, 280);
	ctx.drawImage(sprites["Levelone"], 285, 280); 
	ctx.drawImage(sprites["Levelone"], 405, 280); 
	ctx.drawImage(sprites["Levelone"], 525, 280); 
	ctx.drawImage(sprites["PlayButton"], this.canvas.width/2 - 128, 370); //placeholder button, should be Unpausebutton	

};
LevelSelectState.prototype.onmousedown = function(e) {

	if(e.button == 0){
		if(e.layerX>=45 && e.layerX<=45+70 && e.layerY>=80 && e.layerY<=80+70 ){
			this.menu.current_level = 0;			
			this.gotoLevel();
		}
		if(this.menu.max_level > 0){
			if(e.layerX>=165 && e.layerX<=165+70 && e.layerY>=80 && e.layerY<=80+70 ){
				this.menu.current_level = 1;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 1){
			if(e.layerX>=285 && e.layerX<=285+70 && e.layerY>=80 && e.layerY<=80+70 ){
				this.menu.current_level = 2;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 2){
			if(e.layerX>=405 && e.layerX<=405+70 && e.layerY>=80 && e.layerY<=80+70 ){
				this.menu.current_level = 3;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 3){
			if(e.layerX>=525 && e.layerX<=525+70 && e.layerY>=80 && e.layerY<=80+70 ){
				this.menu.current_level = 4;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 4){
			if(e.layerX>=45 && e.layerX<=45+70 && e.layerY>=180 && e.layerY<=180+70 ){
				this.menu.current_level = 5;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 5){
			if(e.layerX>=165 && e.layerX<=165+70 && e.layerY>=180 && e.layerY<=180+70 ){
				this.menu.current_level = 6;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 6){
			if(e.layerX>=285 && e.layerX<=285+70 && e.layerY>=180 && e.layerY<=180+70 ){
				this.menu.current_level = 7;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 7){
			if(e.layerX>=405 && e.layerX<=405+70 && e.layerY>=180 && e.layerY<=180+70 ){
				this.menu.current_level = 8;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 8){
			if(e.layerX>=525 && e.layerX<=525+70 && e.layerY>=180 && e.layerY<=180+70 ){
				this.menu.current_level = 9;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 10){
			if(e.layerX>=45 && e.layerX<=45+70 && e.layerY>=280 && e.layerY<=280+70 ){
				this.menu.current_level = 10;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 11){
			if(e.layerX>=165 && e.layerX<=165+70 && e.layerY>=280 && e.layerY<=280+70 ){
				this.menu.current_level = 11;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 12){
			if(e.layerX>=285 && e.layerX<=285+70 && e.layerY>=280 && e.layerY<=280+70 ){
				this.menu.current_level = 12;			
				this.gotoLevel();
			}
		}
		if(this.menu.max_level > 13){
			if(e.layerX>=405 && e.layerX<=405+70 && e.layerY>=280 && e.layerY<=280+70 ){
				this.menu.current_level = 13;			
			 	this.gotoLevel();
			}
		}
		if(this.menu.max_level > 14){
			if(e.layerX>=525 && e.layerX<=525+70 && e.layerY>=280 && e.layerY<=280+70 ){
			 	this.menu.current_level = 14;			
			 	this.gotoLevel();
			}
		}
		if(e.layerX>=this.canvas.width/2 - 128 && e.layerX<=this.canvas.width/2 - 128 + 256 && e.layerY>=370 && e.layerY<=370+96 ){
			this.pop_state(this);
			this.menu.pop_world();
		}
	}
};

LevelSelectState.prototype.gotoLevel = function(){
		this.pop_state(this);
		this.menu.pop_world();
		this.menu.launch_current_level();
};

