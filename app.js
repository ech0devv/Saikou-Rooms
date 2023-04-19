const { Server } = require("socket.io");

const io = new Server(3000);

var rooms = {};

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

io.on("connection", (socket) => {
  socket.on("create", (...args) => {
    if(!rooms.hasOwnProperty(args[0]) && args[0] !== ""){
        const socketRooms = Object.keys(socket.rooms);
        socketRooms.forEach((room) => {
            if(room !== socket.id){
                socket.leave(room);
            }
        });
        rooms[args[0]] = socket.id;
        socket.join(args[0]);
        console.log(`New room titled ${args[0]} was created!`)
    }else{
        socket.emit("error", "Room name either: Already exists, is empty, or is not a string.")
    }
  });
  socket.on("join", (...args) => {
    if(rooms.hasOwnProperty(args[0])){
        const socketRooms = Object.keys(socket.rooms);
        socketRooms.forEach((room) => {
            if(room !== socket.id){
                socket.leave(room);
            }
        });
        socket.join(args[0]);
        io.to(args[0]).emit("updateRequest");
    }else{
        socket.emit("error", "Room doesn't exist!")
    }
  });
  socket.on("hostUpdate", (...args) => {
    if(typeof args[0] === "number" && typeof args[1] === "string" && typeof args[2] === "string" && typeof args[3] === "number"){
        let found = false;
        for(let k in rooms){
            if(rooms[k] == socket.id){
                found = true;
                io.to(k).emit("update", args);
                console.log(args);
            }
        }
        if(!found){
            socket.emit("error", "You aren't the host of a room!")
        }
    }else{
        socket.emit("error", "Invalid arguments!")
    }
  });
  socket.on("disconnect", () => {
    if(rooms.hasOwnProperty(socket.id)){
        let key = getKeyByValue(rooms, socket.id);
        io.to(key).emit("disconnect");
        delete rooms[key];
        io.socketsLeave(key);
    }
  });
});