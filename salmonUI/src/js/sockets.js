import axios from 'axios';
import io from "socket.io-client";
import { sharedData } from './globals.js'
import { parseData } from "./parse.js";

let socket = io();
console.log("UP")

sharedData.onupdate = socket.on("update", (data) => {
  parseData(data)
  sharedData.logged = true
  console.log("YEET");
});

sharedData.onupdateusers = socket.on("updateusers", ({ users }) => {
  sharedData.users = users;
});

sharedData.updatereq = socket.on("updatereq", () => {
  console.log("requesting data")
  axios.post("/getdata");
});