// !!! its for old version of Socket.io
const express = require("express");
const socketio = require("socket.io");


let app = express();
let server = app.listen(8080);
let io = socketio(server);

app.use(express.static("static"));

io.on("connection", (socket) => {
    console.log("A socket is now open");
    console.log(socket);
});
