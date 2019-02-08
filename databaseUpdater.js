var updateDiv = document.createElement('div');
var navbar = document.getElementsByClassName("collapse");
updateDiv.classList.add('update-div');
updateDiv.style.display = "none";
updateDiv.innerHTML = "Updating tag database Page: 1";

navbar[0].parentNode.appendChild(updateDiv);

start();

function start() {
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
		  if (request.function == "updateDatabase")
			  updateDiv.style.display = "inherit";
			  setTimeout(function(){
				updateDatabase();
			  },0);
		}
	);
}

function updateDatabase() {
	var url = "https://nhentai.net/tags/";
	var tagDatabaseArray = [];
	var lastPage = false;
	var iterator = 1;
	var lastPageUrl = "";
	
	updateDatabaseRequest(url, tagDatabaseArray, lastPageUrl, iterator, lastPage);
}

function updateDatabaseRequest(url, tagDatabaseArray, lastPageUrl, iterator, lastPage) {
	var request = $.ajax({
		async: true,
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

		if (!lastPage) {
			iterator++;
			url = "https://nhentai.net/tags/?page=" + iterator;
			if (url.includes(lastPageUrl)) {
				lastPage = true;
			}
			var lastPageNumber = lastPageUrl.replace(/\D/g,'');
			updateDiv.innerHTML = "Updating tag database Page: " + iterator + "/" + lastPageNumber;
			  setTimeout(function(){
				updateDatabaseRequest(url, tagDatabaseArray, lastPageUrl, iterator, lastPage);
			  },0);
		} else {
			storeDatabase(tagDatabaseArray);
		}
	});
}

function storeDatabase(tagDatabaseArray) {
	updateDiv.style.display = "none";
	chrome.storage.local.set({tagDatabaseArray: tagDatabaseArray}, function() {
		alert( "Update finished");
	})
}