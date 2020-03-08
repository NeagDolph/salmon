import Vue from "vue";
// import Vuex from "vuex";

import Main from "./App.vue";
import axios from 'axios';
import { classnames, userauth, apiurl } from "./js/globals";
import './mixins/mixins';
import socket from './js/sockets.js';
import {authFunc} from './js/auth.js';
import "bootstrap/dist/css/bootstrap.min.css";


export var app = new Vue({
  data() {
    return {
      userauth: userauth,
      editSelect: "",
      editState: false,
      rawData: {},
      rawUsers: {},
      rawTeachers: {},
      loggedin: {
        loggedin: false,
      },
      preData: {
        teacher: false,
        admin: false,
        users: [],
        classes: [],
        shortnames: ["Soc", "Soc2", "Wr", "Wr2", "Geo", "Stats", "LD", "PS", "Phy", "HRI", "CW", "UM", "Maker", "Pract", "CvS"]
      },
      global: {
        adminOpen: false,
        dataTop: 0
      }
    }
  },
  methods: {
  },
  computed: {
    sharedData() {
      let obj = {...this.preData, ...this.rawData}

      if (this.rawData.classes) {
        obj.classes = obj.classes.split("").map((val, idx) => {
          return {"name": classnames[idx], "status": parseInt(val)}
        });
        this.loggedin.loggedin = true;
      }

      if (this.rawData.users) obj.users = this.rawData.users.map(el => {
          return {email: el[0], name: el[1], userid: el[2], classes: el[3], comments: ["", "", "", "", "", "", "", "", "", ""]}
        });


      if (this.rawData.adminusers) obj.adminusers = this.rawData.adminusers.map(el => {
          return {email: el[0], name: el[1], userid: el[2], classes: el[3], studentclasses: el[4] }
        });

      if ((this.rawData.tcomments | []).length >= 1) obj.tcomments = this.rawData.tcomments.map(el => {
        let comment = {userid: el[0], class: el[1], comment: el[2]}
        this.rawData.users.find(x => x.userid == comment.userid).comments[parseInt(comment.class)] = comment.comment
        return comment
      });

      if (this.rawData.admin) {
        obj.teacherlist = this.rawData.teacherlist
      }

      if (this.rawData.admin) obj.teacherlist = this.rawData.teacherlist.map(el => {
        return {email: el[0], name: el[1], userid: el[2], teacherclasses: el[3]}
      });

      this.preData = obj
      return obj
    }
  },
  template: '<Main :userAuth="userauth" :sharedData="sharedData" :loggedin="loggedin.loggedin" :editSelect="editSelect" :editState="editState" :globalData="global"/>',
  components: {Main},
  el: "#app",
  created() {
    socket.on("update", data => {
      this.rawData = data
    })
    .on("users", data => {
      this.rawUsers = data
    })
    .on("updatereq", () => axios.post(apiurl.data))
    .on('connect', () => {authFunc(this)})
    .on('connect_error', error => {
      console.log('%c Socket cannot connect to backend API!', 'background: #222; color: #ff6961; font-size: 18px;');
    })
  }
})
