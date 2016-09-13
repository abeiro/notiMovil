
var BACKEND = "https://dmz.cajaruraldelsur.es/ws/notiMovil/";
var client = null;

function Client() {
    this.token = null;
    this.backend = BACKEND;
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
            if (e.status == "KO")
                console.log(e);
            else
                console.log(e);
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


}
