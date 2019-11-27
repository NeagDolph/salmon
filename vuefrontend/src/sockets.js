var socket = io()

export let socketData = {}

export let beep = () => {
    console.log("BEEP", socketData, socket, io)
}

socketData.onupdate = socket.on("update", ({classes}) => {
    socketData.classes = classes
    console.log("YEET")
});

socketData.onupdateusers = socket.on("updateusers", ({ users }) => {
    socketData.users = users
});