import axios from 'axios';
import Vue from "vue";
import { apiurl } from "../js/globals";
import { app } from '../main'
import MicroModal from 'micromodal';

Vue.mixin({
    methods: {
      usereditmodal(user) {
        MicroModal.show('modal-useredit')
        app.editSelect = user
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
      addComment(user, idx, userindex) {
          
      }
    }
})