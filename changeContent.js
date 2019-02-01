var galarieElements = document.getElementsByClassName("gallery");
var tags = [];

chrome.storage.local.get('tags', function(data) {
  var arrayLength = data.tags.length;
	for (var i = 0; i < arrayLength; i++) {
		tags.push(data.tags[i]);
	}
});

updateDatabase();
//load();

function load() {
	var arrayLength1 = galarieElements.length;
	for (var i = 0; i < arrayLength1; i++) {
		var url = galarieElements[i].childNodes[0].href;
		$.get(url, function(data, status){
			var score = 0;
			var arrayLength2 = tags.length;
			for (var j = 0; j < arrayLength2; j++) {
				if (data.includes(tags[j])) {
					score++;
				}
			}
			if (score > 0) {
				galarieElements[i].classList.add("test");
			}
		});
	}
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  console.log(sender.tab ?
				  "from a content script:" + sender.tab.url :
				  "from the extension");
	  if (request.greeting == "hello")
		sendResponse({farewell: "goodbye"});
	});
	
function updateDatabase() {
	var url = "https://nhentai.net/tags/";
	var tagDatabase = new Map();
	var lastpage = false;
	var iterator = 1;
	var lastPageUrl = "";
	while (!lastpage) {
		var request = $.ajax({
			async: false,
			url: url,
			method: "GET",
		});
		
		request.done(function(data) {
			if (iterator == 1) {
				lastPageUrl = $(data).find('.last').attr("href");
			}

			var tagContainer = $(data).find('#tag-container').html();
			var tags = $(data).find('.tag').map( function() {
							return $(this);
						}).get();

					
			var arrayLength = tags.length;
			for (var i = 0; i < arrayLength; i++) {
				var className = $(tags[i]).attr('class');
				var tagID = className.replace(/\D/g,'');
				
				var tagName = $(tags[i]).clone().children().remove().end().text();
				tagName = tagName.replace(/\s/g, "");
				tagDatabase.set(tagName, tagID);
			}

			if (url.includes(lastPageUrl)) {
				lastpage = true;
			}

			iterator++;
			url = "https://nhentai.net/tags/?page=" + iterator;
		});
		
		request.fail(function( jqXHR, textStatus ) {
			alert( "Request failed: " + textStatus );
		});
	}
	alert( "Update finished");
}