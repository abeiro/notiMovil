var BACKEND = "https://dmz.cajaruraldelsur.es/ws/notiMovil/";
var client = null;

function Client() {
    this.token = null;
    this.backend = BACKEND;
	this.token = window.localStorage.getItem("AUTHTOKEN");
	
}

Client.prototype.connect = function () {

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
                console.log(e);
        },
        error: function () {
           console.error("error");
        }
    });
}

Client.prototype.login = function (user,password) {

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
				this.token=e.token;
				window.localStorage.setItem("AUTHTOKEN",e.token);
				$("body").pagecontainer("change", "#index");
                console.log(e);
			}
        },
        error: function () {
           console.error("error");
        }
    });
}

function initSystem() {

    console.log("Starting Core");
    client = new Client();
    client.connect();

	/* Listeners */
	$('#loginButton').click(function() { 
		client.login($("#user").val(),$("#password").val());
	});

}
