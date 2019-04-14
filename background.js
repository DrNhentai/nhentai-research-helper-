'use strict';

var tagsReadable = [];
var tagsUpdated = false;
loadTags();

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({updateHint: true}, function() {
  });

  chrome.storage.local.set({tagDatabase: false}, function() {});
  chrome.storage.local.set({artistDatabase: false}, function() {});
  chrome.storage.local.set({characterDatabase: false}, function() {});
  chrome.storage.local.set({parodyDatabase: false}, function() {});
  chrome.storage.local.set({groupDatabase: false}, function() {});

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'nhentai.net'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

function loadTags() {
	chrome.storage.local.get('tags', function(data) {
		if (typeof data.tags !== 'undefined') {
			var arrayLength = data.tags.length;
			for (var i = 0; i < arrayLength; i++) {
				tagsReadable.push(data.tags[i]);
      }
      tagsUpdated = true;
		} else {
      tagsUpdated = true;
    }
	});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.function == "addTag") {
      var tag = request.tag;
      if (!tagsReadable.includes(tag)) {
        tagsReadable.push(tag);
        waitForAsyncAndUpdateTags();
      }
    }

    if (request.function == "deleteTag") {
      var tag = request.tag;
      if (tagsReadable.includes(tag)) {
        var index = tagsReadable.indexOf(tag);
        if (index > -1) {
          tagsReadable.splice(index, 1);
          waitForAsyncAndUpdateTags();
        }
      }
    }

    if (request.function == "download") {
      download(request);
    } 

    if (request.function == "test") {
      //updateDatabaseRequest();
    }
  }
);

function waitForAsyncAndUpdateTags() {
  if (tagsUpdated) {
    updateTags();
  } else {
    setTimeout(function(){
      waitForAsyncAndUpdateTags();
    },100);
  }
}

function updateTags() {
	chrome.storage.local.set({tags: tagsReadable}, function() {
	});
}

function download(message) {
  var numberOfImages = message.numberOfImages;
  var srcNumber = message.srcNumber;
  var title = message.title;

  title = title.replace(/[/\\?%*:|"<>]/g, '-');

  for (let index = 1; index <= numberOfImages; index++) {
    var url = "https://i.nhentai.net/galleries/" + srcNumber + "/" + index + ".jpg";
    var fileName = "./" + title + "/" + index + ".jpg";

    chrome.downloads.download({
      url: url,
      filename: fileName
    });
  }
}

function updateDatabaseRequest() {
	var request = $.ajax({
        async: true,
        crossDomain : true,
		url: "https://nhentai.net/",
		method: "GET",
    });
    
    request.fail(function(data){
        var oo = 0;
        setTimeout(function(){
            
          },800);
    });
	
	request.done(function(data) {
		var oo = 0;
    });
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://nhentai.net/", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            alert(xhr.responseText);
        }
    }
    xhr.send();
}