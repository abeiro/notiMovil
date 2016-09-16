var BACKEND = "https://dmz.cajaruraldelsur.es/ws/notiMovil/";
var client = null;



function Client() {
    this.token = null;
    this.backend = BACKEND;
	this.token = window.localStorage.getItem("AUTHTOKEN");
	$("#userLabel").html("Conectado como: " +window.localStorage.getItem("LASTUSER"))

	
}

Client.prototype.connect = function () {
	_this=this;
    $.ajax({
        type: "POST",
        url: BACKEND,
        crossDomain: true,
        beforeSend: function () { $.mobile.loading('show') },
        complete: function () { $.mobile.loading('hide') },
        data: { "TOKEN": this.token },
        dataType: 'json',
        success: function (e) {
            if (e.status == "KO") {
                console.log(e);
				$("body").pagecontainer("change", "#login");
                
			}
            else
				_this.list();
;
        },
        error: function () {
           console.error("error");
        }
    });
}

Client.prototype.list = function () {
	_this=this;
    $.ajax({
        type: "POST",
        url: BACKEND,
        crossDomain: true,
        beforeSend: function () { $.mobile.loading('show') },
        complete: function () { $.mobile.loading('hide') },
        data: { "TOKEN": this.token,"COMMAND":"LIST" },
        dataType: 'json',
        success: function (e) {
            if (e.status == "KO") {
                console.log(e);
			}
            else {
				markup="";
				$.each(e.datalist, function(index, value) {
					console.log(value);
					if (value.RECIBIDO!=null) 
						cssclass="received";
					else
						cssclass=""; 
						 

					markup += "<li  class='clickable "+cssclass+"' ca='"+value.IDI+"'><p><a >"+value.ASUNTO+"</a></p><span class='listdate'>"+value.FECHA+"</span></li>";
				});
                $("#mainList").html(markup)
				$("#mainList").listview();
				$("li.clickable").on("click",function(e) {
					  _oevent=e.originalEvent.currentTarget;
					 _this.getDetail(e.originalEvent.currentTarget.getAttribute("ca"), function(pp) {
						 $("#notTitle").html(pp.data.ASUNTO);
						 $("#notDetail").html(pp.data.TXT);
						 $("#notAttachment").html(pp.data.DE);
						 _oevent.className += "received" ;
						 $("body").pagecontainer("change", "#detail");
					 });
					
				});
			}
        },
        error: function () {
           console.error("error");
        }
    });
}

Client.prototype.getDetail = function (idi,callback) {
	_this=this;
    $.ajax({
        type: "POST",
        url: BACKEND,
        crossDomain: true,
        beforeSend: function () { $.mobile.loading('show') },
        complete: function () { $.mobile.loading('hide') },
        data: { "TOKEN": this.token,"IDI":idi,"COMMAND":"DETAIL" },
        dataType: 'json',
        success: function (e) {
            if (e.status == "KO") {
                console.log(e);
			}
            else {
				callback(e);
			}
        },
        error: function () {
           console.error("error");
        }
    });
}

Client.prototype.login = function (user,password) {
	_this=this;
    $.ajax({
        type: "POST",
        url: BACKEND,
        crossDomain: true,
        beforeSend: function () { $.mobile.loading('show') },
        complete: function () { $.mobile.loading('hide') },
        data: { "USER": user ,"PASSWORD":password,"COMMAND":"LOGIN"},
        dataType: 'json',
        success: function (e) {
            if (e.status == "KO") {
                console.log(e);
			}
            else {
				_this.token=e.token;
				window.localStorage.setItem("AUTHTOKEN",e.token);
				window.localStorage.setItem("LASTUSER",user)
				$("#userLabel").html("Conectado como: "+user)
				$("body").pagecontainer("change", "#index");
				_this.list();
                console.log(e);
			}
        },
        error: function () {
           console.error("error");
        }
    });
}

function updateHandler(data) {
	if (data.LatestResult != null) {
      try {
         console.log("Update received");
      } catch (err) {
      }
   }
	
	
}

function initSystem() {

	
	 
	$("body").css("visibility","visible")
	
    console.log("Starting Core");
    client = new Client();
    client.connect();

	/* Listeners */
	$('#loginButton').click(function() { 
		client.login($("#user").val(),$("#password").val());
	});
	
	$('#exitApp').click(function() { 
		navigator.app.exitApp();
	});
	
	$( "#detail" ).on( "pagebeforeshow", function( event, ui ) {
		
		
		
	} );
	
	/* Background mode */
	try {
		cordova.plugins.backgroundMode.enable();
		cordova.plugins.backgroundMode.setDefaults({
			title:  "notiMovil",
			text: "Ejecutándose en segundo plano"
			
		});
	} catch (e) {}

	try {
		var serviceName = 'com.red_folder.phonegap.plugin.backgroundservice.NotiMovilService';
		var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
		myService = factory.create(serviceName);

		myService.getStatus(function(r){
			if (r.ServiceRunning==false) {
				myService.startService(function(r){
					console.log(r) 
					myService.enableTimer(60000, 
						function(r){
							if (!r.RegisteredForUpdates) {
								myService.registerForUpdates(function(r){
									updateHandler(r)
									
								}, function(e){
									console.log(e);
									
								});
							}
							
						},function(r){
							console.log(r)
							
						});
				},function(r){
					console.log(r)
					
				});
				
			}
			
		});
	} catch (e) {}
	
	/* Prevent exit on back button */
	document.addEventListener("backbutton", function(e){
       if($.mobile.activePage.is('#index')){
           e.preventDefault();
           //navigator.app.exitApp();
       }
       else {
           navigator.app.backHistory()
       }
    }, false);

}


if (typeof app != 'undefined')
	document.addEventListener("deviceready", initSystem, false);
else {
	$(document).ready(function () {
		initSystem();
	});
}
