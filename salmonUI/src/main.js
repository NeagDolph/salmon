import Vue from "vue";
import Main from "./App";
import { sharedData, userauth } from "./js/globals";
import './js/auth';
import './js/sockets';
import MicroModal from 'micromodal';
import './mixins/mixins'

// import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

export let app = new Vue({
  data: {
    sharedData: sharedData,
    userauth: userauth,
    editSelect: "",
  },
  el: "#app",
  template: '<Main :sharedData="sharedData" :loggedin="sharedData.logged" :editSelect="editSelect"/>',
  components: { Main },
  mounted: function () {
    this.$nextTick(function () {
      MicroModal.init();
    })
  }
});
