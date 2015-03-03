"use strict";

function WorldState(width, height, canvas, push_state, pop_state) {
	State.apply(this, [push_state, pop_state]);
	this.world = new World(width, height);
	this.type = "world";
	
	this.view_yaw = Math.PI*.25;
	this.view_pitch = Math.PI*.3;
	this.max_pitch = Math.PI*.49;
	this.view_scale = 48;
	
	this.canvas_w = canvas.width;
	this.canvas_h = canvas.height;
	
	this.mouse_pos = {x: 0, y: 0};
	this.drag_pos = null;
	this.dragging_board = false;
	
	this.d_yaw = 0;
	this.d_pitch = 0;
	
	//smelly test shit
	//hardcoding a level yeaaaaaa
	this.world.cells[1][0] = "human";
	this.world.cells[1][2] = "explosive";
	this.world.cells[3][1] = "explosive";
	this.world.cells[3][2] = "explosive";
	this.world.cells[4][2] = "explosive";
	this.world.cells[4][3] = "explosive";
	this.world.cells[5][3] = "explosive";
	this.world.cells[5][4] = "explosive";
	this.world.cells[5][5] = "explosive";
}
WorldState.prototype = Object.create(State.prototype);
WorldState.prototype.constructor = WorldState;
WorldState.prototype.draw = function(canvas, ctx) {
	this.world.draw(ctx, canvas.width/2, canvas.height/2, this.view_scale, this.view_yaw+this.d_yaw, this.view_pitch+this.d_pitch);
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
		}
	}
};
WorldState.prototype.onmouseup = function(e) {
	if (e.button == 0) {
		if (this.drag_pos == null) {
			//this is actually pretty normal
			//console.log("Something broke! (double drag release)");
		} else if (this.dragging_board == false) {
			this.world.handle_input(this.world.screen_to_world(this.drag_pos, this.canvas_w/2, this.canvas_h/2, this.view_scale, this.view_yaw, this.view_pitch),
									this.world.screen_to_world(this.mouse_pos, this.canvas_w/2, this.canvas_h/2, this.view_scale, this.view_yaw, this.view_pitch));
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
WorldState.prototype.onkeydown = function(key) {
	if (key == "Esc" || key == "Escape") {
		this.onmouseout({button: 0});
		this.push_state(new PauseState(this.push_state, this.pop_state_raw));
	}
};