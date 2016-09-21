 
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

		fileEntry.createWriter(function (fileWriter) {

			fileWriter.onwriteend = function(e) {
				console.log("Successful file write...",e);
				//window.open(e.target.localURL, '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');            
				window.plugins.webintent.startActivity({
					action: 'android.intent.action.SEND',
					url: e.target.localURL},
					function(e) {console.log("SUCCESS INTENT",e)},
					function(e) {console.log("FAIL INTENT",e)}
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
	window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

		console.log('file system open: ' + fs.name);
		cpfGetSampleFile(fs.root,data);

	}, cpfErrorLog);
	
	
	
}
