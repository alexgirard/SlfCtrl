/* 
	background.js
	-> blocks websites
*/


//when extension started
console.log("Loaded extension");

//global variable
var refreshSites = false;

//block request function
function blockRequest(details) {
	return {cancel: true};
}

//update sites being blocked
function updateFilters(urls){
	console.log("first!");
	
	if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest)){
  	chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  }
  //clears cache of old urls
  chrome.webRequest.handlerBehaviorChanged();
  console.log("Removed old block");
  
  var siteNames = [];
  
  chrome.storage.sync.get("trackSites", function(result){
		if (result.trackSites !== null){
			var sitesBeingTracked = JSON.parse(result.trackSites);
		  for (i=0; i<6; i++) {
		  	siteNames[i] = (sitesBeingTracked[i] === undefined) ? "" : sitesBeingTracked[i];
		  	console.log("Site: " + siteNames[i]);
		  }
		}
		console.log("second!");
		
	  //checks which urls are not empty
	  var usableUrls = [];
	  var j = 0;
	  if (siteNames){
		  for (i=0; i<6; i++) {
		  	if (siteNames[i] !==  "" && siteNames[i] !== null){
		  		usableUrls[j++] = "*://" + siteNames[i] + "/*";
		  		usableUrls[j++] = "*://*." + siteNames[i] + "/*";
		  	}
		  }
	  	console.log (usableUrls);
	  }
	    
	  //check if there are urls
	  if (usableUrls.length === 0){
			console.log("No URLS");
	  }
	  else {
	  	//as listener to block urls
			chrome.webRequest.onBeforeRequest.addListener(
				blockRequest, {urls: usableUrls}, ['blocking']);
			console.log("Added new block");
		}
		});
}

//make sure sites are being blocked when you open new tab
chrome.tabs.onCreated.addListener(function() {
	updateFilters();
});

//when button is pressed update sites being blocked
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	refreshSites = request.bool;
	if(refreshSites){
		if (refreshSites === true){
			console.log("Worked!");
			updateFilters();
			refreshSites = false;
		}
	}
});

/*
//check if blocking sites page is already open
chrome.tabs.onCreated.addListener(function (tab) {
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		var isTabOpen = false;
    for (var i = 0;i<tabs.length; i++) {
    	console.log(tabs[i].title);
    	if (tabs[i].title){
	    	if (tabs[i].title == "SlfCtrl") {
	        console.log("URL Match found",tabs[i].title);
	       	isTabOpen = true;
	      }
	    }
      else console.log("Match not found");
    }
    if (!isTabOpen){
    	chrome.tabs.update(tabs[tabs.length -1].id, {url: '../index.html'});
    }
  });        
});
*/
