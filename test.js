const io = require("socket.io-client")
const socket = io("ws://localhost:2379");
socket.on("green", () => {
    console.log("Yay!")
})
socket.emit("check")
