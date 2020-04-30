var socket = require("socket.io")
  , io

var data = require("../services/data.js")

module.exports.load = (server, callback) => {
    io = socket(server)

    io.on('connection', socket => {
        socket.on('room', async room => {
            socket.join(room);
        })
    });

    callback()
}

module.exports.methods = {
    teachers() {
        let userlist = data.userlist(true)
    
        io.to("teachers").emit("users", { "userlist": userlist })
    },
    
    user(userid, extradata = false) {
        io.to(userid).emit("update", data.all(userid, extradata));
    },
    
    request(usertype, exception) {
        const types = ["student", "teacher", "admins"]
        io.to(types[usertype]).emit('updatereq', { exception: exception })
    }
}
