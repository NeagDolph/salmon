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
      //User = object with userid and classes
      //Idx = index of class to be changed
      //User = Index of user in userlist

        // Flip selected class index
        let classes = user.classes.split("")
        classes[idx] = classes[idx] == "1" ? "0" : "1"
        classes = classes.join("")
        
        // Create a temp sharedData, modify it and set the app.sharedData as the temp one
        let tempShared = app.sharedData
        tempShared.users[userindex].classes = classes
        app.$set(app.sharedData, 'sharedData', tempShared)

        // Send class change to server
        axios
          .post(apiurl.classes, { class: idx, userid: user.userid, new: classes[idx] })
          .then(() => {
            axios.post(apiurl.data);
          })
          .catch(error => {
            let tempShared = app.sharedData
            tempShared.users[userindex].classes = user.classes
            app.$set(app.sharedData, 'sharedData', tempShared)
          });
      },
      addComment(user, idx, usercomment) {
        return axios.post(apiurl.comment, { class: idx, userid: user.userid, comment: usercomment})
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