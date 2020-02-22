import axios from 'axios';
import Vue from "vue";
import { apiurl } from "../js/globals";
import { app } from '../main';

Vue.mixin({
    methods: {
      usereditmodal(state, user=false) {
        app.editState = state;
        if (user) app.editSelect = user
      },
      editUserClasses(user, idx, userindex) {
        app.sharedData.users[userindex].oldclasses = user.classes
        let classes = user.classes.split("")
        classes[idx] = classes[idx] == "0" ? "1" : (classes[idx] == "1" ? "0" : "1")
        classes = classes.join("")
        app.sharedData.users[userindex].classes = classes
  
        axios
          .post(apiurl.classes, { class: idx, userid: user.userid, new: classes[idx] })
          .then(() => {
            axios.post(apiurl.data);
          })
          .catch(error => {
            console.log(error.response)
            console.log("error: ", app.sharedData.users[userindex].oldclasses, user.classes, classes)
            app.sharedData.users[userindex].classes = app.sharedData.users[userindex].oldclasses
          });
      },
      addComment(user, idx, usercomment) {
        axios
        .post(apiurl.comment, { class: idx, userid: user.userid, "comment": usercomment})
        .then((data) => {
          return "PEE"
        })
        .catch(() => {
          console.log("EE")
          return "PEE"
        })
      },
      requestComment(user, idx) {
        axios
          .post(apiurl.getcomment, { class: idx, userid: user.userid })
          .then((data) => {
            return "PEE"
            // return data
          })
          .catch((e) => {
            console.log("Error requesting comment", e)
          })
      },
      setGlobal(area, val) {
        app.global[area] = val
      }
    }
})