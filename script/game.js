"use strict";

//unused for now, can be used to load external libraries and shit
/*function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}*/

//for load testing
//dont you dare use this in production
function test_sleep(ms) {
	var timestamp = window.performance.now();
	while (window.performance.now()-timestamp < ms);
}

var World = function(width, height) {
	this.w = width;
	this.h = height;
	this.action_queue = []; //elements are arrays of actions to be executed simultaneously
	this.cells = [];
	for (var i = 0; i < width; i++) {
		this.cells[i] = [];
		for (var j = 0; j < height; j++) {
			this.cells[i][j] = "test";//null; //elements are (as strings): wall, rock, human, infected, explosive
		}
	}
};
World.prototype.push_actions = function(actions) { //takes an array
	this.action_queue.push(actions);
};
World.prototype.draw = function(ctx, x, y, scale, yaw, pitch) { //x, y are center, yaw, pitch are radians, 0 pitch = top-down
	while (yaw > Math.PI*2) yaw -= Math.PI*2;
	while (yaw < 0) yaw += Math.PI*2;
	
	//pre-sprite test code
	ctx.strokeStyle = "#000000";
	ctx.save();
	ctx.translate(x, y);
	
	var scale_amount = Math.cos(pitch);
	ctx.scale(1, scale_amount);
	
	ctx.rotate(yaw);
	
	ctx.beginPath();
	for (var i = 0; i <= this.w; i++) {
		for (var j = 0; j <= this.h; j++) {
			ctx.moveTo(scale*(i-(this.w/2)), scale*(j-(this.h/2)));
			if (i != this.w) ctx.lineTo(scale*(i+1-(this.w/2)), scale*(j-(this.h/2)));
			ctx.moveTo(scale*(i-(this.w/2)), scale*(j-(this.h/2)));
			if (j != this.h) ctx.lineTo(scale*(i-(this.w/2)), scale*(j+1-(this.h/2)));
			
			/*if (i != this.w && j != this.h && this.cells[i][j] != null) {
				ctx.moveTo(scale*(i-(this.w/2)), scale*(j-(this.h/2)));
				ctx.lineTo(scale*(i+1-(this.w/2)), scale*(j+1-(this.h/2)));
			}*/
		}
	}
	ctx.stroke();
	ctx.restore();
	
	var cx;
	var cy;
	
	var x_start;
	var x_pred;
	var x_inc;
	var y_start;
	var y_pred;
	var y_inc;
	
	var max_x = this.w;
	var max_y = this.h;
	
	if (yaw >= 0 && yaw < Math.PI/2) {
		x_start = function() {cx = 0;};
		x_pred = function() {return cx < max_x;};
		x_inc = function() {cx++;};
		y_start = function() {cy = 0;};
		y_pred = function() {return cy < max_y;};
		y_inc = function() {cy++;};
	} else if (yaw >= Math.PI/2 && yaw < Math.PI) {
		x_start = function() {cx = 0;};
		x_pred = function() {return cx < max_x;};
		x_inc = function() {cx++;};
		y_start = function() {cy = max_y-1;};
		y_pred = function() {return cy >= 0;};
		y_inc = function() {cy--;};
	} else if (yaw >= Math.PI && yaw < 3*Math.PI/2) {
		x_start = function() {cx = max_x-1;};
		x_pred = function() {return cx >= 0;};
		x_inc = function() {cx--;};
		y_start = function() {cy = max_y-1;};
		y_pred = function() {return cy >= 0;};
		y_inc = function() {cy--;};
	} else {
		x_start = function() {cx = max_x-1;};
		x_pred = function() {return cx >= 0;};
		x_inc = function() {cx--;};
		y_start = function() {cy = 0;};
		y_pred = function() {return cy < max_y;};
		y_inc = function() {cy++;};
	}
	
	for (x_start(); x_pred(); x_inc()) {
		for (y_start(); y_pred(); y_inc()) {
			var i = cx;
			var j = cy;
			if (this.cells[i][j] != null) {
				var t_pos = {	x: scale*(i+.5-(this.w/2)),
								y: scale*(j+.5-(this.h/2))};
				t_pos = {	x: t_pos.x*Math.cos(yaw)-t_pos.y*Math.sin(yaw),
							y: t_pos.x*Math.sin(yaw)+t_pos.y*Math.cos(yaw)};
				t_pos.y *= scale_amount;
				t_pos.x += x; t_pos.y += y;
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(t_pos.x-scale*.25, t_pos.y-scale, scale*.5, scale);
				ctx.strokeStyle = "#000000";
				ctx.beginPath();
				ctx.moveTo(t_pos.x-scale*.25, t_pos.y-scale);
				ctx.lineTo(t_pos.x+scale*.25, t_pos.y);
				ctx.moveTo(t_pos.x+scale*.25, t_pos.y-scale);
				ctx.lineTo(t_pos.x-scale*.25, t_pos.y);
				
				ctx.stroke();
			}
		}
	}
};
//Actions are (as strings): left, right, up, down, wait, splode, infect
var Action = function(x, y, action) {
	this.x = x;
	this.y = y;
	this.action = action;
};

//testing code, this crap better not be in our final build
var the_canvas = document.getElementById("game_canvas");
var the_ctx = the_canvas.getContext("2d");

var test_world = new World(10, 10);
/*for (var i = 0; i < 5; i++) {
	var x = Math.floor(Math.random()*test_world.w);
	var y = Math.floor(Math.random()*test_world.h);
	//console.log(Math.random(test_world.h));
	test_world.cells[x][y]= "test";
}*/


var test_pitch = 0;
var test_yaw = 0;
function do_render(state, ms, canvas, ctx) {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#000000";
	ctx.fillText("seconds: " + Math.floor(ms/10)/100, 0, 10);
	
	
	test_yaw = ms*.0005;
	test_pitch = Math.PI*.5*Math.abs(Math.cos(ms*.0001));
	test_pitch = Math.PI*.4;
	
	test_world.draw(ctx, canvas.width/2, canvas.height/2, 32, test_yaw, test_pitch);
}

var last_timestamp = null;
function step(frame_begin) {
	if (last_timestamp == null) last_timestamp = frame_begin;
	var state_time = window.performance.now()-last_timestamp;
	
	do_render(null, state_time, the_canvas, the_ctx);
	window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);