import Vue from "vue";
import Main from "./App";
import { sharedData, userauth } from "./js/globals";
import './js/auth';
import './js/sockets';
import './mixins/mixins'

// import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

export let app = new Vue({
  data: {
    sharedData: sharedData,
    userauth: userauth,
    editSelect: "",
    editState: false,
    classes: []
  },
  el: "#app",
  template: '<Main :sharedData="sharedData" :loggedin="sharedData.logged" :editSelect="editSelect" :editState="editState"/>',
  components: { Main },
});
