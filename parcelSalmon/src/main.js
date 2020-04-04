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
        userlist: [],
        teacherlist: [],
        adminusers: [],
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
      var newdat = data

      if (data.classes) newdat.classes = data.classes.split("").map((val, idx) => {
        return {"name": classnames[idx], "status": parseInt(val)}
      });
 
      if (data.commentlist) data.commentlist.forEach(comment => {
        let foundIndex = newdat.userlist.findIndex(x => x.userid == comment.userid)

        if (foundIndex > -1)  {
          if (!newdat.userlist[foundIndex].comments) newdat.userlist[foundIndex].comments = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
          newdat.userlist[foundIndex].comments[parseInt(comment.class)] = comment.comment;
          // console.log(eep, eep[foundIndex], eep[foundIndex].comments)
        }
      });

      if (data.teacher !== this.sharedData.teacher) {
        this.sharedData.teacher = data.teacher
        this.setGlobal("adminOpen", false)

        axios.get(apiurl.getdata)
          .then(data => {
            this.updateData(data.data)
          })

        return
      }

      this.sharedData = {...this.sharedData, ...newdat}
    },

    updateUsers(data) {
      if (data.userlist) this.sharedData.userlist = data.userlist
      if (data.comments ? (data.comments.length >= 1) : false) data.comments.forEach(comment => {
        let foundIndex = this.sharedData.userlist.findIndex(x => x.userid == comment.userid)
        if (foundIndex > -1) this.sharedData.userlist[foundIndex].comments[parseInt(comment.class)] = comment.comment;
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
      // console.log("Received General data")
    })
    .on("users", data => {
      this.updateUsers(data)
      // console.log("Received Student data")
    })
    .on("updatereq", () => {
      axios.get(apiurl.getdata)
      .then(data => {
        this.updateData(data.data)
      })
    })
    .on('connect', () => {
        axios.get(apiurl.getdata)
        .then(data => {
          this.updateData(data.data)
          this.loggedin.loggedin = true
          authFunc(() => {})
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status == 403) {
              authFunc(loggedin => {
                if (!loggedin) return
                authFunc2()
              })
            }
          }
        })
    })
    .on('connect_error', error => {
      console.log('%c Socket cannot connect to backend API!', 'background: #222; color: #ff6961; font-size: 18px;');
    })
  }
})
