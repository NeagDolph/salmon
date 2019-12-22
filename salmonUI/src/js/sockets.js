import axios from 'axios';
import io from "socket.io-client";
import { sharedData, apiurl } from './globals'
import { parseData } from "./parse";

let socket = io();

sharedData.onupdate = socket.on("update", (data) => {
  parseData(data)
  sharedData.logged = true
});

sharedData.onupdateusers = socket.on("updateusers", ({ users }) => {
  sharedData.users = users;
});

sharedData.updatereq = socket.on("updatereq", () => {
  console.log("requesting data")
  axios.post(apiurl.data)
});