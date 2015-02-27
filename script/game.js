"use strict";

//Used to load on script and call a callback when it's finished
function loadScript(path, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = path;

    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

//Loads an array of scripts (in that order), then call final_callback
function loadScripts(urls, final_callback) {
	function build_recursive_bullshit(urls, start, final) {
		if (start >= urls.length) {
			return final;
		} else {
			return function() {
				loadScript(urls[start], build_recursive_bullshit(urls, start+1, final));
			};
		}
	};
	build_recursive_bullshit(urls, 0, final_callback)();
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

function draw_loadingbar(canvas, ctx, status) {
	var percent = status.loaded_sprites/status.max;
	var height = 16;
	var width = Math.min(canvas.width, 256);
	var top = canvas.height/2 - height/2;
	var left = canvas.width/2 - width/2;
	var center = percent*width;
	
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(left, top, width, height);
	ctx.fillStyle = "#000000";
	ctx.fillRect(left, top, center, height);
	ctx.stokeStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(left, top);
	ctx.lineTo(left+width, top);
	ctx.lineTo(left+width, top+height);
	ctx.lineTo(left, top+height);
	ctx.lineTo(left, top);
	ctx.stroke();
}

function main_function() {
	//testing code, this crap better not be in our final build
	//who am I kidding most of this will end up in it in some modified form
	var the_canvas = document.getElementById("game_canvas");
	var the_ctx = the_canvas.getContext("2d");
	//OH GOD BROWSERS
	the_ctx.imageSmoothingEnabled = false;
	the_ctx.mozImageSmoothingEnabled = false;
	the_ctx.webkitImageSmoothingEnabled = false;
	
	//bad smelly testing shit
	var global_yaw = Math.PI*.25;
	var global_pitch = Math.PI*.4;
	
	var d_yaw = 0;
	var d_pitch = 0;
	
	//still smelly test shit
	//hardcoding a level yeaaaaaa
	var test_world = new World(9, 9);
	test_world.cells[1][0] = "human";
	test_world.cells[1][2] = "explosive";
	test_world.cells[3][1] = "explosive";
	test_world.cells[3][2] = "explosive";
	test_world.cells[4][2] = "explosive";
	test_world.cells[4][3] = "explosive";
	test_world.cells[5][3] = "explosive";
	test_world.cells[5][4] = "explosive";
	test_world.cells[5][5] = "explosive";
	
	//TESTING CODE
	function do_render(state, ms, canvas, ctx) {
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		//ctx.fillStyle = "#000000";
		//ctx.fillText("seconds: " + Math.floor(ms/10)/100, 0, 10);
		
		test_world.draw(ctx, canvas.width/2, canvas.height/2, 48, global_yaw+d_yaw, global_pitch+d_pitch);
	}
	
	var loading = null;
	var get_loadstatus = null;
	
	var last_timestamp = null;
	function step(frame_begin) {
		if (loading == false) { //this is perverse but somehow it turns me on
			if (last_timestamp == null) last_timestamp = frame_begin;
			var state_time = window.performance.now()-last_timestamp;
			
			if (dragging_board) {
				d_yaw = -Math.PI*(mouse_pos.x-drag_pos.x)/(the_canvas.width);
				d_pitch = -.5*Math.PI*(mouse_pos.y-drag_pos.y)/(the_canvas.height);
				if (global_pitch+d_pitch > Math.PI/2) d_pitch = (Math.PI/2)-global_pitch;
				if (global_pitch+d_pitch < 0) d_pitch = -global_pitch;
			}
			
			//this shit depends on world.js, remove (or modify) once we kill all the debug code
			//test_loc = test_world.screen_to_world(mouse_pos, the_canvas.width/2, the_canvas.height/2, 48, global_yaw, global_pitch);
			
			//will need more complex logic here eventually, but for now all state happens instantly
			test_world.advance_state();
			
			do_render(null, state_time, the_canvas, the_ctx);
		} else if (loading == null) {
			loading = true;
			get_loadstatus = load_sprites();
		} else {
			//loooooading bar
			var status = get_loadstatus();
			draw_loadingbar(the_canvas, the_ctx, status);
			if (status.loaded_sprites >= status.max) loading = false;
		}
		
		//render border in software instead of css
		draw_border(the_canvas, the_ctx);
		window.requestAnimationFrame(step);
	}
	
	var mouse_pos = {x: 0, y: 0};
	var drag_pos = null;
	var dragging_board = false;
	the_canvas.onmousemove = function(e) {
		if (e.layerX != undefined) {
			mouse_pos = {x: e.layerX, y: e.layerY};
		} else {
			mouse_pos = {x: e.offsetX, y: e.offsetY};
		}
	};
	the_canvas.onmousedown = function(e) {
		//e.button == 0 -> left mouse button
		this.onmousemove(e);
		if (e.button == 0) {
			if (drag_pos != null) {
				console.log("Something broke! (double drag init)");
			}
			drag_pos = {x: mouse_pos.x, y: mouse_pos.y}; //good god js is horrifying
			
			var world_loc = test_world.screen_to_world(mouse_pos, the_canvas.width/2, the_canvas.height/2, 48, global_yaw, global_pitch);
			if (world_loc.x < 0 || world_loc.x > test_world.w ||
				world_loc.y < 0 || world_loc.y > test_world.h) {
				dragging_board = true;
			}
		}
	};
	the_canvas.onmouseup = function(e) {
		this.onmousemove(e);
		if (e.button == 0) {
			if (drag_pos == null) {
				//this is actually pretty normal
				//console.log("Something broke! (double drag release)");
			} else if (dragging_board == false) {
				//moooore smelly testing code
				test_world.handle_input(test_world.screen_to_world(drag_pos, the_canvas.width/2, the_canvas.height/2, 48, global_yaw, global_pitch),
										test_world.screen_to_world(mouse_pos, the_canvas.width/2, the_canvas.height/2, 48, global_yaw, global_pitch));
			} else {
				global_yaw += d_yaw;
				global_pitch += d_pitch;
				while (global_yaw > Math.PI*2) global_yaw -= Math.PI*2;
				while (global_yaw < 0) global_yaw += Math.PI*2;
				d_yaw = 0;
				d_pitch = 0;
			}
			
			drag_pos = null;
			dragging_board = false;
		}
	};
	the_canvas.onmouseout = function(e) {
		the_canvas.onmouseup(e);
	};
	window.requestAnimationFrame(step);
};

loadScripts(["script/debug.js", "script/sprite.js", "script/world.js"], main_function);
