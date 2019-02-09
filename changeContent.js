var galarieElements = document.getElementsByClassName("gallery");
var tags = [];
var tagsReadable = [];

var tagDatabase = new Map();
var artistDatabase = new Map();
var characterDatabase = new Map();
var parodyDatabase = new Map();
var groupDatabase = new Map();
var loadCounter = 0;

start();

function start() {
	loadTags();
}

function loadTags() {
	chrome.storage.local.get('tags', function(data) {
		if (typeof data.tags !== 'undefined') {
			var arrayLength = data.tags.length;
			for (var i = 0; i < arrayLength; i++) {
				var tagName = data.tags[i].replace(/\s/g, "");
				tags.push(tagName);
				tagsReadable.push(data.tags[i]);
			}
		}
		loadTagDatabase();
		loadArtistDatabase();
		loadCharacterDatabase();
		loadParodyDatabase();
		loadGroupDatabase();
	});
	
}

function loadTagDatabase() {
	chrome.storage.local.get('tagDatabaseArray', function(data) {
		if (typeof data.tagDatabaseArray !== 'undefined') {
			chrome.storage.local.set({tagDatabase: true}, function() {});

			var arrayLength = data.tagDatabaseArray.length;
			for (var i = 0; i < arrayLength; i+=2) {
				tagDatabase.set(data.tagDatabaseArray[i], data.tagDatabaseArray[i+1]);
			}
		} else {
			chrome.storage.local.set({tagDatabase: false}, function() {});
			createUpdateDiv();
		}
		loadCounter++;
		startApplyScore();
	});
}

function loadArtistDatabase() {
	chrome.storage.local.get('artistDatabaseArray', function(data) {
		if (typeof data.artistDatabaseArray !== 'undefined') {
			chrome.storage.local.set({artistDatabase: true}, function() {});

			var arrayLength = data.artistDatabaseArray.length;
			for (var i = 0; i < arrayLength; i+=2) {
				artistDatabase.set(data.artistDatabaseArray[i], data.artistDatabaseArray[i+1]);
			}
		} else {
			chrome.storage.local.set({artistDatabase: false}, function() {});
		}
		loadCounter++;
		startApplyScore();
	});
}

function loadCharacterDatabase() {
	chrome.storage.local.get('characterDatabaseArray', function(data) {
		if (typeof data.characterDatabaseArray !== 'undefined') {
			chrome.storage.local.set({characterDatabase: true}, function() {});

			var arrayLength = data.characterDatabaseArray.length;
			for (var i = 0; i < arrayLength; i+=2) {
				parodyDatabase.set(data.characterDatabaseArray[i], data.characterDatabaseArray[i+1]);
			}
		} else {
			chrome.storage.local.set({characterDatabase: false}, function() {});
		}
		loadCounter++;
		startApplyScore();
	});
}

function loadParodyDatabase() {
	chrome.storage.local.get('parodyDatabaseArray', function(data) {
		if (typeof data.parodyDatabaseArray !== 'undefined') {
			chrome.storage.local.set({parodyDatabase: true}, function() {});

			var arrayLength = data.parodyDatabaseArray.length;
			for (var i = 0; i < arrayLength; i+=2) {
				parodyDatabase.set(data.parodyDatabaseArray[i], data.parodyDatabaseArray[i+1]);
			}
		} else {
			chrome.storage.local.set({parodyDatabase: false}, function() {});
		}
		loadCounter++;
		startApplyScore();
	});
}

function loadGroupDatabase() {
	chrome.storage.local.get('groupDatabaseArray', function(data) {
		if (typeof data.groupDatabaseArray !== 'undefined') {
			chrome.storage.local.set({groupDatabase: true}, function() {});

			var arrayLength = data.groupDatabaseArray.length;
			for (var i = 0; i < arrayLength; i+=2) {
				groupDatabase.set(data.groupDatabaseArray[i], data.groupDatabaseArray[i+1]);
			}
		} else {
			chrome.storage.local.set({groupDatabase: false}, function() {});
		}
		loadCounter++;
		startApplyScore();
	});
}

function startApplyScore() {
	if (loadCounter == 5) {
		applyScore();
	}
}

function applyScore() {
	var arrayLength1 = galarieElements.length;
	for (var i = 0; i < arrayLength1; i++) {
		var dataTags = galarieElements[i].getAttribute("data-tags");
		var score = 0;
		var includedTags = [];
		var includedArtists = [];
		var includedCharacters = [];
		var includedParodies = [];
		var includedGroups = [];

		var arrayLength2 = tags.length;

		for (var j = 0; j < arrayLength2; j++) {
			if (dataTags.includes(tagDatabase.get(tags[j]))) {
				includedTags.push(tagsReadable[j]);
				score++;
			}
		}
		
		for (var j = 0; j < arrayLength2; j++) {
			if (dataTags.includes(artistDatabase.get(tags[j]))) {
				includedArtists.push(tagsReadable[j]);
				score++;
			}
		}

		for (var j = 0; j < arrayLength2; j++) {
			if (dataTags.includes(characterDatabase.get(tags[j]))) {
				includedCharacters.push(tagsReadable[j]);
				score++;
			}
		}

		for (var j = 0; j < arrayLength2; j++) {
			if (dataTags.includes(parodyDatabase.get(tags[j]))) {
				includedParodies.push(tagsReadable[j]);
				score++;
			}
		}

		for (var j = 0; j < arrayLength2; j++) {
			if (dataTags.includes(groupDatabase.get(tags[j]))) {
				includedGroups.push(tagsReadable[j]);
				score++;
			}
		}

		if (score == 1) {
			galarieElements[i].classList.add("decent");
		}
		if (score == 2) {
			galarieElements[i].classList.add("good");
		}
		if (score == 3) {
			galarieElements[i].classList.add("very-good");
		}
		if (score >= 4) {
			galarieElements[i].classList.add("perfect");
		}

		if (score > 0) {
			var includedTagsPopup = document.createElement('div');
			includedTagsPopup.classList.add('tooltip-container');
		
			var arrayLength3 = includedTags.length;
			for (var t = 0; t < arrayLength3; t++) {
				var tagPopup = document.createElement('div');
				tagPopup.classList.add('tooltiptext');
				tagPopup.innerHTML += includedTags[t];
				includedTagsPopup.appendChild(tagPopup);
			}

			var arrayLength4 = includedArtists.length;
			for (var t = 0; t < arrayLength4; t++) {
				var tagPopup = document.createElement('div');
				tagPopup.classList.add('tooltiptext');
				tagPopup.innerHTML += includedArtists[t];
				includedTagsPopup.appendChild(tagPopup);
			}

			var arrayLength5 = includedCharacters.length;
			for (var t = 0; t < arrayLength5; t++) {
				var tagPopup = document.createElement('div');
				tagPopup.classList.add('tooltiptext');
				tagPopup.innerHTML += includedCharacters[t];
				includedTagsPopup.appendChild(tagPopup);
			}

			var arrayLength6 = includedParodies.length;
			for (var t = 0; t < arrayLength6; t++) {
				var tagPopup = document.createElement('div');
				tagPopup.classList.add('tooltiptext');
				tagPopup.innerHTML += includedParodies[t];
				includedTagsPopup.appendChild(tagPopup);
			}

			var arrayLength7 = includedGroups.length;
			for (var t = 0; t < arrayLength7; t++) {
				var tagPopup = document.createElement('div');
				tagPopup.classList.add('tooltiptext');
				tagPopup.innerHTML += includedGroups[t];
				includedTagsPopup.appendChild(tagPopup);
			}

			galarieElements[i].classList.add('tooltip');
			galarieElements[i].appendChild(includedTagsPopup);
		}
		
	}
}



function createUpdateDiv() {
	var updateHintEnabled = true;
	chrome.storage.local.get('updateHint', function(data) {
			updateHintEnabled = data.updateHint ;
			if (updateHintEnabled) {
				var pleaseUpdateDiv = document.createElement('div');
				var updateButton = document.createElement('button');
				var disableUpdateButton = document.createElement('button');
		
				updateButton.innerHTML = "update";
				updateButton.classList.add('please-update-button');
				updateButton.onclick = function(element) {
					updateDiv.style.display = "inherit";
						setTimeout(function(){
							updateTagDatabase();
							pleaseUpdateDiv.style.display = "none";
						},0);
				};
		
				disableUpdateButton.innerHTML = "dont show this again";
				disableUpdateButton.classList.add('hide-update-button');
				disableUpdateButton.onclick = function(element) {
					chrome.storage.local.set({updateHint: false}, function() {
					pleaseUpdateDiv.style.display = "none";
					});
				};
		
		
				pleaseUpdateDiv.classList.add('please-update-container');
				pleaseUpdateDiv.innerHTML = "Your tag-database is empty. Do you want to update it now (this may take a short while)?"
		
				pleaseUpdateDiv.appendChild(updateButton);
				pleaseUpdateDiv.appendChild(disableUpdateButton);
		
				document.body.appendChild(pleaseUpdateDiv);
			}
	});
}