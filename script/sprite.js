"use strict";

//Map of every sprite path to an Image of the sprite
var sprites = {	"Villager": null,
				"Pre-Infected": null,
				"Infected": null,
				"Pre-Explosive": null,
				"Explosive": null,
				"Exploding": null,
				"Blob": null,
				"Dirt1": null,
				"Dirt2": null,
				"Dirt3": null,
				"Dirt4": null,
				"Rock": null,
				"PlayButton": null,
				"LevelButton": null,
				"AboutButton": null,
				"RetryButton": null,
				"ReplayButton": null,
				"MainMenuButton": null,
				"NextLevelButton": null,
				"UnpauseButton": null,
				"ContinueButton": null,
				"Logo":null,
				"Levelone":null,
				"BackButton":null,
			};

//Call this and all the sprites will load eventually
function load_sprites() { //returns function() returns {loaded_sprites: int, max: int}
	//horrifying javascript voodoo to make this work
	var head = document.getElementsByTagName('head')[0];
	var sprites_loaded = 0;
	var max_sprites = 0;
	for (var path in sprites) {
		max_sprites++;
		var img = new Image();
		img.src = "resource/" + path + ".png";
		img.name = path;
		img.onload = function() {sprites[this.name] = this; sprites_loaded++;};
		head.appendChild(img);
	}
	
	return function() {return {loaded_sprites: sprites_loaded, max: max_sprites};};
};
