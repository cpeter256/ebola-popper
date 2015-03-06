"use strict";

function MenuState(canvas, push_state, pop_state) {
	State.apply(this, [push_state, pop_state]);
	this.type = "menu";
	
	this.canvas = canvas;
	
	this.clickables=[];
	//Set up 3 location infos get the info in the draw and onclick functions
	this.playButtonInfo = {width: 256, height: 96};
	this.playButtonInfo = {width: this.playButtonInfo.width, height: this.playButtonInfo.height,
							x_min: canvas.width-this.playButtonInfo.width,
							y_min: 0,
							x_max: canvas.width,
							y_max: this.playButtonInfo.height,
							action: "play"};
	this.levelButtonInfo = {width: 256, height: 96};
	this.levelButtonInfo = {width: this.levelButtonInfo.width, height: this.levelButtonInfo.height,
							x_min: canvas.width-this.levelButtonInfo.width,
							y_min: this.playButtonInfo.y_max+5,
							x_max: canvas.width,
							y_max: this.playButtonInfo.y_max+5+this.levelButtonInfo.height,
							action: "levels"};
	this.aboutButtonInfo = {width: 256, height: 96};
	this.aboutButtonInfo = {width: this.aboutButtonInfo.width, height: this.aboutButtonInfo.height,
							x_min: canvas.width-this.aboutButtonInfo.width,
							y_min: this.levelButtonInfo.y_max+5,
							x_max: canvas.width,
							y_max: this.levelButtonInfo.y_max+5+this.aboutButtonInfo.height,
							action: "about"};
	
	this.clickables.push(this.playButtonInfo, this.levelButtonInfo, this.aboutButtonInfo);
}

MenuState.prototype=Object.create(State.prototype);
MenuState.prototype.constructor=MenuState;

MenuState.prototype.draw=function(canvas,ctx){
	//background, logo, play, Level Select, about
	ctx.fillStyle="#FFFFFF";
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//this.logo=sprites["Logo"];
	//ctx.drawImage(this.logo,0,0);
	
	var playBut = sprites["PlayButton"];
	var levelSelectBut = sprites["LevelButton"];
	var aboutBut = sprites["AboutButton"];
	
	/*This is JS. The canvas never scales.
	//Assigning coords in the case of scaling images or canvas
	this.playButtonCoords[0]=[canvas.width-this.playBut.width,0];
	this.playButtonCoords[1]=[this.playButtonCoords[0][0]+this.playBut.width, this.playButtonCoords[0][1]+ this.playBut.height];
	this.levelSelectCoords[0]=[canvas.width-this.levelSelectBut.width, this.playButtonCoords[1][1]+5];
	this.levelSelectCoords[1]=[this.levelSelectCoords[0][0]+this.levelSelectBut.width,this.levelSelectCoords[0][1]+this.levelSelectBut.height];
	this.aboutButtonCoords[0]=[canvas.width-this.aboutBut.width,this.levelSelectCoords[1][1]+5];
	this.aboutButtonCoords[1]=[this.aboutButtonCoords[0][0]+this.aboutBut.width,this.aboutButtonCoords[0][1]+this.aboutBut.height];*/
	
	//console.log(this.playButtonCoords,"  +  ",this.levelSelectCoords,"  +  ",this.aboutButtonCoords);
	
	ctx.drawImage(playBut,	0, 0, playBut.width, playBut.height,
							this.playButtonInfo.x_min, this.playButtonInfo.y_min, this.playButtonInfo.width, this.playButtonInfo.height);
	ctx.drawImage(levelSelectBut,	0, 0, levelSelectBut.width, levelSelectBut.height,
									this.levelButtonInfo.x_min, this.levelButtonInfo.y_min, this.levelButtonInfo.width, this.levelButtonInfo.height);
	ctx.drawImage(aboutBut,	0, 0, aboutBut.width, aboutBut.height,
							this.aboutButtonInfo.x_min, this.aboutButtonInfo.y_min, this.aboutButtonInfo.width, this.aboutButtonInfo.height);
};
MenuState.prototype.onmousedown = function(e) {
	if(e.button==0){
		//checked if anything clickable was clicked vs random click somewhere
		for(var but in this.clickables){
			var minX=this.clickables[but].x_min;
			var minY=this.clickables[but].y_min;
			var maxX=this.clickables[but].x_max;
			var maxY=this.clickables[but].y_max;
			if (e.layerX >= minX && e.layerX <= maxX && e.layerY >= minY && e.layerY <= maxY){
				//button clicked 
				switch(this.clickables[but].action){
				case "play":
					this.push_state(new WorldState("level_1", this.canvas, this.push_state, this.pop_state_raw));
					break;
				case "about":
					//this.push_state(new AboutState(this.push_state,this.pop_state));
					break;
				case "level":
					//this.push_state(new LevelSelectState(this.push_state,this.pop_state));
					break;
				default:
					console.log("unknown button pressed!");
				}
				break;
			}	
		}
	}
};
