var galarieElements = document.getElementsByClassName("gallery");
var tags = [];
var tagsReadable = [];
var tagDatabase = new Map();

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
	});
	
}

function loadTagDatabase() {
	chrome.storage.local.get('tagDatabaseArray', function(data) {
		if (typeof data.tagDatabaseArray !== 'undefined') {
			var arrayLength = data.tagDatabaseArray.length;
			for (var i = 0; i < arrayLength; i+=2) {
				tagDatabase.set(data.tagDatabaseArray[i], data.tagDatabaseArray[i+1]);
			}
				applyScore();
		} else {
			createUpdateDiv();
		}
	});
}

function applyScore() {
	var arrayLength1 = galarieElements.length;
	for (var i = 0; i < arrayLength1; i++) {
		var dataTags = galarieElements[i].getAttribute("data-tags");
		var score = 0;
		var includedTags = [];

		var arrayLength2 = tags.length;
		for (var j = 0; j < arrayLength2; j++) {
			if (dataTags.includes(tagDatabase.get(tags[j]))) {
				includedTags.push(tagsReadable[j]);
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
							updateDatabase();
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