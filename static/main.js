socket = io();
var guser;
var profile;


// socket.emit("location", {
//     x: globalcords[1],
//     y: globalcords[0]
// });

socket.on("update", obj => {
    $("#update").text(obj.count)
});

function onSignIn(googleUser) {
    guser = googleUser.getAuthResponse();
    profile = googleUser.getBasicProfile();
    console.log("EEE", guser)
    var id_token = guser.id_token;
    

    $.ajax({
        method: "POST",
        url: 'https://atischool.net/glogin',
        data: {idtoken: id_token}
    }).done(function() {
        console.log("login successful")
        $("#logout").show()
    }).fail(function(e) {
        console.log("login failed", e)
        // window.location.href = "/"
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        window.location.href = "/logout"
    });
}