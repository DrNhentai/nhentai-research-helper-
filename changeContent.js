var galarieElements = document.getElementsByClassName("gallery");
var tags = [];
var tagDatabase = new Map();

var updateDiv = document.createElement('div');
var navbar = document.getElementsByClassName("collapse");
updateDiv.classList.add('update-div');
updateDiv.style.display = "none";
updateDiv.innerHTML = "Updating tag database"

navbar[0].parentNode.appendChild(updateDiv);

start();

function start() {
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
		  if (request.function == "index")
			  updateDiv.style.display = "inherit";
			  setTimeout(function(){
				updateDatabase();
			  },0);
		});
	loadTags();
}

function loadTags() {
	chrome.storage.local.get('tags', function(data) {
		var arrayLength = data.tags.length;
		for (var i = 0; i < arrayLength; i++) {
			var tagName = data.tags[i].replace(/\s/g, "");
			tags.push(tagName);
		}
		loadTagDatabase();
	});
	
}

function loadTagDatabase() {
	chrome.storage.local.get('tagDatabaseArray', function(data) {
		var arrayLength = data.tagDatabaseArray.length;
		for (var i = 0; i < arrayLength; i+=2) {
			tagDatabase.set(data.tagDatabaseArray[i], data.tagDatabaseArray[i+1]);
		}
		applyScore();
	});
}

function applyScore() {
	var arrayLength1 = galarieElements.length;
	for (var i = 0; i < arrayLength1; i++) {
		var dataTags = galarieElements[i].getAttribute("data-tags");
		var score = 0;
		var arrayLength2 = tags.length;
		for (var j = 0; j < arrayLength2; j++) {
			if (dataTags.includes(tagDatabase.get(tags[j]))) {
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
		
	}
}

function updateDatabase() {
	var url = "https://nhentai.net/tags/";
	var tagDatabaseArray = [];
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

				tagDatabaseArray.push(tagName);
				tagDatabaseArray.push(tagID);
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
	updateDiv.style.display = "none";
	chrome.storage.local.set({tagDatabaseArray: tagDatabaseArray}, function() {
		alert( "Update finished");
	})
}