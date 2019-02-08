let addTag = document.getElementById('addTag');
let tagContainer = document.getElementById('tagContainer');
let tagName = document.getElementById('tagName');
let updateTags = document.getElementById('updateTags');

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

updateTags.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {function: "updateDatabase"});
	});
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

