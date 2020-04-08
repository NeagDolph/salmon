import axios from 'axios';
import { userauth, apiurl } from './globals';
import { app } from '../main';

export var signFuncs = {};

//Init google api
export var authFunc = callback => {
gapi.load("auth2", () => {
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
      callback(auth2.isSignedIn.get())
    });
});
}

//Verify login with backend API
export var authFunc2 = () => {
  let googleUser = signFuncs.auth2.currentUser.get()
  userauth.authResponse = googleUser.getAuthResponse();
  userauth.profile = googleUser.getBasicProfile();

  axios
    .post(apiurl.auth + userauth.authResponse.id_token)
    .then(data => {
      app.$set(app.loggedin, 'loggedin', true)
      app.updateData(data.data)
    })
    .catch(error => {
      if (error.response) {
        console.log("login failed", error.response.status, error.response.data);

        if (error.response.data == "notati") {
          alert("ERROR! You are not an ATI user! Please use a google account under alt.app to login successfully.")
        }
      }
    });
}

signFuncs.signOut = () => {
  gapi.auth2.getAuthInstance().signOut().then(() => {
    axios.post(apiurl.deauth).then(() => {
      window.location.reload()
    })
  });
};
