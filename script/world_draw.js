"use strict";

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
	for (var i = 0; i < this.w; i++) {
		for (var j = 0; j < this.h; j++) {
			//testing crap
			//console.log(this.dirt_ids[i]);
			if (this.cells[i][j] != "void") {
				var dirt_tile = sprites["dirt" + (this.dirt_ids[i][j] + 1)];
				ctx.drawImage(dirt_tile, 0, 0, 48, 48, scale*(i-(this.w/2)), scale*(j-(this.h/2)), 48, 48);
			}
			/*ctx.moveTo(scale*(i-(this.w/2)), scale*(j-(this.h/2)));
			if (i != this.w) ctx.lineTo(scale*(i+1-(this.w/2)), scale*(j-(this.h/2)));
			ctx.moveTo(scale*(i-(this.w/2)), scale*(j-(this.h/2)));
			if (j != this.h) ctx.lineTo(scale*(i-(this.w/2)), scale*(j+1-(this.h/2)));*/
			
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
	var splode_adj = {}; var s_dirs = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}];
	if (this.action_queue.length > 0) {
		for (var a in this.action_queue[0]) {
			var action = this.action_queue[0][a];
			//GHETTOEST SHIT EVER
			action_map["" + action.x + " " + action.y] = action.action;
			if (action.action == "splosion") for (var d in s_dirs) {
				var loc = {x: action.x + s_dirs[d].x, y: action.y + s_dirs[d].y};
				splode_adj["" + loc.x + " " + loc.y] = true;
			}
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
					if (dx+dy == 0 || (this.cells[w_x][w_y] == null && dx+dy == 1)) {
						selector_color = "#00FF00";		
					}
				} else {
					cursor_init = null;
				}
			} else if (this.cells[w_x][w_y] == "human" || this.cells[w_x][w_y] == "infected" || this.cells[w_x][w_y] == "explosive") {
				selector_color = "#00FF00";
			}
		} else if (cursor_init != null) {
			var dr_x = Math.floor(cursor_init.x);
			var dr_y = Math.floor(cursor_init.y);
			if (!(this.cells[dr_x][dr_y] == "human" || this.cells[dr_x][dr_y] == "infected" || this.cells[dr_x][dr_y] == "explosive")) cursor_init = null;
		}
	}

	for (x_start(); x_pred(); x_inc()) {
		for (y_start(); y_pred(); y_inc()) {
			var i = cx;
			var j = cy;
			
			var displacement = {x: 0, y: 0};
			var splode_disp = [];
			var y_off = 0;
			var x_off = 40;
			var cycles_per_state = 2;
			var blob_dist = .1;
			var blob_height = 30;
			var trans_target = null;
			if (action_map["" + i + " " + j] != undefined || (splode_adj["" + i + " " + j] != undefined &&
												(this.cells[i][j] == "human" ||
												this.cells[i][j] == "infected" ||
												this.cells[i][j] == "explosive"))) { //OH GOD WHYYYY
				var action = action_map["" + i + " " + j];
				if (action == undefined) {
					action = "wait";
				}
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
					y_off = 0;
					x_off = Math.floor(time*4*cycles_per_state)%4;
					if (x_off == 3) x_off = 1;
					x_off *= 40;
					break;
				case "wait":
					y_off = null;
					do_trans = true; 
					break;
				case "splosion":
					y_off = null;
					var psd = function(coord) {
						var s_pos = {	x: coord.x*Math.cos(yaw)-coord.y*Math.sin(yaw),
										y: coord.x*Math.sin(yaw)+coord.y*Math.cos(yaw)};
						s_pos.y *= scale_amount;
						splode_disp.push(s_pos);
					};
					psd({x: 0, y: -1});
					psd({x: 1, y: 0});
					psd({x: 0, y: 1});
					psd({x: -1, y: 0});
					break;
				default:
					//do nothing
				}
				
				if (y_off == null) {
					y_off = 0;
				} else if (yaw+Math.PI/4 < Math.PI/2 || yaw+Math.PI/4 >= 4*Math.PI/2) {
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
					if (splode_adj["" + i + " " + j] == true || this.cells[i][j] == "infected" || this.cells[i][j] == "explosive") {
						trans_target = prog[prog.indexOf(this.cells[i][j])];
						//console.log(splode_adj);
					}
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
			
			
			/*if (this.cells[i][j] == "human") {
				var psd = function(coord) {
					var s_pos = {	x: coord.x*Math.cos(yaw)-coord.y*Math.sin(yaw),
									y: coord.x*Math.sin(yaw)+coord.y*Math.cos(yaw)};
					s_pos.y *= scale_amount;
					splode_disp.push(s_pos);
				};
				psd({x: 0, y: -1});
				psd({x: 1, y: 0});
				psd({x: 0, y: 1});
				psd({x: -1, y: 0});
			}*/
			if (splode_disp.length > 0) {
				var ids = [];
				if (yaw < Math.PI/2) {
					ids = [3, 0];
				} else if (yaw < 2*Math.PI/2) {
					ids = [2, 3];
				} else if (yaw < 3*Math.PI/2) {
					ids = [1, 2];
				} else if (yaw < 4*Math.PI/2) {
					ids = [0, 1];
				}
				for (var id in ids) {
					var disp_unit = splode_disp[ids[id]];
					var base_pos = {x: t_pos.x-10, y: t_pos.y-10 - (.5*scale - 8)*scale_amount};
					var scaled_time = time*(1+6*blob_dist);
					for (var p = 0; p < 6; p++) {
						var v_time = scaled_time-p*blob_dist;
						if (v_time <= 1 && v_time >= 0) {
							var pos = {x: base_pos.x, y: base_pos.y};
							pos.x += scale*v_time*disp_unit.x;
							pos.y += scale*v_time*disp_unit.y;
							pos.y -= blob_height*(1-((2*v_time-1)*(2*v_time-1)));
							ctx.drawImage(sprites["blob"], 20*p, 0, 20, 20, pos.x, pos.y, 20, 20);
						}
					}
				}
			}
			
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
			case "rock": {
				ctx.drawImage(sprites["Rock"], 0, 0, 40, 40, t_pos.x-20, t_pos.y-35, 40, 40);
			}
			case "void":
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
			if (splode_disp.length > 0) {
				var ids = [];
				if (yaw < Math.PI/2) {
					ids = [1, 2];
				} else if (yaw < 2*Math.PI/2) {
					ids = [0, 1];
				} else if (yaw < 3*Math.PI/2) {
					ids = [3, 0];
				} else if (yaw < 4*Math.PI/2) {
					ids = [2, 3];
				}
				for (var id in ids) {
					var disp_unit = splode_disp[ids[id]];
					var base_pos = {x: t_pos.x-10, y: t_pos.y-10 - (.5*scale - 8)*scale_amount};
					var scaled_time = time*(1+6*blob_dist);
					for (var p = 6; p >= 0; p--) {
						var v_time = scaled_time-p*blob_dist;
						if (v_time <= 1 && v_time >= 0) {
							var pos = {x: base_pos.x, y: base_pos.y};
							pos.x += scale*v_time*disp_unit.x;
							pos.y += scale*v_time*disp_unit.y;
							pos.y -= blob_height*(1-((2*v_time-1)*(2*v_time-1)));
							ctx.drawImage(sprites["blob"], 20*p, 0, 20, 20, pos.x, pos.y, 20, 20);
						}
					}
				}
			}
		}
	}
};