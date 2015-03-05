"use strict";

var World = function(width, height) {
	this.w = width;
	this.h = height;
	this.action_queue = []; //elements are arrays of actions to be executed simultaneously
	this.cells = [];
	for (var i = 0; i < width; i++) {
		this.cells[i] = [];
		for (var j = 0; j < height; j++) {
			this.cells[i][j] = null; //elements are (as strings): wall, rock, void, human, infected, explosive
		}
	}
};
World.prototype.push_actions = function(actions) { //takes an array
	this.action_queue.push(actions);
};
World.prototype.push_action_back = function(action) {
	if (this.action_queue.length == 0) this.push_actions([]);
	this.action_queue[this.action_queue.length-1].push(action);
};

World.prototype.screen_to_world = function(mouse, x, y, scale, yaw, pitch) { //mouse = {x: num, y: num}
	var result = {x: mouse.x, y: mouse.y};
	result.x -= x;
	result.y -= y;
	result.x /= scale;
	result.y /= scale;
	
	var scale_amount = Math.cos(pitch);
	result.y /= scale_amount;
	
	result = {	x: result.x*Math.cos(-yaw)-result.y*Math.sin(-yaw),
				y: result.x*Math.sin(-yaw)+result.y*Math.cos(-yaw)};
				
	result.x += this.w/2;
	result.y += this.h/2;
	//console.log(result);
	return result;
};
World.prototype.handle_input = function(start, end) { //start, end = {x: num, y: num}
	//ignore it if there's still actions in the queue- player cant do actions while previous turn isnt over
	if (this.action_queue.length == 0) {
		//get cell contents at start
		var cell_pos = {x: Math.floor(start.x), y: Math.floor(start.y)};
		if (cell_pos.x < 0 || cell_pos.x >= this.w || cell_pos.y < 0 || cell_pos.y >= this.h) return;
		var actor = this.cells[cell_pos.x][cell_pos.y];
		
		//ignore if the actor is unmovable
		if (actor == null || actor == "wall" || actor == "rock" || actor == "void") return;
		
		//queue an action to move it to end (via left, right, up, down)
		//make sure end is actually valid though
		var end_pos = {x: Math.floor(end.x), y: Math.floor(end.y)};
		if (end_pos.x < 0 || end_pos.x >= this.w || end_pos.y < 0 || end_pos.y >= this.h) return;
		
		//ignore if the space is occupied (and not staying in place)
		actor = this.cells[end_pos.x][end_pos.y];
		if (actor != null && (cell_pos.x != end_pos.x || cell_pos.y != end_pos.y)) return;
		
		var dir = null;
		if (end_pos.x == cell_pos.x && end_pos.y == cell_pos.y) {
			dir = "wait";
		} else if (end_pos.x == cell_pos.x) {
			if (end_pos.y == cell_pos.y+1) dir = "down";
			else if (end_pos.y == cell_pos.y-1) dir = "up";
		} else if (end_pos.y == cell_pos.y) {
			if (end_pos.x == cell_pos.x+1) dir = "right";
			else if (end_pos.x == cell_pos.x-1) dir = "left";
		}
		
		if (dir != null) {
			this.action_queue.push([new Action(cell_pos.x, cell_pos.y, dir)]);
		}
	}
};

//HERE BE DRAGONS
World.prototype.draw = function(ctx, time, x, y, scale, yaw, pitch, cursor_to, cursor_init) { //x, y are center, yaw, pitch are radians, 0 pitch = top-down
	ctx.fillStyle = "#000000";
	ctx.fillText(time, 2, 9);
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
			//testing crap
			ctx.moveTo(scale*(i-(this.w/2)), scale*(j-(this.h/2)));
			if (i != this.w) ctx.lineTo(scale*(i+1-(this.w/2)), scale*(j-(this.h/2)));
			ctx.moveTo(scale*(i-(this.w/2)), scale*(j-(this.h/2)));
			if (j != this.h) ctx.lineTo(scale*(i-(this.w/2)), scale*(j+1-(this.h/2)));
			
			/*if (i != this.w && j != this.h && i == Math.floor(test_loc.x) && j == Math.floor(test_loc.y)) {
				ctx.moveTo(scale*(i-(this.w/2)), scale*(j-(this.h/2)));
				ctx.lineTo(scale*(i+1-(this.w/2)), scale*(j+1-(this.h/2)));
			}*/
			//ctx.moveTo(scale*(0-.5-(this.w/2)), scale*(0+.5-(this.h/2)));
			//ctx.lineTo(scale*(0+.5-(this.w/2)), scale*(0-.5-(this.h/2)));
		}
	}
	ctx.stroke();
	ctx.restore();
	
	
	//Reeks of smell, beware!
	var cx = 0;
	var cy = 0;
	
	var x_start;
	var x_pred;
	var x_inc;
	var y_start;
	var y_pred;
	var y_inc;
	
	var max_x = this.w;
	var max_y = this.h;
	
	if (yaw < Math.PI/4) {
		x_start = function() {cy = 0;};
		x_pred = function() {return cy < max_y;};
		x_inc = function() {cy++;};
		y_start = function() {cx = 0;};
		y_pred = function() {return cx < max_x;};
		y_inc = function() {cx++;};
	} else if (yaw < 2*Math.PI/4) {
		x_start = function() {cx = 0;};
		x_pred = function() {return cx < max_x;};
		x_inc = function() {cx++;};
		y_start = function() {cy = 0;};
		y_pred = function() {return cy < max_y;};
		y_inc = function() {cy++;};
	} else if (yaw < 3*Math.PI/4) {
		x_start = function() {cx = 0;};
		x_pred = function() {return cx < max_x;};
		x_inc = function() {cx++;};
		y_start = function() {cy = max_y-1;};
		y_pred = function() {return cy >= 0;};
		y_inc = function() {cy--;};
	} else if (yaw < 4*Math.PI/4) {
		x_start = function() {cy = max_y-1;};
		x_pred = function() {return cy >= 0;};
		x_inc = function() {cy--;};
		y_start = function() {cx = 0;};
		y_pred = function() {return cx < max_x;};
		y_inc = function() {cx++;};
	} else if (yaw < 5*Math.PI/4) {
		x_start = function() {cy = max_y-1;};
		x_pred = function() {return cy >= 0;};
		x_inc = function() {cy--;};
		y_start = function() {cx = max_x-1;};
		y_pred = function() {return cx >= 0;};
		y_inc = function() {cx--;};
	} else if (yaw < 6*Math.PI/4) {
		x_start = function() {cx = max_x-1;};
		x_pred = function() {return cx >= 0;};
		x_inc = function() {cx--;};
		y_start = function() {cy = max_y-1;};
		y_pred = function() {return cy >= 0;};
		y_inc = function() {cy--;};
	} else if (yaw < 7*Math.PI/4) {
		x_start = function() {cx = max_x-1;};
		x_pred = function() {return cx >= 0;};
		x_inc = function() {cx--;};
		y_start = function() {cy = 0;};
		y_pred = function() {return cy < max_y;};
		y_inc = function() {cy++;};
	} else if (yaw < 8*Math.PI/4) {
		x_start = function() {cy = 0;};
		x_pred = function() {return cy < max_y;};
		x_inc = function() {cy++;};
		y_start = function() {cx = max_x-1;};
		y_pred = function() {return cx >= 0;};
		y_inc = function() {cx--;};
	} else {
		//	
        //             .     _///_,
        //           .      / ` ' '>
        //             )   o'  __/_'>
        //            (   /  _/  )_\'>
        //             ' "__/   /_/\_>
        //                 ____/_/_/_/
        //                /,---, _/ /
        //               ""  /_/_/_/
        //                  /_(_(_(_                 \
        //                 (   \_\_\\_               )\
        //                  \'__\_\_\_\__            ).\
        //                  //____|___\__)           )_/
        //                  |  _  \'___'_(           /'
        //                   \_ (-'\'___'_\      __,'_'
        //                   __) \  \\___(_   __/.__,'
        //                ,((,-,__\  '", __\_/. __,'
        //                             '"./_._._-'
		console.log("Something terrible has ocurred!");
		x_start = function() {};
		x_pred = function() {};
		x_inc = function() {};
		y_start = function() {};
		y_inc = function() {};
		y_pred = function() {};
	}
	var action_map = {};
	if (this.action_queue.length > 0) {
		for (var a in this.action_queue[0]) {
			var action = this.action_queue[0][a];
			//GHETTOEST SHIT EVER
			action_map["" + action.x + " " + action.y] = action.action;
		}
	}

	var selector_height = 4;
	var selector_color = "#FF0000";
	var init_color = "#0000FF";
	if (cursor_to != null) {
		var w_x = Math.floor(cursor_to.x);
		var w_y = Math.floor(cursor_to.y);
		if (w_x >= 0 && w_x < this.w && w_y >= 0 && w_y < this.h) {
			if (cursor_init != null) {
				var dr_x = Math.floor(cursor_init.x);
				var dr_y = Math.floor(cursor_init.y);
				if (dr_x == w_x && dr_y == w_y) cursor_init = null;
				//console.log(cursor_init);
				if (this.cells[dr_x][dr_y] == "human" || this.cells[dr_x][dr_y] == "infected" || this.cells[dr_x][dr_y] == "explosive") {
					var dx = Math.abs(w_x-dr_x);
					var dy = Math.abs(w_y-dr_y);
					//console.log(dx+dy);
					if (dx+dy == 0 || (!(this.cells[w_x][w_y] == "human" || this.cells[w_x][w_y] == "infected" || this.cells[w_x][w_y] == "explosive") &&
						dx+dy == 1)) {
						selector_color = "#00FF00";		
					}
				} else {
					cursor_init = null;
				}
			} else if (this.cells[w_x][w_y] == "human" || this.cells[w_x][w_y] == "infected" || this.cells[w_x][w_y] == "explosive") {
				selector_color = "#00FF00";
			}
		}
	}

	for (x_start(); x_pred(); x_inc()) {
		for (y_start(); y_pred(); y_inc()) {
			var i = cx;
			var j = cy;
			
			var displacement = {x: 0, y: 0};
			var y_off = 0;
			var x_off = 40;
			var cycles_per_state = 2;
			var trans_target = null;
			if (action_map["" + i + " " + j]) { //OH GOD WHYYYY
				var action = action_map["" + i + " " + j];
				var do_trans = false;
				
				switch (action) {
				case "left":
					displacement.x = -time;
					do_trans = true;
					y_off = 120;
					x_off = Math.floor(time*4*cycles_per_state)%4;
					if (x_off == 3) x_off = 1;
					x_off *= 40;
					break;
				case "right":
					displacement.x = time;
					do_trans = true;
					y_off = 40;
					x_off = Math.floor(time*4*cycles_per_state)%4;
					if (x_off == 3) x_off = 1;
					x_off *= 40;
					break;
				case "up":
					displacement.y = -time;
					do_trans = true;
					y_off = 80;
					x_off = Math.floor(time*4*cycles_per_state)%4;
					if (x_off == 3) x_off = 1;
					x_off *= 40;
					break;
				case "down":
					displacement.y = time;
					do_trans = true;
					x_off = Math.floor(time*4*cycles_per_state)%4;
					if (x_off == 3) x_off = 1;
					x_off *= 40;
					break;
				default:
					//do nothing
				}
				
				if (yaw+Math.PI/4 < Math.PI/2) {
					y_off += 0;
				} else if (yaw+Math.PI/4 < 2*Math.PI/2) {
					y_off += 120;
				} else if (yaw+Math.PI/4 < 3*Math.PI/2) {
					y_off += 80;
				} else if (yaw+Math.PI/4 < 4*Math.PI/2) {
					y_off += 40;
				}
				y_off %= 160;
				
				if (do_trans) {
					var prog = ["human", "infected", "explosive", "explosive"];
					if (this.cells[i][j] == "infected" || this.cells[i][j] == "explosive") 
						trans_target = prog[prog.indexOf(this.cells[i][j])];
				}
			}
			
			if (cursor_init != null && Math.floor(cursor_init.x) == i && Math.floor(cursor_init.y) == j) {
				ctx.save();
				ctx.translate(x, y-selector_height);
				
				//var scale_amount = Math.cos(pitch);
				ctx.scale(1, scale_amount);
				
				ctx.rotate(yaw);
				
				ctx.translate(-scale*this.w/2, -scale*this.h/2);
				
				ctx.strokeStyle = init_color;
				ctx.beginPath();
				
				if (yaw < Math.PI/2) {
					ctx.moveTo(i*scale, (j+1)*scale);
					ctx.lineTo(i*scale, j*scale);
					ctx.lineTo((i+1)*scale, j*scale);
				} else if (yaw < 2*Math.PI/2) {
					ctx.moveTo(i*scale, j*scale);
					ctx.lineTo(i*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, (j+1)*scale);
				} else if (yaw < 3*Math.PI/2) {
					ctx.moveTo(i*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, j*scale);
				} else if (yaw < 4*Math.PI/2) {
					ctx.moveTo((i+1)*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, j*scale);
					ctx.lineTo(i*scale, j*scale);
				}
			
				ctx.stroke();
				ctx.restore();
			}
			if (cursor_to != null && Math.floor(cursor_to.x) == i && Math.floor(cursor_to.y) == j) {
				ctx.save();
				ctx.translate(x, y-selector_height);
				
				//var scale_amount = Math.cos(pitch);
				ctx.scale(1, scale_amount);
				
				ctx.rotate(yaw);
				
				ctx.translate(-scale*this.w/2, -scale*this.h/2);
				
				ctx.strokeStyle = selector_color;
				ctx.beginPath();
				
				if (yaw < Math.PI/2) {
					ctx.moveTo(i*scale, (j+1)*scale);
					ctx.lineTo(i*scale, j*scale);
					ctx.lineTo((i+1)*scale, j*scale);
				} else if (yaw < 2*Math.PI/2) {
					ctx.moveTo(i*scale, j*scale);
					ctx.lineTo(i*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, (j+1)*scale);
				} else if (yaw < 3*Math.PI/2) {
					ctx.moveTo(i*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, j*scale);
				} else if (yaw < 4*Math.PI/2) {
					ctx.moveTo((i+1)*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, j*scale);
					ctx.lineTo(i*scale, j*scale);
				}
			
				ctx.stroke();
				ctx.restore();
			}
			
			var t_pos = {	x: scale*(i+displacement.x+.5-(this.w/2)),
							y: scale*(j+displacement.y+.5-(this.h/2))};
			t_pos = {	x: t_pos.x*Math.cos(yaw)-t_pos.y*Math.sin(yaw),
						y: t_pos.x*Math.sin(yaw)+t_pos.y*Math.cos(yaw)};
			t_pos.y *= scale_amount;
			t_pos.x += x; t_pos.y += y + (.5*scale - 8)*scale_amount;
			
			switch (this.cells[i][j]) {
			case "human":
				ctx.drawImage(sprites["Villager"], x_off, 2+y_off, 40, 38, t_pos.x-20, t_pos.y-38, 40, 38);
				if (trans_target != null) {
					ctx.globalAlpha = time;
					ctx.drawImage(sprites["Infected"], x_off, 2+y_off, 40, 38, t_pos.x-20, t_pos.y-38, 40, 38);
					ctx.globalAlpha = 1;
				}
				break;
			case "infected":
				ctx.drawImage(sprites["Infected"], x_off, 2+y_off, 40, 38, t_pos.x-20, t_pos.y-38, 40, 38);
				if (trans_target != null) {
					ctx.globalAlpha = time;
					ctx.drawImage(sprites["Explosive"], x_off, 2+y_off, 40, 38, t_pos.x-20, t_pos.y-38, 40, 38);
					ctx.globalAlpha = 1;
				}
				break;
			case "explosive":
				ctx.drawImage(sprites["Explosive"], x_off, 2+y_off, 40, 38, t_pos.x-20, t_pos.y-38, 40, 38);
				break;
			case null:
				break;
			default:
				//if (Math.floor(test_loc.x) == i && Math.floor(test_loc.y) == j) {
				//	ctx.fillStyle = "#00FF00";
				//} else {
					ctx.fillStyle = "#FF0000";
				//}
				ctx.fillRect(t_pos.x-scale*.25, t_pos.y-scale, scale*.5, scale);
				ctx.strokeStyle = "#000000";
				ctx.beginPath();
				ctx.moveTo(t_pos.x-scale*.25, t_pos.y-scale);
				ctx.lineTo(t_pos.x+scale*.25, t_pos.y);
				ctx.moveTo(t_pos.x+scale*.25, t_pos.y-scale);
				ctx.lineTo(t_pos.x-scale*.25, t_pos.y);
				
				ctx.stroke();
			}
			
			if (cursor_to != null && Math.floor(cursor_to.x) == i && Math.floor(cursor_to.y) == j) {
				ctx.save();
				ctx.translate(x, y-selector_height);
				
				//var scale_amount = Math.cos(pitch);
				ctx.scale(1, scale_amount);
				
				ctx.rotate(yaw);
				
				ctx.translate(-scale*this.w/2, -scale*this.h/2);
				
				ctx.strokeStyle = selector_color;
				ctx.beginPath();
				
				if (yaw < Math.PI/2) {
					ctx.moveTo(i*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, j*scale);
				} else if (yaw < 2*Math.PI/2) {
					ctx.moveTo(i*scale, j*scale);
					ctx.lineTo((i+1)*scale, j*scale);
					ctx.lineTo((i+1)*scale, (j+1)*scale);
				} else if (yaw < 3*Math.PI/2) {
					ctx.moveTo(i*scale, (j+1)*scale);
					ctx.lineTo(i*scale, j*scale);
					ctx.lineTo((i+1)*scale, j*scale);
				} else if (yaw < 4*Math.PI/2) {
					ctx.moveTo((i+1)*scale, (j+1)*scale);
					ctx.lineTo(i*scale, (j+1)*scale);
					ctx.lineTo(i*scale, j*scale);
				}
			
				ctx.stroke();
				ctx.restore();
			}
			if (cursor_init != null && Math.floor(cursor_init.x) == i && Math.floor(cursor_init.y) == j) {
				ctx.save();
				ctx.translate(x, y-selector_height);
				
				//var scale_amount = Math.cos(pitch);
				ctx.scale(1, scale_amount);
				
				ctx.rotate(yaw);
				
				ctx.translate(-scale*this.w/2, -scale*this.h/2);
				
				ctx.strokeStyle = init_color;
				ctx.beginPath();
				
				if (yaw < Math.PI/2) {
					ctx.moveTo(i*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, (j+1)*scale);
					ctx.lineTo((i+1)*scale, j*scale);
				} else if (yaw < 2*Math.PI/2) {
					ctx.moveTo(i*scale, j*scale);
					ctx.lineTo((i+1)*scale, j*scale);
					ctx.lineTo((i+1)*scale, (j+1)*scale);
				} else if (yaw < 3*Math.PI/2) {
					ctx.moveTo(i*scale, (j+1)*scale);
					ctx.lineTo(i*scale, j*scale);
					ctx.lineTo((i+1)*scale, j*scale);
				} else if (yaw < 4*Math.PI/2) {
					ctx.moveTo((i+1)*scale, (j+1)*scale);
					ctx.lineTo(i*scale, (j+1)*scale);
					ctx.lineTo(i*scale, j*scale);
				}
			
				ctx.stroke();
				ctx.restore();
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
World.prototype.advance_state = function() {
	//pop front of action queue, push relevant actions onto action queue, update cells
	//remember: action queue is a 2d array- actions[x][y] means an action that takes place x turns from now. All actions with the same y happen simultaneously.
	//PRECONDITION: there should be no conflicts between actions with the same y. Seriously this shouldn't happen, and we can make sure of that.
	
	if (this.action_queue.length > 0) {
		var actions = this.action_queue.shift();
		for (var i in actions) {
			var action = actions[i];
			//console.log(action);
			switch (action.action) {
			case "left":
				var npos = this.move({x: action.x, y: action.y}, {x: -1, y: 0});
				this.advance_infection(npos);
				break;
			case "right":
				var npos = this.move({x: action.x, y: action.y}, {x: 1, y: 0});
				this.advance_infection(npos);
				break;
			case "up":
				var npos = this.move({x: action.x, y: action.y}, {x: 0, y: -1});
				this.advance_infection(npos);
				break;
			case "down":
				var npos = this.move({x: action.x, y: action.y}, {x: 0, y: 1});
				this.advance_infection(npos);
				break;
			case "wait":
				var npos = {x: action.x, y: action.y};
				this.advance_infection(npos);
				break;
			case "splosion":
				var adj = [	{x: action.x-1, y: action.y},
							{x: action.x+1, y: action.y},
							{x: action.x, y: action.y-1},
							{x: action.x, y: action.y+1},
							];
				for (var j in adj) {
					//console.log(adj[j]);
					if (adj[j].x >= 0 && adj[j].x < this.w && adj[j].y >= 0 && adj[j].y < this.h) {
						this.advance_infection(adj[j], true);
					}
				}
				break;
			default:
				console.log("Action \"" + action.action + "\" not yet supported");
			}
		}
	}
};
World.prototype.move = function(pos, vec) { //no error checking
	var npos = {x: pos.x + vec.x, y: pos.y + vec.y};
	this.cells[npos.x][npos.y] = this.cells[pos.x][pos.y];
	this.cells[pos.x][pos.y] = null;
	return npos;
};
World.prototype.advance_infection = function(pos, force) { //also no (positional) error checking
	if (force === undefined) force = false;
	var current = this.cells[pos.x][pos.y];
	var next = "error";
	switch (current) {
	case "human":
		if (force) next = "infected";
		else next = "human";
		break;
	case "infected":
		next = "explosive";
		break;
	case "explosive":
		next = null;
		this.push_action_back(new Action(pos.x, pos.y, "splosion"));
		break;
	default:
		next = current;
	}
	this.cells[pos.x][pos.y] = next;
};
