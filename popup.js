let addTag = document.getElementById('addTag');
let tagContainer = document.getElementById('tagContainer');
let tagName = document.getElementById('tagName');

let updateTagDatabase = document.getElementById('updateTagDatabase');
let updateArtistDatabase = document.getElementById('updateArtistDatabase');
let updateCharacterDatabase = document.getElementById('updateCharacterDatabase');
let updateParodyDatabase = document.getElementById('updateParodyDatabase');
let updateGroupDatabase = document.getElementById('updateGroupDatabase');

let TagDatabaseStatus = document.getElementById('tag-database-status');
let ArtistDatabaseStatus = document.getElementById('artist-database-status');
let CharacterDatabaseStatus = document.getElementById('character-database-status');
let ParodyDatabaseStatus = document.getElementById('parody-database-status');
let GroupDatabaseStatus = document.getElementById('group-database-status');

chrome.storage.local.get('tags', function(data) {
	if (typeof data.tags !== 'undefined') {
		var arrayLength = data.tags.length;
		for (var i = 0; i < arrayLength; i++) {
			newTag(data.tags[i]);
		}
	}
});

tagName.addEventListener("keyup", function(event) {
	if (event.keyCode === 13) {
		if (tagName.value != "") {
			newTag(tagName.value);
			updateSettings();
			tagName.value = "";
		}
	}
  });

addTag.onclick = function(element) {
	if (tagName.value != "") {
		newTag(tagName.value);
		updateSettings();
		tagName.value = "";
	}
};

function newTag(name) {
	var btn = document.createElement("BUTTON");
	btn.onclick = function() {
		tagContainer.removeChild(btn);
		updateSettings();
	};
	btn.setAttribute("class", "tagButton");
	btn.innerHTML = name;
	tagContainer.appendChild(btn)
}

function updateSettings() {
	var tagElememts = document.getElementsByClassName("tagButton");
	var tags = [];
	var arrayLength = tagElememts.length;
	for (var i = 0; i < arrayLength; i++) {
		tags.push(tagElememts[i].innerHTML);
	}
	chrome.storage.local.set({tags: tags}, function() {
	});
}

updateTagDatabase.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {function: "updateTagDatabase"});
	});
};

updateArtistDatabase.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {function: "updateArtistDatabase"});
	});
};

updateCharacterDatabase.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {function: "updateCharacterDatabase"});
	});
};

updateParodyDatabase.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {function: "updateParodieDatabase"});
	});
};

updateGroupDatabase.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {function: "updateGroupDatabase"});
	});
};

chrome.storage.local.get('tagDatabase', function(data) {
	if (data.tagDatabase) {
		TagDatabaseStatus.innerHTML = "found";
		TagDatabaseStatus.classList.add('found');
	} else {
		TagDatabaseStatus.innerHTML = "missing";
		TagDatabaseStatus.classList.add('missing');
	}
});
chrome.storage.local.get('artistDatabase', function(data) {
	if (data.artistDatabase) {
		ArtistDatabaseStatus.innerHTML = "found";
		ArtistDatabaseStatus.classList.add('found');
	} else {
		ArtistDatabaseStatus.innerHTML = "missing";
		ArtistDatabaseStatus.classList.add('missing');
	}
});
chrome.storage.local.get('characterDatabase', function(data) {
	if (data.characterDatabase) {
		CharacterDatabaseStatus.innerHTML = "found";
		CharacterDatabaseStatus.classList.add('found');
	} else {
		CharacterDatabaseStatus.innerHTML = "missing";
		CharacterDatabaseStatus.classList.add('missing');
	}
});
chrome.storage.local.get('parodyDatabase', function(data) {
	if (data.parodyDatabase) {
		ParodyDatabaseStatus.innerHTML = "found";
		ParodyDatabaseStatus.classList.add('found');

	} else {
		ParodyDatabaseStatus.innerHTML = "missing";
		ParodyDatabaseStatus.classList.add('missing');
	}
});
chrome.storage.local.get('groupDatabase', function(data) {
	if (data.groupDatabase) {
		GroupDatabaseStatus.innerHTML = "found";
		GroupDatabaseStatus.classList.add('found');
	} else {
		GroupDatabaseStatus.innerHTML = "missing";
		GroupDatabaseStatus.classList.add('missing');
	}
});

