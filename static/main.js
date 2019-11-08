socket = io();


// socket.emit("location", {
//     x: globalcords[1],
//     y: globalcords[0]
// });

socket.on("update", obj => {
    $("#update").text(obj.count)
});