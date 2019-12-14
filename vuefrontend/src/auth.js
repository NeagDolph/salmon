let axios = require("axios");
import { sharedData, userauth } from './globals.js';
import { parseData } from './parse.js';

gapi.load("auth2", function() {
  gapi.auth2
    .init({
      client_id:
        "203450520052-4olsv1k1uj6ditok97qncbho9n8usk36.apps.googleusercontent.com",
      cookiepolicy: "single_host_origin",
      scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
      ]
    })
    .then(auth2 => {
      sharedData.signFuncs.signIn = () =>
        auth2.signIn().then(() => signedIn(auth2.currentUser.get()));
      if (auth2.isSignedIn.get()) signedIn(auth2.currentUser.get());
      else sharedData.logged = false
    });
});

let signedIn = googleUser => {
  userauth.authResponse = googleUser.getAuthResponse();
  userauth.profile = googleUser.getBasicProfile();

  axios
    .post("/glogin", { idtoken: userauth.authResponse.id_token })
    .then(({data}) => {
      if (data) {
        console.log("GLOG", data)
        parseData(data)
        sharedData.logged = true
      }
      axios.post("/getclasses");
    })
    .catch(e => {
      console.log("login failed", e);
    });
};

sharedData.signFuncs.signOut = () => {
  userauth.authInstance = gapi.auth2.getAuthInstance();
  userauth.authInstance.signOut().then(() => {
    window.location.href = "/logout";
  });
};
