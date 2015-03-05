"use strict";

var World = function(width_or_name, height) {
	if (height == undefined) {
		var name = width_or_name;
		var level_string = levels[name];
		
		this.h = 0;
		var pos = level_string.indexOf('\n');
		this.w = pos+2;
		while (pos != -1) {
			this.h++;
			pos = level_string.indexOf('\n', pos+1);
		}
		this.h += 2;
		
		this.action_queue = []; //elements are arrays of actions to be executed simultaneously
		this.cells = [];
		this.dirt_ids = [];
		for (var i = 0; i < this.w; i++) {
			this.cells[i] = [];
			this.dirt_ids[i] = [];
			for (var j = 0; j < this.h; j++) {
				this.cells[i][j] = "void"; //elements are (as strings): wall, rock, void, human, infected, explosive
				this.dirt_ids[i][j] = Math.floor(Math.random()*4);
			}
		}
		pos = 0;
		for (var y = 1; y < this.h-1; y++) {
			for (var x = 1; x < this.w-1; x++) {
				switch (level_string.charAt(pos)) {
				case 'v':
					this.cells[x][y] = "human";
					break;
				case 'i':
					this.cells[x][y] = "infected";
					break;
				case 'e':
					this.cells[x][y] = "explosive";
					break;
				case 'r':
					this.cells[x][y] = "rock";
					break;
				case 'b':
					this.cells[x][y] = "void";
					break;
				case '+':
					this.cells[x][y] = null;
					break;
				default:
					console.log("unknown character: \'" + level_string.charAt(pos) + "\'");
				}
				pos++;
				if (level_string.charAt(pos) == '\n') {
					pos++;
				}
			}
		}
	} else {
		var width = width_or_name;
		this.w = width;
		this.h = height;
		this.action_queue = []; //elements are arrays of actions to be executed simultaneously
		this.cells = [];
		this.dirt_ids = [];
		for (var i = 0; i < width; i++) {
			this.cells[i] = [];
			this.dirt_ids[i] = [];
			for (var j = 0; j < height; j++) {
				this.cells[i][j] = null; //elements are (as strings): wall, rock, void, human, infected, explosive
				this.dirt_ids[i][j] = Math.floor(Math.random()*4);
			}
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
				this.cells[action.x][action.y] = null;
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
		next = "explosive";
		this.push_action_back(new Action(pos.x, pos.y, "splosion"));
		break;
	default:
		next = current;
	}
	this.cells[pos.x][pos.y] = next;
};