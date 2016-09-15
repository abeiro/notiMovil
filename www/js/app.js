var BACKEND = "https://dmz.cajaruraldelsur.es/ws/notiMovil/";
var client = null;



function Client() {
    this.token = null;
    this.backend = BACKEND;
	this.token = window.localStorage.getItem("AUTHTOKEN");
	$("#userLabel").html(window.localStorage.getItem("LASTUSER"))

	
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
					markup += "<li  ><p><a class='clickable' ca='"+value.IDI+"'>"+value.ASUNTO+"</a></p><span class='listdate'>"+value.FECHA+"</span></li>";
				});
                $("#mainList").html(markup)
				$("#mainList").listview();
				$("a.clickable").on("click",function(e) {
					 _this.getDetail(e.originalEvent.currentTarget.getAttribute("ca"), function(pp) {
						 $("#notTitle").html(pp.data.ASUNTO);
						 $("#notDetail").html(pp.data.TXT);
						 $("#notAttachment").html(pp.data.DE);
						 
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
				$("#userLabel").html(user)
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
