"use strict";

//unused for now, can be used to load external libraries and shit
function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

//testing code, this crap better not be in our final build
//seriously there's a better timestep than this for turn-based
var the_canvas = document.getElementById("game_canvas");
var the_ctx = the_canvas.getContext("2d");

function do_logic(state, delta) {

}

function do_render(state, canvas, ctx) {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#000000";
	ctx.fillText("logic/render: " + state.num_frames, 0, 10);
	ctx.fillText("seconds: " + Math.floor(100*state.total_frames/60)/100, 0, 20);
}

var game_time = 0;
var delta_t = 1000/60;
var time_accumulator = 0;

var state = {total_frames: 0};
function step(timestamp) {
	var delta = timestamp-game_time;
	game_time = timestamp;
	
	time_accumulator += delta;
	
	state.num_frames = 0;
	while (time_accumulator >= delta_t) {
		do_logic(state, delta_t);
		state.num_frames++;
		state.total_frames++;
		time_accumulator -= delta_t;
	}
	
	do_render(state, the_canvas, the_ctx);
	window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);