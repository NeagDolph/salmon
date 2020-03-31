import Vue from "vue";
// import Vuex from "vuex";

import Main from "./App.vue";
import axios from 'axios';
import { classnames, userauth, apiurl } from "./js/globals";
import './mixins/mixins';
import socket from './js/sockets.js';
import {authFunc, authFunc2} from './js/auth.js';
import "bootstrap/dist/css/bootstrap.min.css";


export var app = new Vue({
  data() {
    return {
      sharedData: {
        classes: [],
        comments: [],
        teacher: false,
        admin: false,
        users: [],
        shortnames: ["Soc", "Soc2", "Wr", "Wr2", "Geo", "Stats", "LD", "PS", "Phy", "HRI", "CW", "UM", "Maker", "Pract", "CvS"]
      },
      userauth: userauth,
      editSelect: "",
      editState: false,
      rawData: {},
      rawUsers: {},
      rawTeachers: {},
      oldclasses: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      loggedin: {
        loggedin: false,
      },
      global: {
        adminOpen: false,
        dataTop: 0
      }
    }
  },
  methods: {
    updateData(data) {
      this.sharedData = data

      if (data.classes) this.sharedData.classes = data.classes.split("").map((val, idx) => {
        return {"name": classnames[idx], "status": parseInt(val)}
      });

      if (data.tcomments ? (data.tcomments.length >= 1) : false) data.tcomments.forEach(comment => {
        let foundIndex = this.sharedData.users.findIndex(x => x.userid == comment.userid)

        if (foundIndex > -1) this.sharedData.users[foundIndex].comments[parseInt(comment.class)] = comment.comment;
      });
    },

    updateUsers(data) {
      if (data.users) this.sharedData.users = data.users
      if (data.comments ? (data.comments.length >= 1) : false) data.comments.forEach(comment => {
        let foundIndex = this.sharedData.users.findIndex(x => x.userid == comment.userid)
        if (foundIndex > -1) this.sharedData.users[foundIndex].comments[parseInt(comment.class)] = comment.comment;
      });
    }
  },
  computed: {
  },
  template: '<Main :userAuth="userauth" :sharedData="sharedData" :loggedin="loggedin.loggedin" :editSelect="editSelect" :editState="editState" :globalData="global"/>',
  components: {Main},
  el: "#app",
  created() {
    socket.on("update", data => {
      this.updateData(data)
      console.log("Received General data")
    })
    .on("users", data => {
      this.updateUsers(data)
      console.log("Received Student data")
    })
    .on("updatereq", () => axios.post(apiurl.data))
    .on('connect', () => {
      authFunc((loggedin) => {
        if (!loggedin) return
        axios.get(apiurl.getdata)
        .then(data => {
          this.updateData(data.data)
          this.loggedin.loggedin = true
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status == 403) {
              authFunc2()
            }
          }
        })
      })
    })
    .on('connect_error', error => {
      console.log('%c Socket cannot connect to backend API!', 'background: #222; color: #ff6961; font-size: 18px;');
    })
  }
})
