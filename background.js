'use strict';

var tagsReadable = [];
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
		}
	});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var tag = request.tag;

    if (request.function == "addTag") {
      if (!tagsReadable.includes(tag)) {
        tagsReadable.push(tag);
      }
    }

    if (request.function == "deleteTag") {
      if (tagsReadable.includes(tag)) {
        var index = tagsReadable.indexOf(tag);
        if (index > -1) {
          tagsReadable.splice(index, 1);
        }
      }
    }
    updateTags();
  }
);

function updateTags() {
	chrome.storage.local.set({tags: tagsReadable}, function() {
	});
}
