import Vue from "vue";
import Main from "./App.vue";
import { sharedData, userauth } from "./globals.js";
import './auth.js';
import './sockets.js';
import MicroModal from 'micromodal';
import axios from 'axios';

// import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export let app = new Vue({
  data: {
    sharedData: sharedData,
    userauth: userauth,
    editSelect: "",
  },
  el: "#app",
  template: '<Main :sharedData="sharedData" :loggedin="sharedData.logged" editSelect="editSelect"/>',
  components: { Main },
  mounted: function () {
    this.$nextTick(function () {
      MicroModal.init();
    })
  }
});

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

      console.log("CLASS", idx)

      axios
        .post("/editclasses", { class: idx, userid: user.userid, new: classes[idx] })
        .then(({data}) => {
          axios.post("/getdata");
        })
        .catch(error => {
          console.log(error.response)
          console.log("b", app.sharedData.users[userindex].oldclasses, user.classes, classes)
          app.sharedData.users[userindex].classes = app.sharedData.users[userindex].oldclasses
        });
    }
  }
})
