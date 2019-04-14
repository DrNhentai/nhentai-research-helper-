allTextNodes = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
var linkedComics = [];

var currentTextNode;
while (currentTextNode = allTextNodes.nextNode()) {
    foundMatches = currentTextNode.nodeValue.match(/[0-9]{5,6}/g);
    if (foundMatches != null) {
        allTextNodes.nextNode();
        var converted = "https://nhentai.net/g/" + foundMatches[0];
        var v = currentTextNode.nodeValue;
        v = v.replace(foundMatches[0], `<a href=${converted}>${foundMatches[0]}</a>`);

        var htmlParser = document.createElement('div');
        htmlParser.innerHTML = v;
        var newNodes = htmlParser.childNodes;

        var image = document.createElement("IMG");
        image.src = "https://t.nhentai.net/galleries/1398011/cover.png";

        while (newNodes.length) {
            currentTextNode.parentNode.insertBefore(image, currentTextNode);
            currentTextNode.parentNode.insertBefore(newNodes[0], currentTextNode);
            linkedComics.push(currentTextNode);
        }
        currentTextNode.parentNode.removeChild(currentTextNode);
    } 
}
chrome.runtime.sendMessage({
    function: "test",

});