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

//testing code, this crap better not be in our final build
var the_canvas = document.getElementById("game_canvas");
var the_ctx = the_canvas.getContext("2d");

function test_sleep(ms) {
	var timestamp = window.performance.now();
	while (window.performance.now()-timestamp < ms);
}

function do_render(state, ms, canvas, ctx) {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#000000";
	ctx.fillText("seconds: " + Math.floor(ms/10)/100, 0, 10);
}

var last_timestamp = null;
function step(frame_begin) {
	if (last_timestamp == null) last_timestamp = frame_begin;
	var state_time = window.performance.now()-last_timestamp;
	
	do_render(null, state_time, the_canvas, the_ctx);
	window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);