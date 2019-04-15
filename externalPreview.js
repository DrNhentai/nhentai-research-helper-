var linkedComics = new Map();
var tagsReadable = [];

loadTags();

function loadTags() {
	chrome.storage.local.get('tags', function(data) {
		if (typeof data.tags !== 'undefined') {
			var arrayLength = data.tags.length;
			for (var i = 0; i < arrayLength; i++) {
				tagsReadable.push(data.tags[i]);
			}
		}
		findLinks();
	});
}

function findLinks() {
    allTextNodes = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);

    var currentTextNode;
    while (currentTextNode = allTextNodes.nextNode()) {
        foundMatches = currentTextNode.nodeValue.match(/[0-9]{5,6}/g);
        if (foundMatches != null) {
            allTextNodes.nextNode();
            var convertedUrl = "https://nhentai.net/g/" + foundMatches[0];
            var v = currentTextNode.nodeValue;
            v = v.replace(foundMatches[0], `<a href=${convertedUrl}>${foundMatches[0]}</a>`);

            var htmlParser = document.createElement('div');
            htmlParser.innerHTML = v;
            var newNodes = htmlParser.childNodes;

            while (newNodes.length) {
                if (typeof newNodes[0] !== "undefined") {
                    if (newNodes[0].nodeType == 1) {
                        linkedComics.set(newNodes[0], convertedUrl);
                    }
                }
                currentTextNode.parentNode.insertBefore(newNodes[0], currentTextNode);
            }
            currentTextNode.parentNode.removeChild(currentTextNode);
        } 
    }
    addPopups();
}

function addPopups() {
    linkedComics.forEach(function(value, key) {
        var addTooltipPopup = document.createElement('div');
        addTooltipPopup.classList.add('info-container');
        var text = document.createTextNode("Loading information");
	    addTooltipPopup.appendChild(text);


        key.appendChild(addTooltipPopup);
        key.classList.add("info-hoverable");

        chrome.runtime.sendMessage(
            {
                function: "externalPreview",
                url: value

            }, function(response) {
                if (response.status == "succes") {
                    addTooltipPopup.removeChild(text);

                    var imageDiv = document.createElement('div');
                    imageDiv.classList.add('imageDiv');

                    var tagDiv = document.createElement('div');
                    tagDiv.classList.add('tagDiv');

                    var imageTagContainer = document.createElement('div');
                    imageTagContainer.classList.add('imageTagContainer');

                    var titleDiv = document.createElement('h4');
                    var title = document.createTextNode(response.title);
                    titleDiv.appendChild(title);

                    imageTagContainer.appendChild(imageDiv);
                    imageTagContainer.appendChild(tagDiv);

                    addTooltipPopup.appendChild(titleDiv);
                    addTooltipPopup.appendChild(imageTagContainer);
                    

                    var image = document.createElement("IMG");
                    image.src = response.coverUrl;
                    image.classList.add('image');
                    imageDiv.appendChild(image);

                    response.tags.forEach(function(element, index) {
                            var tag = document.createElement('div');
                            tag.classList.add('tag');
                            tag.innerHTML += element;
                            tagDiv.appendChild(tag);

                            var arrayLength = tagsReadable.length;
                            for (var j = 0; j < arrayLength; j++) {
                                compareStringTag = element.replace(/\s/g, "");
                                compareStringFavoriteTag = tagsReadable[j].replace(/\s/g, "");
                                if (compareStringTag == compareStringFavoriteTag) {
                                    tag.classList.add("favorite-tag");
                                }
                            }
                    })
                } else {
                    text.nodeValue = "No comic found";
                }
        });
    });
}