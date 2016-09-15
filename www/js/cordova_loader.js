if (window.location.pathname.includes("/android_asset")) {
	console.log("Loading Cordova");
	var head = document.getElementsByTagName('head')[0];
	var js = document.createElement("script");
	js.type = "text/javascript";
	js.src = "cordova.js";
	head.appendChild(js);
	
} else {
	console.log("Not loading Cordova");	
}
