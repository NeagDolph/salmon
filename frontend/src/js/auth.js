import axios from 'axios';
import { apiurl } from './globals.js';
import { app } from '../main.js';
import { store } from "./store.js"

export var signFuncs = {};

//Init google api
export var authFunc = (callback=false) => {
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
      let googleUser = auth2.currentUser.get()
      let profile = googleUser.getBasicProfile();

      store.commit("mutate", ["auth2", auth2])
      store.commit("mutate", ["profile", {
        picture: profile.getImageUrl(),
        name: profile.getName()
      }])
      
      if (callback) callback(auth2.isSignedIn.get())
    });
});
}

//Verify login with backend API
export var authFunc2 = () => {
  let googleUser = store.state.auth2.currentUser.get()
  let idtoken = googleUser.getAuthResponse().id_token

  axios
    .post(apiurl.auth + idtoken)
    .then(data => {
      store.commit("mutate", ['loggedin', true])
      store.commit("updateUserData", data.data)
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