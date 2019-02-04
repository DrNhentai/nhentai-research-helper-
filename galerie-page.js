var tags = [];
var tagsReadable = [];
var tagsOnPage = document.getElementsByClassName("tag");

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
		var arrayLength = data.tags.length;
		for (var i = 0; i < arrayLength; i++) {
			tagsReadable.push(data.tags[i]);
		}
		colorTags();
	});
}

function colorTags() {
    var arrayLength = tagsReadable.length;
    for (var i = 0; i < arrayLength; i++) {
        var arrayLength2 = tagsOnPage.length;
        for (var j = 0; j < arrayLength2; j++) {
            if (tagsOnPage[j].innerHTML.includes(tagsReadable[i])) {
                tagsOnPage[j].classList.add("favorite-tag");
            }
        }  
    }
}
