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
      this.sharedData = {...this.sharedData, ...data}

      if (data.classes) this.sharedData.classes = data.classes.split("").map((val, idx) => {
        return {"name": classnames[idx], "status": parseInt(val)}
      });

      if (data.users) this.sharedData.users = data.users.map((el, idx) => {
          return {email: el[0], name: el[1], userid: el[2], classes: el[3], comments: []}
        });


      if (data.adminusers) this.sharedData.adminusers = data.adminusers.map(el => {
          return {email: el[0], name: el[1], userid: el[2], classes: el[3], studentclasses: el[4] }
        });

      if (data.tcomments ? (data.tcomments.length >= 1) : false) data.tcomments.forEach(el => {
        let comment = {userid: el[0], class: el[1], comment: el[2]}
        let foundIndex = this.sharedData.users.findIndex(x => x.userid == comment.userid)

        if (foundIndex > -1) this.sharedData.users[foundIndex].comments[parseInt(comment.class)] = comment.comment;
      });
      

      if (data.admin) this.sharedData.teacherlist = data.teacherlist.map(el => {
          return {email: el[0], name: el[1], userid: el[2], teacherclasses: el[3]}
        });
    },

    updateUsers(data) {
      if (data.users) this.sharedData.users = data.users.map(el => {
        return {email: el[0], name: el[1], userid: el[2], classes: el[3], comments: []}
      });

      if (data.comments ? (data.comments.length >= 1) : false) data.comments.forEach(el => {
        const comment = {userid: el[0], class: el[1], comment: el[2]}
        const foundIndex = this.sharedData.users.findIndex(x => x.userid == comment.userid)

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
    .on('connect', () => {authFunc(this)})
    .on('connect_error', error => {
      console.log('%c Socket cannot connect to backend API!', 'background: #222; color: #ff6961; font-size: 18px;');
    })
  }
})
