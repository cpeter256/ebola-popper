"use strict";

function State(push_state, pop_state) {
	this.draw_children = true;
	this.type = "abstract";
	this.push_state = push_state;
	this.pop_state_raw = pop_state;
	this.pop_state = function() {this.pop_state_raw(this);};
};
State.prototype.draw = function(canvas, ctx) {};
State.prototype.onmousemove = function(e) {};
State.prototype.onmousedown = function(e) {};
State.prototype.onmouseup = function(e) {};
State.prototype.onmouseout = function(e) {this.onmouseup(e);};
State.prototype.onkeydown = function(key) {};
