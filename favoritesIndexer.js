var updateInProgress = false;
var updateDiv = document.createElement('div');
var navbar = document.getElementsByClassName("collapse");
updateDiv.classList.add('update-div');
updateDiv.style.display = "none";
updateDiv.innerHTML = "Indexing your Favorites Page: 1";

navbar[0].parentNode.appendChild(updateDiv);
checkDatabse();

window.onbeforeunload = function() {
    if (updateInProgress) {
        return 'Update in progess. You will loose all progress when leaving';
    }
    else {
        return null;
    }
};

function checkDatabse() {
	chrome.storage.local.get('favoritesIndexed', function(data) {
		if (!data.favoritesIndexed) {
			chrome.storage.local.set({favoritesDatabase: false}, function() {});
			createUpdateDiv();
		}
	});
}

function startIndexing() {
	
    baseUrl = "https://nhentai.net/favorites/";
    databaseName = "favoritesDatabase";

    updateDiv.style.display = "inherit";
        setTimeout(function(){
            updateDatabase(baseUrl, databaseName);
        },0);
}

function updateDatabase(baseUrl, databaseName) {
	var favoritesDatabaseArray = [];
	var lastPage = false;
	var iterator = 1;
	var lastPageUrl = "";
	
	updateDatabaseRequest(baseUrl, baseUrl, favoritesDatabaseArray, lastPageUrl, iterator, lastPage, databaseName);
}

function updateDatabaseRequest(baseUrl, downloadUrl, favoritesDatabaseArray, lastPageUrl, iterator, lastPage, databaseName) {
	updateInProgress = true;
	var request = $.ajax({
		async: true,
		url: downloadUrl,
		method: "GET",
    });
    
    request.fail(function(data){
        setTimeout(function(){
            updateDatabaseRequest(baseUrl, downloadUrl, favoritesDatabaseArray, lastPageUrl, iterator, lastPage, databaseName);
          },1000);
    });
	
	request.done(function(data) {
		if (iterator == 1) {
			lastPageUrl = $(data).find('.last').attr("href");
		}

		var comics = $(data).find('.gallery').map( function() {
						return $(this);
					}).get();

				
		var arrayLength = comics.length;
		for (var i = 0; i < arrayLength; i++) {
			var linkNode = comics[0].children()[0];

			urlID = linkNode.href.replace(/\D/g,'');
			title = linkNode.lastChild.innerText;
			previewImgUrl = linkNode.firstChild.getAttribute("data-src");
			tags = $(comics[i]).attr("data-tags");

			favoritesDatabaseArray.push(urlID);
			favoritesDatabaseArray.push(title);
			favoritesDatabaseArray.push(previewImgUrl);
			favoritesDatabaseArray.push(tags);
		}

		if (!lastPage) {
			iterator++;
			downloadUrl = baseUrl + "?page=" + iterator;
			if (downloadUrl.includes(lastPageUrl)) {
				lastPage = true;
			}
			var lastPageNumber = lastPageUrl.replace(/\D/g,'');
			updateDiv.innerHTML = "Indexing your Favorites Page: " + iterator + "/" + lastPageNumber;
			  setTimeout(function(){
				updateDatabaseRequest(baseUrl, downloadUrl, favoritesDatabaseArray, lastPageUrl, iterator, lastPage, databaseName);
			  },1000);
		} else {
			storeDatabase(favoritesDatabaseArray, databaseName);
		}
	});
}

function storeDatabase(favoritesDatabaseArray, databaseName) {
	updateDiv.style.display = "none";
   
    chrome.storage.local.set({favoritesDatabase: true}, function() {});
    chrome.storage.local.set({favoritesDatabaseArray: favoritesDatabaseArray}, function() {
        alert( "Update finished");
        updateInProgress = false;
    });
}

function createUpdateDiv() {
	var updateHintEnabled = true;
	chrome.storage.local.get('indexFavoritesHint', function(data) {
			updateHintEnabled = data.indexFavoritesHint ;
			if (updateHintEnabled) {
				var pleaseUpdateDiv = document.createElement('div');
				var updateButton = document.createElement('button');
				var disableUpdateButton = document.createElement('button');
		
				updateButton.innerHTML = "update";
				updateButton.classList.add('please-update-button');
				updateButton.onclick = function(element) {
					updateDiv.style.display = "inherit";
						setTimeout(function(){
							startIndexing();
							pleaseUpdateDiv.style.display = "none";
						},0);
				};
		
				disableUpdateButton.innerHTML = "dont show this again";
				disableUpdateButton.classList.add('hide-update-button');
				disableUpdateButton.onclick = function(element) {
					chrome.storage.local.set({indexFavoritesHint: false}, function() {
					pleaseUpdateDiv.style.display = "none";
					});
				};
		
		
				pleaseUpdateDiv.classList.add('please-update-container');
				pleaseUpdateDiv.innerHTML = "Your favorites need to be Indexed. This is a one time process but takes a short time. Do you want to do it now?";
		
				pleaseUpdateDiv.appendChild(updateButton);
				pleaseUpdateDiv.appendChild(disableUpdateButton);
		
				document.body.appendChild(pleaseUpdateDiv);
			}
	});
}