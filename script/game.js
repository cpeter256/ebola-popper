"use strict";

//Used to load a script file required by this one
//May replace with a better solution, but we only have 1 script file to load right now
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

//for load testing
//dont you dare use this in the final build
function test_sleep(ms) {
	var timestamp = window.performance.now();
	while (window.performance.now()-timestamp < ms);
}


function draw_border(canvas, ctx) {
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(canvas.width, 0);
	ctx.lineTo(canvas.width, canvas.height);
	ctx.lineTo(0, canvas.height);
	ctx.lineTo(0, 0);
	ctx.stroke();
};

var main_function = function() {
	//testing code, this crap better not be in our final build
	//who am I kidding most of this will end up in it in some modified form
	var the_canvas = document.getElementById("game_canvas");
	var the_ctx = the_canvas.getContext("2d");
	
	var test_world = new World(10, 10);
	for (var i = 0; i < 5; i++) {
		var x = Math.floor(Math.random()*test_world.w);
		var y = Math.floor(Math.random()*test_world.h);
		//console.log(Math.random(test_world.h));
		test_world.cells[x][y]= "test";
	}
	
	
	var test_pitch = 0;
	var test_yaw = 0;
	function do_render(state, ms, canvas, ctx) {
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#000000";
		ctx.fillText("seconds: " + Math.floor(ms/10)/100, 0, 10);
		
		
		test_yaw = .0001*ms;
		test_pitch = Math.PI*.4;
		
		test_world.draw(ctx, canvas.width/2, canvas.height/2, 48, test_yaw, test_pitch);
	}
	
	var last_timestamp = null;
	function step(frame_begin) {
		if (last_timestamp == null) last_timestamp = frame_begin;
		var state_time = window.performance.now()-last_timestamp;
		
		test_loc = test_world.screen_to_world(mouse_pos, the_canvas.width/2, the_canvas.height/2, 48, .0001*state_time, Math.PI*.4);
		do_render(null, state_time, the_canvas, the_ctx);
		//render border in software instead of css
		draw_border(the_canvas, the_ctx);
		window.requestAnimationFrame(step);
	}
	
	var mouse_pos = {x: 0, y: 0};
	the_canvas.onmousemove = function(e) {
		if (e.layerX != undefined) {
			mouse_pos = {x: e.layerX, y: e.layerY};
		} else {
			mouse_pos = {x: e.offsetX, y: e.offsetY};
		}
	};
	window.requestAnimationFrame(step);
};

loadScript("script/world.js", main_function);
