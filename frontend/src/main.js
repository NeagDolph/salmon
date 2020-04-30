import Vue from "vue";
import Main from "./App.vue";
import axios from 'axios';
import { classnames, apiurl } from "./js/globals";
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
        teacher: 0,
        admin: false,
        userlist: [],
        teacherlist: [],
        adminusers: [],
        shortnames: ["Soc", "Soc2", "Wr", "Wr2", "Geo", "Stats", "LD", "PS", "Phy", "HRI", "CW", "UM", "Maker", "Pract", "CvS"]
      },
      userauth: {
        profilePicture: ""
      },
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
      if (data.classes) data.classes = data.classes.split("").map((val, idx) => {
        return {name: classnames[idx], status: parseInt(val), index: idx}
      }).filter((e, idx) => data.studentclasses[idx] == '1')

      if (data.teacher !== this.sharedData.teacher && this.sharedData.teacher !== 0) {
        this.sharedData.teacher = data.teacher
        this.setGlobal("adminOpen", false)

        axios.get(apiurl.data)
          .then(data => {
            this.updateData(data.data)
          })

        return
      }

      if (data.adminusers == "userlist") data.adminusers = data.userlist

      this.sharedData = {...this.sharedData, ...data}
    },

    updateUsers(data) {
      if (data.userlist) this.sharedData.userlist = data.userlist
    },

    joinRooms(sharedData) {
      socket.emit("room", sharedData.userid)
      if (sharedData.admin) socket.emit("room", "admins")
      if (sharedData.teacher) socket.emit("room", "teachers")
    }
  },
  computed: {
  },
  template: '<Main :userAuth="userauth" :sharedData="sharedData" :loggedin="loggedin.loggedin" :editSelect="editSelect" :editState="editState" :globalData="global"/>',
  components: {Main},
  el: "#app",
  created() {
    if (indexLoadPayload.userid) {
      this.loggedin.loggedin = true
      if (indexLoadPayload.data) this.updateData(indexLoadPayload.data)
    }
    socket.on("update", data => {
      this.updateData(data)
      console.log("Received General data")
    })
    .on("users", data => {
      this.updateUsers(data)
      // console.log("Received Student data")
    })
    .on("updatereq", ({exception}) => {
      if (this.sharedData.userid == exception) return
      axios.get(apiurl.data)
      .then(data => {
        this.updateData(data.data)
      })
    })
    .on('connect', () => {

      console.log("connected")

      if (indexLoadPayload.userid) {
        this.joinRooms({...indexLoadPayload.data, userid: indexLoadPayload.userid})
        return;
      } else if (this.loggedin.loggedin) {
        this.joinRooms(this.sharedData)
        return;
      }
    
      console.log("OOPSU")
      axios.get(apiurl.data)
      .then(({data}) => {
        this.updateData(data)

        socket.emit("room", data.userid)
        if (data.teacher) socket.emit("room", "teachers")
        if (data.admin) socket.emit("room", "admins")

        this.loggedin.loggedin = true
        authFunc(() => {})
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status == 403) {
            authFunc(loggedin => {
              console.log("EN", loggedin)
              if (!loggedin) return
              console.log("ene")
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
