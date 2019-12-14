import Vue from "vue";
import Main from "./App.vue";
import { sharedData, userauth } from "./globals.js";
import './auth.js';
import './sockets.js';
import MicroModal from 'micromodal';

// import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export let app = new Vue({
  data: {
    sharedData: sharedData,
    userauth: userauth,
    editSelect: ""
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
    }
  }
})
