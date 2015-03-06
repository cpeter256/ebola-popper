"use strict";

//Map of every sound path to an Audio of the sound
var sounds = {	
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
		snd.src = "resource/" + path + ".png";
		snd.name = path;
		snd.onload = function() {sounds[this.name] = this; sounds_loaded++;};
		head.appendChild(snd);
	}
	
	return function() {return {loaded_sounds: sounds_loaded, max: max_sounds};};
};
