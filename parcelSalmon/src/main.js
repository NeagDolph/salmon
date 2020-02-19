import Vue from "vue";
import Main from "./App.vue";
import axios from 'axios';
import { classnames, userauth, apiurl } from "./js/globals";
import './mixins/mixins'
import socket from './js/sockets.js'
import {authFunc} from './js/auth.js'
import "bootstrap/dist/css/bootstrap.min.css";

export var app = new Vue({
  data() {
    return {
      userauth: userauth,
      editSelect: "",
      editState: false,
      rawData: {},
      rawUsers: {},
      loggedin: {
        loggedin: false,
      },
      preData: {
        teacher: false,
        admin: false,
        users: [],
        classes: [],
        shortnames: ["Soc", "Wr", "Geo", "Stats", "LD", "PS", "Phy", "HRI", "CW", "UM", "Maker", "Pract"]
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

      console.log("RAWDATCOMM", this.rawData)

      if ((this.rawData.tcomments | []).length >= 1) obj.tcomments = this.rawData.tcomments.map(el => {
        let comment = {userid: el[0], class: el[1], comment: el[2]}
        this.rawData.users.find(x => x.userid == comment.userid).comments[parseInt(comment.class)] = comment.comment
        return comment
      });

      this.preData = obj
      return obj
    }
  },
  template: '<Main :userAuth="userauth" :sharedData="sharedData" :loggedin="loggedin.loggedin" :editSelect="editSelect" :editState="editState"/>',
  components: {Main},
  el: "#app",
  created() {
    socket.on("update", data => {
      this.rawData = data
    });
    socket.on("users", data => {
      this.rawUsers = data
    });
    socket.on("updatereq", () => axios.post(apiurl.data))
    socket.on('connect', () => {
      authFunc(this)
    })
  }
})