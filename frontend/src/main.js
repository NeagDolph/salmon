import Vue from "vue";
import { store } from "./js/store.js"
import Main from "./App.vue";
import axios from 'axios';
import { apiurl } from "./js/globals";
import './mixins/mixins';
import socket from './js/sockets.js';
import {authFunc, authFunc2} from './js/auth.js';
import "bootstrap/dist/css/bootstrap.min.css";

export var app = new Vue({
  store,    
  methods: {
    resetTeacher(data) {
      if (data.teacher !== this.$store.state.user.teacher) {
        this.$store.commit("adminOpen", false)
        this.getUserData()
      }
    },

    joinRooms(sharedData) {
      socket.emit("room", sharedData.userid)
      if (sharedData.admin) socket.emit("room", "admins")
      if (sharedData.teacher) socket.emit("room", "teachers")
    }
  },
  computed: {
  },
  template: '<Main/>',
  components: {Main},
  el: "#app",
  created() {
    if (indexLoadPayload.userid) {
      this.$store.commit("mutate", ["loggedin", true])
      if (indexLoadPayload.data) this.$store.commit("updateUserData", indexLoadPayload.data)
    }

    socket.on("update", data => {
      this.resetTeacher(data)
      this.$store.commit("updateUserData", data)
      console.log("Received General data")
    })
    .on("users", data => {
      this.$store.commit("updateUserList", data)
    })
    .on("updatereq", ({exception}) => {
      if (this.$store.state.user.userid !== exception) this.getUserData()
    })
    .on('connect', () => {
      console.log("Connected to Socket")

      if (indexLoadPayload.userid) {
        this.joinRooms({...indexLoadPayload.data, userid: indexLoadPayload.userid});
        return;
      }
      if (this.$store.state.loggedin) {
        this.joinRooms(this.$store.state.user);
        return;
      }

      this.getUserData().then(data => {
        this.joinRooms(data)

        this.$store.commit("mutate", ["loggedin", true])
        authFunc()
      })
      .catch(err => {
        if (err.response.status == 403) {
          authFunc(loggedin => {
            if (loggedin) authFunc2();
          })
        }
      })
    })
    .on('connect_error', error => {
      console.log('%c Socket cannot connect to backend API!', 'background: #222; color: #ff6961; font-size: 14px;');
    })
  }
})
