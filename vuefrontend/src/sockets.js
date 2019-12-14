import io from "socket.io-client";
import { sharedData } from './globals.js'
import { parseData } from "./parse.js";

let socket = io();

sharedData.onupdate = socket.on("update", (data) => {
  parseData(data)
  sharedData.logged = true
  console.log("YEET");
});

sharedData.onupdateusers = socket.on("updateusers", ({ users }) => {
  sharedData.users = users;
});