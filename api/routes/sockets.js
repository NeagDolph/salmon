var socket = require("socket.io")
    , io

var data = require("../services/data.js")

function load(server) {
    return new Promise((resolve, reject) => {
        io = socket(server)

        io.on('connection', socket => {
            socket.on('room', async room => {
                socket.join(room);
            })
        });

        resolve()
    })
}

var methods = {
    teachers() {
        let userlist = data.getStudentList(true)

        io.to("teachers").emit("users", { "userlist": userlist })
    },

    user(userid, extradata = false) {
        io.to(userid).emit("update", data.getCompiled(userid, extradata));
    },

    request(usertype, exception) {
        const types = ["student", "teacher", "admins"]
        io.to(types[usertype]).emit('updatereq', { exception: exception })
    }
}

module.exports.load = load
module.exports.methods = methods

