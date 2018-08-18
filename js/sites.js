/*
	sites.js
	-> updates sites from input
*/

//global variables
var order = ["first", "second", "third", "fourth", "fifth", "sixth"];

//check if the input value is empty
function isEmpty(siteNames) {
  return (siteNames === null || siteNames === " ") ? true : false;
}

//setting inputs to stored values
function prevSites() {
	chrome.storage.sync.get("trackSites", function(result){
		if (result.trackSites !== null){
			var sitesBeingTracked = JSON.parse(result.trackSites);
		  for (i=0; i<6; i++) {
		  	document.getElementById(order[i]).value = (sitesBeingTracked[i] === undefined) ? "" : sitesBeingTracked[i];
		  }
	  }
	});
}

//getting site names from user input
function updateSites() {
	var siteNames = [];
	for (i=0; i<6; i++){
		if (document.getElementById(order[i]) !== null){
			if (!isEmpty(document.getElementById(order[i]).value)){
				siteNames[i] = document.getElementById(order[i]).value;
				console.log(siteNames[i]);
			}
		}
	}
	//storing site names
	var siteNamesStorable = JSON.stringify(siteNames);
  chrome.storage.sync.set({"trackSites" : siteNamesStorable}, function(){console.log(siteNamesStorable);});

  //send message to background.js to update block
  chrome.runtime.sendMessage({bool: true}, function(response) {
  	console.log("sent");
  });
}

//on dom load
document.addEventListener('DOMContentLoaded', function () {
	//setting inputs to stored values
	prevSites();

	//update sites and blocking when button is pressed
  document.getElementById("button").addEventListener('click', function() {
  	updateSites();
  });
});
