import axios from 'axios';
import io from "socket.io-client";
import { apiurl } from './globals'
import { parseData, parseUsers } from "./parse";
import { app } from '../main.js'

let socket = io();
socket.on("update", (data) => {
  parseData(data)
  app.sharedData.logged = true
});

socket.on("users", ({ users, comments }) => {
  parseUsers(users, comments)
});

socket.on("updatereq", () => {
  console.log("requesting data")
  axios.post(apiurl.data)
});