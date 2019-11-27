import {app} from './app.js';
let axios = require('axios')

export let guser = {}

gapi.load('auth2', function() {
    gapi.auth2.init({
        client_id: '203450520052-4olsv1k1uj6ditok97qncbho9n8usk36.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    }).then((auth2) => {
        guser.signIn = () => auth2.signIn().then(() => signedIn(auth2));
        if (auth2.isSignedIn.get()) signedIn(auth2.currentUser.get())
    });
});

let signedIn = googleUser => {
    console.log("TRIGGEr", googleUser)

    guser.authResponse = googleUser.getAuthResponse();
    guser.profile = googleUser.getBasicProfile();
    app.loggedin = true;

    axios.post('/glogin', {idtoken: guser.authResponse.id_token})
    .then(({data}) => {
        console.log("EEK", data)
        if (data) app.classes = data.classes
        axios.post("/getclasses")
    }).catch(e => {
        console.log("login failed", e)
    });
}

export let signOut = () => {
    guser.authInstance = gapi.auth2.getAuthInstance();
    guser.authInstance.signOut().then(() => {
        window.location.href = "/logout"
    });
}