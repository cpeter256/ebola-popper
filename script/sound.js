"use strict";

//Map of every sound path to an Audio of the sound
var sounds = {	"BloodExplosionSound": null,
			};

//Call this and all the sprites will load eventually
function load_sounds() { //returns function() returns {loaded_sounds: int, max: int}
	//horrifying javascript voodoo to make this work
	var head = document.getElementsByTagName('head')[0];
	var sounds_loaded = 0;
	var max_sounds = 0;
	for (var path in sounds) {
		max_sounds++;
		var snd = new Audio();
		var snd_src = document.createElement("source");
		snd_src.src = "resource/" + path + ".ogg";
		snd_src.type = "audio/ogg";
		snd.appendChild(snd_src);
		snd.name = path;
		snd.preload = "auto";
		snd.addEventListener("canplaythrough", function() {sounds[this.name] = this; sounds_loaded++;}, false);
		head.appendChild(snd);
	}
	
	return function() {return {loaded_sounds: sounds_loaded, max: max_sounds};};
};

function play_sound(name) {
	sounds[name].currentTime = 0;
	sounds[name].play();
}
