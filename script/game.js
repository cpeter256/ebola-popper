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
	
	var state_stack = [];
	state_stack.push(new WorldState(9, 9, the_canvas));
	
	var loading = null;
	var get_loadstatus = null;
	
	var last_timestamp = null;
	function step(frame_begin) {
		//clear framebuffer
		the_ctx.fillStyle = "#FFFFFF";
		the_ctx.fillRect(0, 0, the_canvas.width, the_canvas.height);
		
		if (loading == false) { //this is perverse but somehow it turns me on
			if (last_timestamp == null) last_timestamp = frame_begin;
			var state_time = window.performance.now()-last_timestamp;
			
			//will need more complex logic here eventually, but for now all state happens instantly
			state_stack[0].world.advance_state();
			
			state_stack[state_stack.length-1].draw(the_canvas, the_ctx);
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
	
	the_canvas.onmousemove = function(e) {
		if (e.layerX == undefined) {
			e.layerX = e.offsetX;
			e.layerY = e.offsetY;
		}
		state_stack[state_stack.length-1].onmousemove(e);
	};
	the_canvas.onmousedown = function(e) {
		//e.button == 0 -> left mouse button
		if (e.layerX == undefined) {
			e.layerX = e.offsetX;
			e.layerY = e.offsetY;
		}
		state_stack[state_stack.length-1].onmousemove(e);
		state_stack[state_stack.length-1].onmousedown(e);
	};
	the_canvas.onmouseup = function(e) {
		if (e.layerX == undefined) {
			e.layerX = e.offsetX;
			e.layerY = e.offsetY;
		}
		state_stack[state_stack.length-1].onmousemove(e);
		state_stack[state_stack.length-1].onmouseup(e);
	};
	the_canvas.onmouseout = function(e) {
		if (e.layerX == undefined) {
			e.layerX = e.offsetX;
			e.layerY = e.offsetY;
		}
		state_stack[state_stack.length-1].onmousemove(e);
		state_stack[state_stack.length-1].onmouseout(e);
	};
	window.requestAnimationFrame(step);
};

if (document.getElementById("game_canvas").getContext != undefined) loadScripts(["script/debug.js", "script/sprite.js", "script/world.js", "script/state.js"], main_function);
