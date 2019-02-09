var updateInProgress = false;
var updateDiv = document.createElement('div');
var navbar = document.getElementsByClassName("collapse");
updateDiv.classList.add('update-div');
updateDiv.style.display = "none";
updateDiv.innerHTML = "Updating tag database Page: 1";

navbar[0].parentNode.appendChild(updateDiv);

start();

window.onbeforeunload = function() {
    if (updateInProgress) {
        return 'Update in progess. You will loose all progress when leaving';
    }
    else {
        return null;
    }
};

function start() {
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
            var baseUrl = "";
            var databaseName = "";

            if (request.function == "updateTagDatabase"){
                baseUrl = "https://nhentai.net/tags/";
                databaseName = "tagDatabase";
            }
                
            if (request.function == "updateArtistDatabase"){
                baseUrl = "https://nhentai.net/artists/";
                databaseName = "artistDatabase";
            }
            
            if (request.function == "updateCharacterDatabase"){
                baseUrl = "https://nhentai.net/characters/";
                databaseName = "characterDatabase";
            }
            
            if (request.function == "updateParodieDatabase"){
                baseUrl = "https://nhentai.net/parodies/";
                databaseName = "parodyDatabase";
            }
            
            if (request.function == "updateGroupDatabase"){
                baseUrl = "https://nhentai.net/groups/";
                databaseName = "groupDatabase";
            }

            updateDiv.style.display = "inherit";
			  setTimeout(function(){
				updateDatabase(baseUrl, databaseName);
			  },0);
        }
	);
}

function updateTagDatabase() {
    updateDatabase("https://nhentai.net/tags/", "tagDatabase");
}

function updateDatabase(baseUrl, databaseName) {
	var tagDatabaseArray = [];
	var lastPage = false;
	var iterator = 1;
	var lastPageUrl = "";
	
	updateDatabaseRequest(baseUrl, baseUrl, tagDatabaseArray, lastPageUrl, iterator, lastPage, databaseName);
}

function updateDatabaseRequest(baseUrl, downloadUrl, tagDatabaseArray, lastPageUrl, iterator, lastPage, databaseName) {
	updateInProgress = true;
	var request = $.ajax({
		async: true,
		url: downloadUrl,
		method: "GET",
    });
    
    request.fail(function(data){
        setTimeout(function(){
            updateDatabaseRequest(baseUrl, downloadUrl, tagDatabaseArray, lastPageUrl, iterator, lastPage, databaseName);
          },800);
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
			downloadUrl = baseUrl + "?page=" + iterator;
			if (downloadUrl.includes(lastPageUrl)) {
				lastPage = true;
			}
			var lastPageNumber = lastPageUrl.replace(/\D/g,'');
			updateDiv.innerHTML = "Updating tag database Page: " + iterator + "/" + lastPageNumber;
			  setTimeout(function(){
				updateDatabaseRequest(baseUrl, downloadUrl, tagDatabaseArray, lastPageUrl, iterator, lastPage, databaseName);
			  },0);
		} else {
			storeDatabase(tagDatabaseArray, databaseName);
		}
	});
}

function storeDatabase(tagDatabaseArray, databaseName) {
	updateDiv.style.display = "none";
    switch(databaseName) {
        case "tagDatabase":
			chrome.storage.local.set({tagDatabaseArray: tagDatabaseArray}, function() {
				alert( "Update finished");
				updateInProgress = false;
			})
            break;
        case "artistDatabase":
			chrome.storage.local.set({artistDatabaseArray: tagDatabaseArray}, function() {
				alert( "Update finished");
				updateInProgress = false;
			})
            break;
        case "characterDatabase":
			chrome.storage.local.set({characterDatabaseArray: tagDatabaseArray}, function() {
				alert( "Update finished");
				updateInProgress = false;
			})
            break;
        case "parodyDatabase":
			chrome.storage.local.set({parodyDatabaseArray: tagDatabaseArray}, function() {
				alert( "Update finished");
				updateInProgress = false;
			})
            break;
        case "groupDatabase":
			chrome.storage.local.set({groupDatabaseArray: tagDatabaseArray}, function() {
				alert( "Update finished");
				updateInProgress = false;
			})
            break;
      }
}