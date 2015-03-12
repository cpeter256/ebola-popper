"use strict";

function WorldState(levelname, par, canvas, push_state, pop_state) {
	State.apply(this, [push_state, pop_state]);
	this.world = new World(levelname);
	this.type = "world";
	this.draw_children = false;
	
	this.num_moves = 0;
	this.par = par;

	this.move_max = 1000;	//ms
	this.wait_max = 250;
	this.splode_max = 500;
	this.state_time = 0;
	this.state_max = null;
	
	this.view_yaw = Math.PI*.15;
	this.view_pitch = Math.PI*.3;
	this.max_pitch = Math.PI*.49;
	this.view_scale = 48;
	
	this.canvas_w = canvas.width;
	this.canvas_h = canvas.height;
	this.canvas = canvas;
	
	this.mouse_pos = {x: 0, y: 0};
	this.drag_pos = null;
	this.valid_move = true;
	this.dragging_board = false;
	
	this.d_yaw = 0;
	this.d_pitch = 0;
	
	if(levelname == "level_1") this.level = 1;
	if(levelname == "level_2") this.level = 2;
	if(levelname == "level_3") this.level = 3;
	if(levelname == "level_4") this.level = 4;
	if(levelname == "level_5") this.level = 5;
	if(levelname == "level_6") this.level = 6;
	if(levelname == "level_7") this.level = 7;
	if(levelname == "level_8") this.level = 8;
	if(levelname == "level_9") this.level = 9;
	if(levelname == "level_10") this.level = 10;
	if(levelname == "level_11") this.level = 11;
	if(levelname == "level_12") this.level = 12;
	if(levelname == "level_13") this.level = 13;
	if(levelname == "level_14") this.level = 14;
	if(levelname == "level_15") this.level = 15;
}
WorldState.prototype = Object.create(State.prototype);
WorldState.prototype.constructor = WorldState;

/*WorldState.prototype.force_pop = function() {
	this.pop_state(this);
};*/

WorldState.prototype.handle_max_state = function() {
	if (this.state_max == null && this.world.action_queue.length > 0) {
		//oh god this hack
		this.world.do_sound();
		
		this.state_max = this.move_max;
		if (this.world.action_queue[0][0].action == "splosion") {
			this.state_max = this.splode_max;
		} else if (this.world.action_queue[0][0].action == "wait") {
			this.state_max = this.wait_max;
		}
	}
};

WorldState.prototype.draw = function(canvas, ctx) {
	this.handle_max_state();
	var state_percent = 0;
	if (this.state_max != null) state_percent = this.state_time/this.state_max;
	if (state_percent > 1) state_percent = 1;
	
	var cursor_to = null;
	var drag_orig = null;
	if (!this.dragging_board && this.state_max == null) {
		cursor_to = this.world.screen_to_world(
					this.mouse_pos, this.canvas_w/2, this.canvas_h/2, this.view_scale, this.view_yaw, this.view_pitch);
		if (this.drag_pos != null) drag_orig = this.world.screen_to_world(
					this.drag_pos, this.canvas_w/2, this.canvas_h/2, this.view_scale, this.view_yaw, this.view_pitch);
	}
													
	this.world.draw(ctx, state_percent, canvas.width/2, canvas.height/2, this.view_scale, this.view_yaw+this.d_yaw, this.view_pitch+this.d_pitch, cursor_to, drag_orig);

	ctx.fillStyle = "#000000";
	ctx.fillText("" + this.num_moves + (this.num_moves == 1 ? " move" : " moves"), 2, 9);
	ctx.fillText("Level " + (this.level), 2, 18);
	ctx.fillText("Par is " + this.par, 2, 27);
};
WorldState.prototype.advance = function() {
	var status = this.world.advance_state();
	this.state_max = null;
	this.handle_max_state();
	if (status != null) {
		switch (status) {
		case "win":
			this.push_state(new LevelOverState(this.par, this.num_moves, true, this.canvas, this.push_state, this.pop_state_raw));
			//console.log("TESTING: stage won!");
			break;
		case "lose":
			this.push_state(new LevelOverState(this.par, this.num_moves, false, this.canvas, this.push_state, this.pop_state_raw));
			//console.log("TESTING: stage lost!");
			break;
		default:
			console.log("Something terrible has occurred!");
		}
	}
};
WorldState.prototype.onmousemove = function(e) {
	this.mouse_pos.x = e.layerX;
	this.mouse_pos.y = e.layerY;
	
	if (this.dragging_board) {
		var pitch_scale = Math.cos(this.view_pitch+this.d_pitch);
		var abs_dyaw = Math.atan2((this.mouse_pos.y-this.canvas_h/2)/pitch_scale, this.mouse_pos.x-this.canvas_w/2);
		this.d_yaw = abs_dyaw-Math.atan2((this.drag_pos.y-this.canvas_h/2)/pitch_scale, this.drag_pos.x-this.canvas_w/2);
		/*var abs_dscale = Math.abs((mouse_pos.y-(the_canvas.height/2))/(test_world.h*48/2));
		var init_dscale = Math.abs((drag_pos.y-(the_canvas.height/2))/(test_world.h*48/2));
		var abs_dpitch = Math.acos(Math.min(1, abs_dscale));
		var init_dpitch = Math.acos(Math.min(1, init_dscale));
		d_pitch = Math.sin(abs_dyaw)*(abs_dpitch-init_dpitch);*/
		if (this.view_pitch+this.d_pitch > this.max_pitch) this.d_pitch = this.max_pitch-this.view_pitch;
		if (this.view_pitch+this.d_pitch < 0) this.d_pitch = -this.view_pitch;
	}
};
WorldState.prototype.onmousedown = function(e) {
	if (e.button == 0) {
		if (this.drag_pos != null) {
			console.log("Something broke! (double drag init)");
		}
		this.drag_pos = {x: this.mouse_pos.x, y: this.mouse_pos.y}; //good god js is horrifying
		
		var world_loc = this.world.screen_to_world(this.mouse_pos, this.canvas_w/2, this.canvas_h/2, this.view_scale, this.view_yaw, this.view_pitch);
		if (world_loc.x < 0 || world_loc.x > this.world.w ||
			world_loc.y < 0 || world_loc.y > this.world.h) {
			this.dragging_board = true;
		} else {
			this.valid_move = this.state_max == null;
		}
	}
};
WorldState.prototype.onmouseup = function(e) {
	if (e.button == 0) {
		if (this.drag_pos == null) {
			//this is actually pretty normal
			//console.log("Something broke! (double drag release)");
		} else if (this.dragging_board == false) {
			if (this.valid_move) {
				var did_move = this.world.handle_input(
									this.world.screen_to_world(this.drag_pos, this.canvas_w/2, this.canvas_h/2, this.view_scale, this.view_yaw, this.view_pitch),
									this.world.screen_to_world(this.mouse_pos, this.canvas_w/2, this.canvas_h/2, this.view_scale, this.view_yaw, this.view_pitch));
				if (did_move) this.num_moves++;
			}
		} else {
			this.view_yaw += this.d_yaw;
			this.view_pitch += this.d_pitch;
			while (this.view_yaw > Math.PI*2) this.view_yaw -= Math.PI*2;
			while (this.view_yaw < 0) this.view_yaw += Math.PI*2;
			this.d_yaw = 0;
			this.d_pitch = 0;
		}
		
		this.drag_pos = null;
		this.dragging_board = false;
	}
};
WorldState.prototype.onkeydown = function(keycode) {
	if (keycode == 27) { //escape
		this.onmouseout({button: 0});
		this.push_state(new PauseState(this.canvas, this.push_state, this.pop_state_raw));
	}
};