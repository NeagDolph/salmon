import Vue from "vue";
import Vuex from 'vuex';
import { classnames } from "./globals";

Vue.use(Vuex)

module.exports.store = new Vuex.Store({
  state: {
    nightMode: false,
    auth2: undefined, // Google OAuth object

    loggedin: false,

    user: { //User data
      classes: [],
      userid: false,
      comments: [],
      teacher: false,
      admin: false,
      userlist: [],
      teacherlist: [],
      adminusers: [],
    },

    profile: { //Google profile data
      picture: undefined,
      name: undefined
    },

    editComment: { // Comment state data
      select: "",
      state: false,
    },
    // editSelect: "",
    // editState: false,
    // oldclasses: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    adminPanel: { // Admin panel state data
      open: false,
      dataPx: 0
    }
  },
  mutations: {
    updateUserData(state, data) {
      if (data.classes) data.classes = data.classes.split("")
        .map((val, idx) => ({name: classnames[idx], status: parseInt(val), index: idx}))
        .filter((_, idx) => data.studentclasses[idx] == '1')

      if (typeof data.adminusers !== "object" && typeof data.userlist === "object") data.adminusers = data.userlist
      if (typeof data.adminusers === "object" && typeof data.userlist !== "object") data.userlist = data.adminusers

      state.user = {...state.user, ...data}
    },
    modifyUserData: (state, prop) => state.user[prop[0]] = prop[1],
    updateUserList(state, data) { 
      if (data.userlist) state.userlist = data.userlist
    },
    adminOpen: (state, open) => state.adminPanel.open = open,
    adminSection: (state, px) => state.adminPanel.dataPx = px,
    mutate: (state, prop) => state[prop[0]] = prop[1],
    setNightMode: (state, bool) => state.nightMode = bool

  }
})