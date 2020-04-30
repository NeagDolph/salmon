import axios from 'axios';
import { apiurl } from './globals';
import { app } from '../main';

export var signFuncs = {}, userauth = {};

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
      let googleUser = auth2.currentUser.get()
      userauth.profile = googleUser.getBasicProfile();

      if (userauth.profile) userauth.profilePicture = userauth.profile.getImageUrl();
      else userauth.profilePicture = ""
      app.userauth = userauth
      
      callback(auth2.isSignedIn.get())
    });
});
}

//Verify login with backend API
export var authFunc2 = () => {
  let googleUser = signFuncs.auth2.currentUser.get()
  userauth.authResponse = googleUser.getAuthResponse();
  userauth.profile = googleUser.getBasicProfile();
  userauth.profilePicture = userauth.profile.getImageUrl();

  app.userauth = userauth

  axios
    .post(apiurl.auth + userauth.authResponse.id_token)
    .then(data => {
      console.log("logg", data)
      app.$set(app.loggedin, 'loggedin', true)
      app.updateData(data.data)
      app.joinRooms(data.data)
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
  console.log('signfunc')
  gapi.auth2.getAuthInstance().signOut().then(() => {
    axios.post(apiurl.deauth).then(() => {
      window.location.reload()
    })
  });
};
