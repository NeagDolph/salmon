import Vue from 'vue'
import Main from './App.vue'
import {socketData, beep, socket} from './sockets.js'
import {guser} from './auth.js'

// import 'jquery';
// import 'bootstrap';

export let app = new Vue({
  data: {
    loggedin: false,
    users: socketData,
    user: guser,
    classes: []
  },
  methods: {
    beep
  },
  el: '#app',
  template: '<Main :loggedin="loggedin" :users="users" :classlist="classes"/>',
  components: {Main},
})

