import axios from 'axios';
import Vue from "vue";
import { apiurl } from "../js/globals.js";
import { app } from '../main.js';
import { store } from "../js/store.js"

Vue.mixin({
    methods: {
      userEditEnrolled(userid, userclasses, idx, userindex) {
        // Flip selected class index
        let flippedClasses = userclasses.split("").map((e, i) => i == idx ? (e == "1" ? "0" : "1") : e).join("")
        
        // Create a temp sharedData, modify it and set the sharedData as the temp one
        let tempData = store.state.user.userlist
        tempData[userindex].studentclasses = flippedClasses
        store.commit("modifyUserData", ["userlist", tempData])

        // Send class change to server
        axios
          .put(apiurl.enroll, { userid: userid, class: idx, new: Boolean(Number(flippedClasses[idx])) })
          .then(() => {
          })
          .catch(error => {
            let oldTempData = store.state.user.userlist
            oldTempData[userindex].studentclasses = userclasses
            store.commit("modifyUserData", ["userlist", oldTempData])
          });
      },
      addTeacher(email, classes, update, callback) {
        if (!update) {
          axios
          .post(apiurl.teacher, { email: email })
          .then(res => {
            callback(res)
          })
        } else {
          axios
          .put(apiurl.teacher, { email: email, classes: classes })
          .then(res => {
            callback(res)
          })
        }
      },
      editUserClasses(user, idx, userindex) {
      //User = object with userid and classes
      //Idx = index of class to be changed
      //User = Index of user in userlist

        // Flip selected class index
        let flippedClasses = user.classes.split("").map((e, i) => i == idx ? (e == "1" ? "0" : "1") : e).join("")
        
        // Create a temp sharedData, modify it and set the app.sharedData as the temp one
        let tempData = store.state.user.userlist
        tempData[userindex].classes = flippedClasses
        store.commit("modifyUserData", ["userlist", tempData])

        // Send class change to server
        axios
          .put(apiurl.status, { userid: user.userid, class: idx, new: Boolean(Number(flippedClasses[idx])) })
          .then(() => {
          })
          .catch(error => {
            let userlist = store.state.user.userlist
            userlist[userindex].classes = user.classes
            store.commit("modifyUserData", ["userlist", userlist])
          });
      },

      addComment(user, idx, usercomment) {
        let tempData = store.state.user.userlist
        let oldcomment = tempData[user.index].comments[idx]

        tempData[user.index].comments[idx] = usercomment
        store.commit("modifyUserData", ["userlist", tempData])

        axios.post(apiurl.comment, { userid: user.userid, class: idx, comment: usercomment})
        .catch(e => {
          let oldTempData = store.state.user.userlist
          oldTempData[user.index].comments[idx] = usercomment
          store.commit("modifyUserData", ["userlist", oldTempData])
        })
      },

      getUserData() {
        return new Promise((res, rej) => {
          axios.get(apiurl.data)
            .then(data => {
              store.commit("updateUserData", data.data)

              res(data.data)
            })
            .catch(err => rej(err))
        });
      },

      signOut() {
        gapi.auth2.getAuthInstance().signOut().then(() => {
          axios.post(apiurl.deauth).then(() => {
            window.location.reload()
          })
        });
      }

    }
})