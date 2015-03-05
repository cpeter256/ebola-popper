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
	//this is no longer testing code
	var the_canvas = document.getElementById("game_canvas");
	var the_ctx = the_canvas.getContext("2d");
	//OH GOD BROWSERS
	the_ctx.imageSmoothingEnabled = false;
	the_ctx.mozImageSmoothingEnabled = false;
	the_ctx.webkitImageSmoothingEnabled = false;
	
	var state_stack = [];
	function stack_top() {return state_stack[state_stack.length-1];};
	function push_state(state) {
		state_stack.push(state);
	};
	function pop_state(state) {
		if (stack_top() === state) { //because encapsulation
			state_stack.pop();
		}
	};
	state_stack.push(new WorldState(9, 9, the_canvas, push_state, pop_state));
	
	var loading = null;
	var get_loadstatus = null;
	
	var last_timestamp = null;
	function step(frame_begin) {
		//clear framebuffer
		the_ctx.fillStyle = "#FFFFFF";
		the_ctx.clearRect(0, 0, the_canvas.width, the_canvas.height);
		
		if (loading == false) { //this is perverse but somehow it turns me on
			if (last_timestamp == null) last_timestamp = frame_begin;
			
			if (stack_top().type != "world") {
				var w_id = 0;
				while (state_stack[w_id].type != "world") {
					w_id++;
					if (w_id > state_stack.length) {
						console.log("something terrible happened");
						break;
					}
				}
				last_timestamp = frame_begin-state_stack[w_id].state_time;
			} else if (stack_top().world.action_queue.length == 0) {
				last_timestamp = frame_begin;
			} else if (stack_top().state_max == null) { //idle
				stack_top().state_time = 0;
			} else if (stack_top().state_time >= stack_top().state_max) { //ready to advance
				stack_top().state_time = 0;
				stack_top().advance();
				last_timestamp = frame_begin;
			} else { //transitioning
				stack_top().valid_move = false;
				stack_top().state_time = window.performance.now()-last_timestamp;
			}
			
			var bottom_state = state_stack.length-1;
			while (bottom_state > 0 && state_stack[bottom_state].draw_children) bottom_state--;
			for (var i = bottom_state; i < state_stack.length; i++) {
				state_stack[i].draw(the_canvas, the_ctx);
			}
		} else if (loading == null) {
			//Anthony: Could we load sprites outside of the animationframe step? I'd prefer to not have to Load sprites in the menu's constructor
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
		stack_top().onmousemove(e);
	};
	the_canvas.onmousedown = function(e) {
		//e.button == 0 -> left mouse button
		if (e.layerX == undefined) {
			e.layerX = e.offsetX;
			e.layerY = e.offsetY;
		}
		stack_top().onmousemove(e);
		stack_top().onmousedown(e);
	};
	the_canvas.onmouseup = function(e) {
		if (e.layerX == undefined) {
			e.layerX = e.offsetX;
			e.layerY = e.offsetY;
		}
		stack_top().onmousemove(e);
		stack_top().onmouseup(e);
	};
	
	var mouse_in = false;
	the_canvas.onmouseout = function(e) {
		mouse_in = false;
		if (e.layerX == undefined) {
			e.layerX = e.offsetX;
			e.layerY = e.offsetY;
		}
		stack_top().onmousemove(e);
		stack_top().onmouseout(e);
	};
	the_canvas.onmouseover = function(e) {
		mouse_in = true;
	};
	
	//ugly key handling input. why oh why does js have to repeat keydown events???
	var last_keycode = null;
	window.addEventListener('keyup', function(e) {last_keycode = null;});
	window.addEventListener('keydown', function(e) {
		if (mouse_in && e.keyCode != last_keycode) {
			stack_top().onkeydown(e.key);
		}
		last_keycode = e.keyCode;
	}, false);
	window.requestAnimationFrame(step);
};

if (document.getElementById("game_canvas").getContext != undefined)
	loadScripts([	"script/debug.js", "script/sprite.js", "script/world.js",
					"script/state.js", "script/worldstate.js", "script/pausestate.js",
				], main_function);
