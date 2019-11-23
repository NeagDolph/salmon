var socket = io()
var wegood

toastr.options = {"closeButton": true, "debug": false, "newestOnTop": false, "progressBar": false, "positionClass": "toast-top-left", "preventDuplicates": false, "onclick": null, "showDuration": "300", "hideDuration": "1000", "timeOut": "250000", "extendedTimeOut": "1000", "showEasing": "swing", "hideEasing": "linear", "showMethod": "fadeIn", "hideMethod": "fadeOut"}

try {
    var auth2 = gapi.auth2.getAuthInstance();
} catch {
    var auth2 = undefined
}

socket.on("connect_error", () => {
    if (window.location.href.includes("atischool.net")) return;
    console.log("LMK")
    returned = [{name: "BS", status: 0}, {name: "CS", status: 1}, {name: "AS", status: 0}, {name: "BS", status: 0}, {name: "CS", status: 1}, {name: "AS", status: 0}, {name: "BS", status: 0}, {name: "CS", status: 1}, {name: "AS", status: 0}, {name: "BS", status: 0}, {name: "CS", status: 1}, {name: "AS", status: 0}, {name: "BS", status: 0}, {name: "CS", status: 1}, {name: "AS", status: 0}, {name: "BS", status: 0}, {name: "CS", status: 1}]
    app.classes = returned
    app.redclasses = returned.filter((el) => {
        return el.status === 0
    })
    app.offcampus = true
})

socket.on("update", obj => {
    update(obj)
});


socket.on("updateusers", obj => {
    formatusers(obj.users)
});

function update(obj) {
    app.classes = obj.classes
    app.redclasses = obj.classes.filter((el) => {
        return el.status == 0
    })
}

function formatusers(e) {
    app.users = e.map((el) => {
        return {email: el[0], name: el[1], student: el[3]}
    })
}


var app = new Vue({
    el: "#app",
    data: {
        offcampus: 0,
        classes: [],
        render: false,
        teacher: false,
        admin: false,
        loggedin: auth2,
        redclasses: [],
        users: []
    },
    methods: {
        signOut() {
            if (auth2) auth2.signOut().then(function () {
                console.log('User signed out.');
                window.location.href = "/logout"
            });
        },
        titleSize(redclass) {
            //return bootstrap size class based on redclass.name length
            return redclass.name
        }
    }
})


// var googleUser = {};

function signedIn(googleUser) {
    guser = googleUser.getAuthResponse();
    profile = googleUser.getBasicProfile();

    console.log(guser, profile, googleUser)

    $("#customBtn").html("<i class=\"fab fa-google\"></i> &nbsp;Logout")
    // $(element).text(profile.getName());
    console.log("EEE", guser)

    var id_token = guser.id_token;

    $.ajax({
        method: "POST",
        url: 'https://atischool.net/glogin',
        data: {idtoken: id_token}
    }).done(function(e) {
        console.log("login successful")
        if (e) {
            console.log("REDIR", e)
            update(e)
        }
        $("#logout").show()
    }).fail(function(e) {
        console.log("login failed", e)
        // window.location.href = "/"
    });
}

gapi.load('auth2', function() {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    gapi.auth2.init({
        client_id: '203450520052-4olsv1k1uj6ditok97qncbho9n8usk36.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    }).then(function(auth2) {
        console.log( "signed in: " + auth2.isSignedIn.get() );  
        if (auth2.isSignedIn.get()) {
            signedIn(auth2.currentUser.get())
        }
        var button = document.getElementById('customBtn')
        button.addEventListener('click', function() {
          auth2.signIn();
        });
    });
});