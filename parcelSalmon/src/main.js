import Vue from "vue";
import Main from "./App.vue";
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
    mainClasses: []
  },
  template: '<Main :sharedData="sharedData" :loggedin="sharedData.logged" :editSelect="editSelect" :editState="editState" :mainClasses="mainClasses"/>',
  el: '#app',
  components: {
    Main
  }
});
