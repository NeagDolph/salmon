import axios from 'axios';
import io from "socket.io-client";
import { sharedData, apiurl } from './globals'
import { parseData, parseUsers } from "./parse";

let socket = io();

sharedData.onupdate = socket.on("update", (data) => {
  console.log("got data")
  parseData(data)
  sharedData.logged = true
});

sharedData.onupdateusers = socket.on("users", ({ users, comments }) => {
  parseUsers(users, comments)
});

sharedData.updatereq = socket.on("updatereq", () => {
  console.log("requesting data")
  axios.post(apiurl.data)
});