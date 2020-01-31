import axios from 'axios';
import { userauth, apiurl } from './globals';

export var signFuncs = {};


export var authFunc = app => {
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
      signFuncs.auth2 = auth2;
      signFuncs.signedIn = signedIn;
      if (auth2.isSignedIn.get()) signedIn(auth2.currentUser.get());
      else app.$set(app.loggedin, 'loggedin', false)
    });
});

let signedIn = (googleUser, first=false) => {
  userauth.authResponse = googleUser.getAuthResponse();
  userauth.profile = googleUser.getBasicProfile();

  console.log("FIRST", first)
  axios
    .post(apiurl.login, { idtoken: userauth.authResponse.id_token })
    .then(data => {
      if (data == "success") {
        
        app.$set(app.loggedin, 'loggedin', true)
        axios.post(apiurl.data);
      } else {
        app.rawData = data.data
        axios.post(apiurl.data);
        if (first) window.location.reload()
      }
    })
    .catch(e => {
      console.log("login failed", e);
    });
};

signFuncs.signOut = () => {
  userauth.authInstance = gapi.auth2.getAuthInstance();
  userauth.authInstance.signOut().then(() => {
    axios.get(apiurl.logout).then(() => {
      window.location.reload()
    })
  });
};
}
