"use strict";

function MenuState(canvas, push_state, pop_state) {
	State.apply(this, [push_state, pop_state]);
	this.type = "menu";
	
	this.canvas = canvas;
	this.current_level = 0;
	this.max_level = 0;
	
	this.logo=null;
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
							action: "level"};
	this.aboutButtonInfo = {width: 256, height: 96};
	this.aboutButtonInfo = {width: this.aboutButtonInfo.width, height: this.aboutButtonInfo.height,
							x_min: canvas.width-this.aboutButtonInfo.width,
							y_min: this.levelButtonInfo.y_max+5,
							x_max: canvas.width,
							y_max: this.levelButtonInfo.y_max+5+this.aboutButtonInfo.height,
							action: "about"};
	
	this.clickables.push(this.playButtonInfo, this.levelButtonInfo, this.aboutButtonInfo);
	
	this.current_world = null;
}

MenuState.prototype=Object.create(State.prototype);
MenuState.prototype.constructor=MenuState;

MenuState.prototype.pop_world = function() {
	if (this.current_world != null) this.current_world.pop_state(this.current_world);
	this.current_world = null;
};

MenuState.prototype.draw=function(canvas,ctx){
	//background, logo, play, Level Select, about
	ctx.fillStyle="#FFFFFF";
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	this.logo=sprites["Logo"];
	ctx.drawImage(this.logo,0,0);
	
	var playBut = sprites["PlayButton"];
	var levelSelectBut = sprites["LevelButton"];
	var aboutBut = sprites["AboutButton"];
	var continueBut=sprites["ContinueButton"];

	if(this.current_level > 0) //If advanced past first stage, button becomes continue playing, using about button as place holder
	{
		ctx.drawImage(continueBut,	0, 0, playBut.width, playBut.height,
							this.playButtonInfo.x_min, this.playButtonInfo.y_min, this.playButtonInfo.width, this.playButtonInfo.height);		
	}
	else
	{
		ctx.drawImage(playBut,	0, 0, playBut.width, playBut.height,
							this.playButtonInfo.x_min, this.playButtonInfo.y_min, this.playButtonInfo.width, this.playButtonInfo.height);
	}
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
					this.launch_current_level();
					break;
				case "level":
					this.push_state(new LevelSelectState(this.canvas, this.push_state, 	this.pop_state_raw));
					break;
				case "about":
					window.open("http://cmpmebolapopper.wikia.com/wiki/CmpmEbolaPopper_Wiki");
					break;
				default:
					console.log("unknown button pressed!");
				}
				break;
			}	
		}
	}
};

MenuState.prototype.onkeydown = function(keycode) {
	if(keycode== 85){ // u
		this.max_level=15;	
	}
};

MenuState.prototype.launch_current_level = function() {
	if (this.current_world == null) {
		this.current_world = new WorldState(all_levels[this.current_level].name, all_levels[this.current_level].par, this.canvas, this.push_state, this.pop_state_raw);
		this.push_state(this.current_world);
	} else {
		console.log("something terrible has happened!");
	}
};
