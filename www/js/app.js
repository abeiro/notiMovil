var BACKEND = "https://dmz.cajaruraldelsur.es/ws/notiMovil/";
var client = null;
var myService=null;
var pushManager=null;



function Client() {
    this.token = null;
    this.backend = BACKEND;
	this.token = window.localStorage.getItem("AUTHTOKEN");
	$("#userLabel").html("Conectado como: " +window.localStorage.getItem("LASTUSER"))
	if (this.token!=null) {
		
		
		
		
	}
	
}

Client.prototype.pushServiceRegister=function() {
	_this=this;
	try {
			pushManager=PushNotification.init({
			android: {
				senderID: "734498272275"
			},
			browser: {
				pushServiceURL: 'https://notimovil-3cc96.firebaseio.com'
			},
			ios: {
				senderID: "734498272275",
				alert: "true",
				badge: "false",
				sound: "true"
			},
			windows: {}
		});
	
		pushManager.on('registration', function(data) {
			console.log("Registration:",data);
			_this.updatePushToken(data.registrationId);
		});

		pushManager.on('notification', function(data) {
			// data.message,
			// data.title,
			// data.count,
			// data.sound,
			// data.image,
			// data.additionalData
			console.log(data);
			_this.list();
		});

		pushManager.on('error', function(e) {
			console.error(e);
		});
		
	} catch (e) {console.error(e) }
}

Client.prototype.updatePushToken = function (fcmToken) {
	_this=this;
    $.ajax({
        type: "POST",
        url: BACKEND,
        crossDomain: true,
        beforeSend: function () { $.mobile.loading('show') },
        complete: function () { $.mobile.loading('hide') },
        data: { "TOKEN": this.token ,"FCMTOKEN": fcmToken,"COMMAND":"FCM" },
        dataType: 'json',
        success: function (e) {
            if (e.status == "KO") {
                console.error(e);
                
			}
            else {

				
			}
;
        },
        error: function () {
           console.error("error");
        }
    });
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
            else {
				if (pushManager==null)
					_this.pushServiceRegister();
				_this.list();
			}
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
				try {
					$.each(e.datalist, function(index, value) {
						//console.log(value);
						if (value.RECIBIDO!=null) 
							cssclass="received";
						else
							cssclass=""; 
							

						markup += "<li  class='clickable "+cssclass+"' ca='"+value.IDI+"'><p><a >"+value.ASUNTO+"</a></p><span class='listdate'>"+value.FECHA+"</span><span class='originApp'>"+((value.APP==null)?"":value.APP)+"</span></li>";
					});
				} catch (e) {}
                $("#mainList").html(markup)
				$("#mainList").listview();
				$("li.clickable").on("click",function(e) {
					  _oevent=e.originalEvent.currentTarget;
					 _this.getDetail(e.originalEvent.currentTarget.getAttribute("ca"), function(pp) {
						 markup="";
						 $("#notTitle").html(pp.data.ASUNTO);
						 $("#notFecha").html(pp.data.FECHA);
						 $("#notOriginApp").html(pp.data.APP);
						 $("#notTitle").html(pp.data.ASUNTO);
						 $("#notDetail").html(pp.data.TXT);
						 $("#notAttachment").html('');
						 $('#acceptButton').show()
						 $('#denyButton').show()
						 _oevent.className += " received" ;
						 
						 if (pp.data.atts!=null) {
							  $.each(pp.data.atts,function(index,value) {
									r=jQuery('<li/>', {
										text: value.NAME
									}).appendTo('#notAttachment').click(function(e) {
										console.log("click: "+value.IDI);
										client.getAttachment(value.IDI,function(e) {
											console.log(e);
											showFile(e);
											
										});
										
									});;
									
									
							  });
							  
						 }
						 
						 $("#OID").val(_oevent.getAttribute("ca"));
						 $("#comentarios").val("")
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


Client.prototype.getAttachment = function (idi,callback) {
	_this=this;
    $.ajax({
        type: "POST",
        url: BACKEND,
        crossDomain: true,
        beforeSend: function () { $.mobile.loading('show') },
        complete: function () { $.mobile.loading('hide') },
        data: { "TOKEN": this.token,"IDI":idi,"COMMAND":"ATTACHMENT" },
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

Client.prototype.accept = function (idi,comentarios,callback) {
	_this=this;
    $.ajax({
        type: "POST",
        url: BACKEND,
        crossDomain: true,
        beforeSend: function () { $.mobile.loading('show') },
        complete: function () { $.mobile.loading('hide') },
        data: { "TOKEN": this.token,"IDI":idi,"COMMAND":"ACCEPT" ,"REASON":comentarios},
        dataType: 'json',
        success: function (e) {
            if (e.status == "KO") {
                console.log(e);
			}
            else {
				$("#notTitle").html('');
				$("#notDetail").html('');
				$("#notFecha").html('');
				$("#notOriginApp").html('');
				$("#notAttachment").html('');
				$('#acceptButton').hide()
				$('#denyButton').hide()		 
				callback(e);
			}
        },
        error: function () {
           console.error("error");
        }
    });
}

Client.prototype.deny = function (idi,comentarios,callback) {
	_this=this;
    $.ajax({
        type: "POST",
        url: BACKEND,
        crossDomain: true,
        beforeSend: function () { $.mobile.loading('show') },
        complete: function () { $.mobile.loading('hide') },
        data: { "TOKEN": this.token,"IDI":idi,"COMMAND":"DENY","REASON":comentarios },
        dataType: 'json',
        success: function (e) {
            if (e.status == "KO") {
                console.log(e);
			}
            else {
				$("#notTitle").html('');
				$("#notDetail").html('');
				$("#notAttachment").html('');
				$('#acceptButton').hide()
				$('#denyButton').hide()
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
				
				if (_this.token!=null) {
					_this.pushServiceRegister();
				}
	
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
		console.log("BGSERVICE: Update received:");
		try {
			if (data.LatestResult.cmd=="REQ_CONFIG") {
				myService.setConfiguration({"token":client.token});
				console.log("myService.setConfiguration({'token':"+client.token+"});");
			}
      
			
			console.log(data);
		} catch (err) {
			
      }
   }
	
}

function initSystem() {

	
	/* Background mode */
	/*try {
		cordova.plugins.backgroundMode.enable();
		cordova.plugins.backgroundMode.setDefaults({
			title:  "notiMovil",
			text: "Ejecutándose en segundo plano"
			
		});
	} catch (e) {}
	*/
	try {
		var serviceName = 'com.red_folder.phonegap.plugin.backgroundservice.NotiMovilService';
		var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
		myService = factory.create(serviceName);

		myService.getStatus(function(r){
			if (r.ServiceRunning==false) {
				console.log("BGSERVICE: Starting service");
				myService.startService(function(r){
					console.log(r) 
					console.log("BGSERVICE: Setting timer");
					myService.enableTimer(60000, 
						function(r){
							console.log("BGSERVICE: enableTimer done");
							myService.registerForBootStart(function(r){console.log("Registered for boot start")}, function(r){});
							if (!r.RegisteredForUpdates) {
								console.log("BGSERVICE: RegisteredForUpdates ...");
								myService.registerForUpdates(function(r){
									console.log("BGSERVICE: registerForUpdates running");
									updateHandler(r);
									
								}, function(e){
									console.log(e);
									console.log("BGSERVICE: RegisteredForUpdates failed");

									
								});
							}
							
						},function(r){
							console.log(r)
							console.log("BGSERVICE: enableTimer failed");

							
						});
				},function(r){
					console.log(r)
					console.log("BGSERVICE: startService failed");
					
				});
				
			} else {
				myService.enableTimer(60000, 
					function(r){
						console.log("BGSERVICE: enableTimer done");
						if (!r.RegisteredForUpdates) {
							myService.registerForUpdates(function(r){
								console.log("BGSERVICE: registerForUpdates done");
								updateHandler(r)
								
						}, function(e){
								console.log(e);
								console.log("BGSERVICE: registerForUpdates failed");
							});
						}
						
					},function(r){
						console.log("BGSERVICE: enableTimer failed");
						console.log(r)
						
					});
			}
			
			
		});
	} catch (e) {}
	
	try {
		fr=window.localStorage.getItem("FIRSTRUN");
		if (fr==null) {
			window.plugins.webintent.startActivity({
				action: 'android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
				url: 'package:es.crsur.notimovil'},
				function(e) {console.log(e);window.localStorage.setItem("FIRSTRUN","false");},
				function(e) {console.log(e)}
			);
		}
		
		
	} catch (e) {
		
		
	}
	
	$("body").css("visibility","visible")
	
    console.log("Starting Core");
    client = new Client();
    client.connect();

	/* Listeners */
	$('#loginButton').click(function() { 
		client.login($("#user").val(),$("#password").val());
	});
	
	document.addEventListener("resume", function() {
		client.connect();
	}, false);
	
	$('#exitApp').click(function() { 
		navigator.app.exitApp();
	});
	
	$( "#detail" ).on( "pagebeforeshow", function( event, ui ) {
		
		
		
	} );
	
	$('#acceptButton').click(function() { 
		 $("#ACTION").val("A");
		 $('#finalSend').val("ACEPTAR");
		 
		 $('#finalSend').removeClass("clr-primary")
		 $('#finalSend').removeClass("clr-warning")
		 $('#finalSend').addClass("clr-primary")
		 
		 $.mobile.changePage('#sendDialog', {reverse: false, changeHash: false});
		 
		
	});
	
	$('#denyButton').click(function() { 
		 $("#ACTION").val("D");
		 $('#finalSend').val("DENEGAR");
		 
		  $('#finalSend').removeClass("clr-primary")
		 $('#finalSend').removeClass("clr-warning")
		 $('#finalSend').addClass("clr-warning")
		 
		 //$("body").pagecontainer("change", "#sendDialog");
		 $.mobile.changePage('#sendDialog', {reverse: false, changeHash: false});
		
	});
	
	$('#finalSend').click(function() { 
		if ($("#ACTION").val()=="A") {
			client.accept($("#OID").val(),$("#comentarios").val(),function(e) {
				 $.mobile.changePage('#index', {reverse: false, changeHash: false});
				 client.connect();//Aqui podemos optimizar
			});
			
			
		} else if ($("#ACTION").val()=="D") {
			client.deny($("#OID").val(),$("#comentarios").val(),function(e) {
				$.mobile.changePage('#index', {reverse: false, changeHash: false});
				 
				 client.connect();//Aqui podemos optimizar
				
			});
		}
	});
	
	
	/* Prevent exit on back button */
	/*document.addEventListener("backbutton", function(e){
       if($.mobile.activePage.is('#index')){
           e.preventDefault();
           //navigator.app.exitApp();
       }
       else {
           navigator.app.backHistory()
       }
    }, false);*/

}


if (window.location.pathname.indexOf("/android_asset")!=-1) 
	document.addEventListener("deviceready", initSystem, false);
else {
	$(document).ready(function () {
		initSystem();
	});
}
