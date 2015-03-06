"use strict";

function MenuState(canvas, push_state,pop_state) {
	State.apply(this, [push_state, pop_state]);
	
	this.type = "menu";
	this.clickables=[];
	this.playBut=null;
	this.levelSelectBut=null;
	this.aboutBut=null;
	this.logo=null;
	//Set up 3 location infos get the info in the draw and onclick functions
	//First tuple is min coords and second tuple is max coords, is for checking case
	this.playButtonCoords=[[0,0],[0,0],"play"];
	
	this.aboutButtonCoords=[[0,0],[0,0],"about"];
	
	this.levelSelectCoords=[[0,0],[0,0],"level"];
	
	this.clickables.push(this.playButtonCoords,this.aboutButtonCoords,this.levelSelectCoords);
	
}

MenuState.prototype=Object.create(State.prototype);
MenuState.prototype.constructor=MenuState;

MenuState.prototype.draw=function(canvas,ctx){
	//background, logo, play, Level Select, about
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//this.logo=sprites["Logo"];
	//ctx.drawImage(this.logo,0,0);
	
	this.playBut=sprites["PlayButton"];
	this.levelSelectBut=sprites["LevelButton"];
	this.aboutBut=sprites["AboutButton"];
	
	//Assigning coords in the case of scaling images or canvas
	this.playButtonCoords[0]=[canvas.width-this.playBut.width,0];
	this.playButtonCoords[1]=[this.playButtonCoords[0][0]+this.playBut.width, this.playButtonCoords[0][1]+ this.playBut.height];
	this.levelSelectCoords[0]=[canvas.width-this.levelSelectBut.width, this.playButtonCoords[1][1]+5];
	this.levelSelectCoords[1]=[this.levelSelectCoords[0][0]+this.levelSelectBut.width,this.levelSelectCoords[0][1]+this.levelSelectBut.height];
	this.aboutButtonCoords[0]=[canvas.width-this.aboutBut.width,this.levelSelectCoords[1][1]+5];
	this.aboutButtonCoords[1]=[this.aboutButtonCoords[0][0]+this.aboutBut.width,this.aboutButtonCoords[0][1]+this.aboutBut.height];
	
	//console.log(this.playButtonCoords,"  +  ",this.levelSelectCoords,"  +  ",this.aboutButtonCoords);
	
	
	ctx.drawImage(this.playBut, this.playButtonCoords[0][0] ,this.playButtonCoords[0][1]);

	ctx.drawImage(this.levelSelectBut, this.levelSelectCoords[0][0], this.levelSelectCoords[0][1]);

	ctx.drawImage(this.aboutBut,this.aboutButtonCoords[0][0],this.aboutButtonCoords[0][1]);

};
MenuState.prototype.onclick = function(e){
	if(e.button==0){
		//checked if anything clickable was clicked vs random click somewhere
		for(var but in this.clickables){
			console.log(but);
			var minX=this.clickables[but[0][0]];
			var minY=this.clickables[but[0][0]];
			var maxX=this.clickables[but[1][0]];
			var maxY=this.clickables[but[1][1]];
			if (e.x >= minX && e.x <= maxX && e.y >= minY && e.y <= maxY){
				//button clicked 
				console.log(but);	
				switch(this.clickables[but[2]]){
				case "play":
				//new world state on level 1
					this.push_state(new WorldState(9,9,this.canvas,this.pop_state_raw));
					break;
				case "about":
					//this.push_state(new AboutState(this.push_state,this.pop_state));
					break;
				case "level":
					//this.push_state(new LevelSelectState(this.push_state,this.pop_state));
					break;
				
				}
				break;
			}	
		}
		
	}
};
