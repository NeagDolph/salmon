import Vue from "vue";
import Main from "./App.vue";
import { userauth } from "./js/globals";
import './js/auth';
import './js/sockets';
import './mixins/mixins'

// import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

export var app = new Vue({
  data() {
    return {
      sharedData: {
        logged: undefined,
        signFuncs: {},
        teacher: false,
        admin: false,
        users: [],
        shortnames: ["Soc", "Wr", "Geo", "Stats", "LD", "PS", "Phy", "HRI", "CW", "UM", "Maker", "Pract"]
      },
      userauth: userauth,
      editSelect: "",
      editState: false,
      mainClasses: []
    }
  },
  // template: '<Main :sharedData="sharedData" :loggedin="sharedData.logged" :editSelect="editSelect" :editState="editState" :mainClasses="mainClasses"/>',
  // components: {Main}
  render: h => h(Main, {props: {sharedData: this.sharedData, loggedin: this.sharedData.logged, editSelect: this.editSelect, editState: this.editState, mainClasses: this.mainClasses}})

}).$mount("#app");
