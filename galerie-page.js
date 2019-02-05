var tags = [];
var tagsReadable = [];
var tagContainer = document.getElementsByClassName("tag-container");
var relevantTags;
var tagsOnPage;

var arrayLength2 = tagContainer.length;
for (var j = 0; j < arrayLength2; j++) {
	if (tagContainer[j].textContent.includes("Tags")) {
		relevantTags = tagContainer[j];
		tagsOnPage = relevantTags.childNodes[1].childNodes;
	}
}  


start();

function start() {
	//chrome.runtime.onMessage.addListener(
	//	function(request, sender, sendResponse) {
	//	  if (request.function == "updateDatabase")
	//		  setTimeout(function(){
	//			updateDatabase();
	//		  },0);
	//	});
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
		colorTags();
	});
}

function colorTags() {
    var arrayLength = tagsOnPage.length;
    for (var i = 0; i < arrayLength; i++) {
		var isFavoriteTag = false;

		var addTagPopup = document.createElement('div');
		var heartIcon = document.createElement('i');
		heartIcon.classList.add('fa');
		heartIcon.classList.add('fa-heart');

		addTagPopup.classList.add('add-tag-container');

		

		addTagPopup.appendChild(heartIcon);
		tagsOnPage[i].appendChild(addTagPopup);
		tagsOnPage[i].classList.add("tag-hoverable");

		var arrayLength2 = tagsReadable.length;
        for (var j = 0; j < arrayLength2; j++) {
            if (tagsOnPage[i].innerHTML.includes(tagsReadable[j])) {
				tagsOnPage[i].classList.add("favorite-tag");
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
				updateTags();
				return false;
			};
		}  else {
			addTagPopup.onclick = function(element) {
				var parent = this.parentElement;
				var tagName = parent.childNodes[0].nodeValue;
				tagName = tagName.slice(0, -1);
				tagsReadable.push(tagName);
				updateTags();
				return false;
			};
		}
	}
}

function updateTags() {
	chrome.storage.local.set({tags: tagsReadable}, function() {
		location.reload();
	});
}