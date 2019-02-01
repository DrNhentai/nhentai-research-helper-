// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let addTag = document.getElementById('addTag');
let tagContainer = document.getElementById('tagContainer');
let tagName = document.getElementById('tagName');

chrome.storage.local.get('tags', function(data) {
  var arrayLength = data.tags.length;
	for (var i = 0; i < arrayLength; i++) {
		newTag(data.tags[i]);
	}
});

addTag.onclick = function(element) {
	newTag(tagName.value);
	updateSettings();
	
  //let color = element.target.value;
  //chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //  chrome.tabs.executeScript(
  //      tabs[0].id,
  //      {code: 'document.body.style.backgroundColor = "' + color + '";'});
  //});
};

function newTag(name) {
	var btn = document.createElement("BUTTON");
	btn.onclick = function() {
		tagContainer.removeChild(btn);
		updateSettings();
	};
	btn.setAttribute("class", "tagButton");
	btn.innerHTML = name;
	tagContainer.appendChild(btn)
}

function updateSettings() {
	var tagElememts = document.getElementsByClassName("tagButton");
	var tags = [];
	var arrayLength = tagElememts.length;
	for (var i = 0; i < arrayLength; i++) {
		tags.push(tagElememts[i].innerHTML);
	}
	chrome.storage.local.set({tags: tags}, function() {
        console.log('tags are ' + tags);
      })
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
	  console.log(response.farewell);
	});
  });
