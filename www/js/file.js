 
function b64toBlob(b64Data, contentType, sliceSize) {
	//console.log(b64Data)
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function cpfErrorLog(e) {
		console.log("CPF: ",e);
	
}

function cpfGetSampleFile(dirEntry,data) {
	console.log(dirEntry);
	console.log(data);

        var blob=b64toBlob(data.data.DOC,data.data.MIME);

	dirEntry.getFile(data.data.NAME, { create: true, exclusive: false }, function (fileEntry) {
		console.log("Creating file: ",fileEntry);
		fileEntry.createWriter(function (fileWriter) {

			fileWriter.onwriteend = function(e) {
				console.log("Successful file write..."+e.target.localURL,e);
				
				//window.open(e.target.localURL, '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');            
				/*window.plugins.webintent.startActivity({
					action: 'android.intent.action.VIEW',
					mime:data.data.MIME,
					url: e.target.localURL},
					function(e) {console.log("SUCCESS INTENT",e)},
					function(e) {console.log("FAIL INTENT",e)}
				);*/
				console.log("Successful file write..."+fileEntry.nativeURL);
				cordova.plugins.fileOpener2.open(
					fileEntry.nativeURL, 
					data.data.MIME, 
					{
						error : function(e){ console.log("SUCCESS OPEN",e)}, 
						success : function(e){console.log("FAIL OPEN",e) } 
					} 
				);
			};

			fileWriter.onerror = function(e) {
				console.log("Failed file write: " + e.toString());
			};

			fileWriter.write(blob);
		});
    }, cpfErrorLog);
 
}

function showFile(data) {

	if (device.platform=="Android") {
		window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory,
			function(dirpointer){ 
				console.log("Directory opened",dirpointer)
				cpfGetSampleFile(dirpointer,data)
			});
		
	} else if (device.platform=="iOS") {
		window.resolveLocalFileSystemURL(cordova.file.tempDirectory,
			function(dirpointer){ 
				console.log("Directory opened",dirpointer)
				cpfGetSampleFile(dirpointer,data)
			});
	}

}
