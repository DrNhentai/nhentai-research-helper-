var tags = [];
var tagsReadable = [];
var tagContainer = document.getElementsByClassName("tag-container");
var relevantTags;
var tagsOnPage;
var artistsOnPage;
var charactersOnPage;
var parodiesOnPage;
var groupsOnPage;

var arrayLength2 = tagContainer.length;
for (var j = 0; j < arrayLength2; j++) {
	if (tagContainer[j].textContent.includes("Tags")) {
		relevantTags = tagContainer[j];
		tagsOnPage = relevantTags.childNodes[1].childNodes;
	}
	if (tagContainer[j].textContent.includes("Artists")) {
		relevantTags = tagContainer[j];
		artistsOnPage = relevantTags.childNodes[1].childNodes;
	}
	if (tagContainer[j].textContent.includes("Characters")) {
		relevantTags = tagContainer[j];
		charactersOnPage = relevantTags.childNodes[1].childNodes;
	}
	if (tagContainer[j].textContent.includes("Parodies")) {
		relevantTags = tagContainer[j];
		parodiesOnPage = relevantTags.childNodes[1].childNodes;
	}
	if (tagContainer[j].textContent.includes("Groups")) {
		relevantTags = tagContainer[j];
		groupsOnPage = relevantTags.childNodes[1].childNodes;
	}
}  


start();

function start() {
	loadTags();
}

function loadTags() {
	chrome.storage.local.get('tags', function(data) {
		if (typeof data.tags !== 'undefined') {
			var arrayLength = data.tags.length;
			for (var i = 0; i < arrayLength; i++) {
				tagsReadable.push(data.tags[i]);
			}
		}
		colorTags(tagsOnPage);
		colorTags(artistsOnPage);
		colorTags(charactersOnPage);
		colorTags(parodiesOnPage);
		colorTags(groupsOnPage);
	});
}

function colorTags(tagOnPageList) {
    var arrayLength = tagOnPageList.length;
    for (var i = 0; i < arrayLength; i++) {
		var isFavoriteTag = false;

		var addTagPopup = document.createElement('div');
		var heartIcon = document.createElement('i');
		heartIcon.classList.add('fa');
		heartIcon.classList.add('fa-heart');

		addTagPopup.classList.add('add-tag-container');

		

		addTagPopup.appendChild(heartIcon);
		tagOnPageList[i].appendChild(addTagPopup);
		tagOnPageList[i].classList.add("tag-hoverable");

		var arrayLength2 = tagsReadable.length;
        for (var j = 0; j < arrayLength2; j++) {
            if (tagOnPageList[i].innerHTML.includes(tagsReadable[j])) {
				tagOnPageList[i].classList.add("favorite-tag");
				heartIcon.classList.add('tag-heart');
				isFavoriteTag = true;
			}
		}
		if (isFavoriteTag) {
			addTagPopup.onclick = function(element) {
				var parent = this.parentElement;
				var tagName = parent.childNodes[0].nodeValue;
				tagName = tagName.slice(0, -1);
				
				var index = tagsReadable.indexOf(tagName);
				if (index > -1) {
					tagsReadable.splice(index, 1);
				}
				deleteTag(tagName);
				return false;
			};
		}  else {
			addTagPopup.onclick = function(element) {
				var parent = this.parentElement;
				var tagName = parent.childNodes[0].nodeValue;
				tagName = tagName.slice(0, -1);
				tagsReadable.push(tagName);
				addTag(tagName);
				return false;
			};
		}
	}
}

function addTag(tag) {
	chrome.runtime.sendMessage({
		function: "addTag",
		tag: tag
	});
	location.reload();
}

function deleteTag(tag) {
	chrome.runtime.sendMessage({
		function: "deleteTag",
		tag: tag
	});
	location.reload();
}