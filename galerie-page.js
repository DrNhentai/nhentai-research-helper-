var tagContainer = document.getElementsByClassName("tag-container");

var tags = [];
var tagsReadable = [];
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

setupDownloadButtons();
setupShareButton();
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

function setupDownloadButtons() {
	var buttonsContainer = document.getElementsByClassName("buttons");
	var downloadTorrentButton = document.getElementById('download');

	downloadTorrentButton.childNodes[1].nodeValue = ' Torrent download';

	var downloadDirectButton = document.createElement("div");
	downloadDirectButton.classList.add("btn");
	downloadDirectButton.classList.add("btn-secondary");

	var downloadIcon = document.createElement("i");
	downloadIcon.classList.add('fa');
	downloadIcon.classList.add('fa-download');

	var text = document.createTextNode(" Direct download");
	downloadDirectButton.appendChild(downloadIcon);
	downloadDirectButton.appendChild(text);
	buttonsContainer[0].appendChild(downloadDirectButton);

	downloadDirectButton.onclick = function() {
		downloadComic();
	};
}

function setupShareButton() {
	var heartIcon = document.createElement('i');
	heartIcon.classList.add('fa');
	heartIcon.classList.add('fa-heart');

	


	var addTooltipPopup = document.createElement('div');
	addTooltipPopup.classList.add('info-container');

	var text = document.createTextNode("Copy ID to clipboard");
	addTooltipPopup.appendChild(text);

	var buttonsContainer = document.getElementsByClassName("buttons");

	var shareButton = document.createElement("div");
	shareButton.classList.add("btn");
	shareButton.classList.add("btn-secondary");
	shareButton.classList.add("icon-only");

	var shareIcon = document.createElement("i");
	shareIcon.classList.add('fa');
	shareIcon.classList.add('fa-clone');
	shareButton.appendChild(shareIcon);

	shareButton.appendChild(addTooltipPopup);
	shareButton.classList.add("info-hoverable");

	buttonsContainer[0].appendChild(shareButton);

	shareButton.onclick = function() {
		document.execCommand('copy');
		text.nodeValue = "ID copied";
	};
}

function downloadComic() {
	var coverContainer = document.getElementById("cover");
	var img = coverContainer.children[0].children[0];
	var src = img.src;
	var imgNumber = src.split("/");

	var thumbnailContainer = document.getElementById("thumbnail-container");
	var numberOfImages = thumbnailContainer.children.length;

	var h1s = document.getElementsByTagName("h1");
	var title = h1s[0].innerText;

	chrome.runtime.sendMessage({
		function: "download",
		srcNumber: imgNumber[4],
		numberOfImages : numberOfImages,
		title: title
	});
}

document.addEventListener('copy', function(e) {
	var src = window.location.href;
	var imgNumber = src.split("/");

	e.clipboardData.setData('text/plain', imgNumber[4]);
	e.preventDefault();
  });