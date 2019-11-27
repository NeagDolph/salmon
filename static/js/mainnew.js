var socket = io()
var wegood

toastr.options = {"closeButton": true, "debug": false, "newestOnTop": false, "progressBar": false, "positionClass": "toast-top-left", "preventDuplicates": false, "onclick": null, "showDuration": "300", "hideDuration": "1000", "timeOut": "250000", "extendedTimeOut": "1000", "showEasing": "swing", "hideEasing": "linear", "showMethod": "fadeIn", "hideMethod": "fadeOut"}

try {
    var auth2 = gapi.auth2.getAuthInstance();
} catch {
    var auth2 = undefined
}

// socket.on("connect_error", () => {
//     if (window.location.href.includes("atischool.net")) return;
//     console.log("LMK")
//     returned = [{name: "BS", status: 0}, {name: "CS", status: 1}, {name: "AS", status: 0}, {name: "BS", status: 0}, {name: "CS", status: 1}, {name: "AS", status: 0}, {name: "BS", status: 0}, {name: "CS", status: 1}, {name: "AS", status: 0}, {name: "BS", status: 0}, {name: "CS", status: 1}, {name: "AS", status: 0}, {name: "BS", status: 0}, {name: "CS", status: 1}, {name: "AS", status: 0}, {name: "BS", status: 0}, {name: "CS", status: 1}]
//     app.classes = returned
//     app.redclasses = returned.filter((el) => {
//         return el.status === 0
//     })
//     app.offcampus = true
// })

socket.on("update", ({classes}) => {
    console.log("updoot")
    app.classes = classes
});


socket.on("updateusers", ({ users }) => {
    formatusers(users)
});

function update({classes}) {
    app.classes = classes
}

function formatusers(e) {
    app.users = e.map((el) => {
        return {email: el[0], name: el[1], student: el[3]}
    })
}


// var scrip = document.createElement("script")
// scrip.innerHTML = "setInterval(() => {debugger;}, 20)"
// document.body.appendChild(scrip)

var app = new Vue({
    el: "#app",
    data: {
        classes: [],
        render: false,
        teacher: false,
        admin: false,
        loggedin: false,
        users: [],
        signin: undefined,
        devtools: "false",
    },
    methods: {
        signOut() {
            if (auth2) auth2.signOut().then(function () {
                console.log('User signed out.');
                window.location.href = "/logout"
            });
        },
        titleSize({name}) {
            ratio = $("#ruler").text(name)[0].offsetWidth / ($("[data-simplebar] .simplebar-content>.card").width() * 0.93 - 31)
            return ratio > 1 ? `font-size: ${30/ (ratio * 0.97)}px` : `font-size: ${30}px`
        },
        classtype(type) {
            return this.classes.filter((el) => {
                return el.status == type
            })
        },
        redpercent() {
            return parseInt((this.classes.reduce((cum, cur) => !cur.status + cum, 0) / this.classes.length) * 100)
        },
        offcampus() {
            return this.classes.filter((el) => {return el.status == 0}).lenth > 1
        }
    }
})

// var googleUser = {};

gapi.load('auth2', function() {
    gapi.auth2.init({
        client_id: '203450520052-4olsv1k1uj6ditok97qncbho9n8usk36.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    }).then((auth2) => {
        app.signin = () => {app.loggedin ? signOut() : auth2.signIn().then(() => signedIn(auth2.currentUser.get()))};
        if (auth2.isSignedIn.get()) signedIn(auth2.currentUser.get())
    });
});

function signedIn(googleUser) {
    
    console.log("TRIGGEr", googleUser)
    // if (auth2.isSignedIn.get()) {
    //     signedIn(auth2.currentUser.get())
    // }

    guser = googleUser.getAuthResponse();
    profile = googleUser.getBasicProfile();

    app.loggedin = true;

    var id_token = guser.id_token;

    console.log("SIGNED")

    $.ajax({
        method: "POST",
        url: 'https://atischool.net/glogin',
        data: {idtoken: id_token}
    }).done(function(e) {
        if (e) app.classes = e.classes
    }).fail(function(e) {
        console.log("login failed", e)
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        window.location.href = "/logout"
    });
}