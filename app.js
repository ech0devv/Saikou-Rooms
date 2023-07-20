const {
    Server
} = require("socket.io");

const io = new Server(2378);

var rooms = {};
var users = {};

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
async function onUserRequest(socket, args) {
    console.log("Users requested!");
    if (socket.rooms.size != 2)
        socket.emit("error", "Not in a room!");
    const roomName = Array.from(socket.rooms)[1];
    console.log(roomName)
    const room = await io.in(roomName).fetchSockets();
    let response = [];
    Object.keys(users).forEach((uid) => {
        if (room.filter(sock => sock.id == uid)) {
            response.push(users[uid])
        }
    })
    io.to(roomName).emit("users", JSON.stringify(response));
}

io.on("connection", (socket) => {
    socket.on("create", (...args) => {
        if (args.length == 3) {
            if (!rooms.hasOwnProperty(args[0]) && args[0] !== "") {
                const socketRooms = Object.keys(socket.rooms);
                socketRooms.forEach((room) => {
                    if (room !== socket.id) {
                        if (rooms[room] == socket.id) {
                            io.to(room).emit("disconnected");
                            delete rooms[room];
                            io.socketsLeave(room);
                            console.log("Socket disconnected! " + socket.id);
                        } else {
                            socket.leave(room);
                        }
                    }
                });
                rooms[args[0]] = socket.id;
                socket.join(args[0]);
                console.log(`New room titled ${args[0]} was created!`);
                users[socket.id] = [args[1], args[2]];
                onUserRequest(socket, args);
            } else {
                socket.emit("error", "Room name either: Already exists, is empty, or is not a string.");
            }
        } else {
            socket.emit("error", "Invalid arguments!");
        }
    });
    socket.on("join", (...args) => {
        if (args.length == 3) {
            if (rooms.hasOwnProperty(args[0])) {
                const socketRooms = Object.keys(socket.rooms);
                socketRooms.forEach((room) => {
                    if (rooms[room] == socket.id) {
                        io.to(room).emit("disconnected");
                        delete rooms[room];
                        io.socketsLeave(room);
                        console.log("Socket disconnected! " + socket.id)
                    } else {
                        socket.leave(room);
                    }
                });
                socket.join(args[0]);
                io.to(args[0]).emit("updateRequest");
                console.log("Socket joined room " + args[0])
                users[socket.id] = [args[1], args[2]];
                onUserRequest(socket, args);
            } else {
                socket.emit("error", "Room doesn't exist!")
            }
        } else {
            socket.emit("error", "Invalid arguments!");
        }
    });
    socket.on("hostUpdate", (...args) => {
        if (typeof args[0] === "number" && typeof args[1] === "string" && typeof args[2] === "string" && typeof args[3] === "number" && typeof args[4] === "string") {
            let found = false;
            for (let k in rooms) {
                if (rooms[k] == socket.id) {
                    found = true;
                    io.to(k).emit("update", args);
                    console.log(args);
                }
            }
            if (!found) {
                socket.emit("error", "You aren't the host of a room!")
            }
        } else {
            socket.emit("error", "Invalid arguments!")
        }
    });
    socket.on("requestUsers", (...args) => {
        onUserRequest(socket, args);
    });
    socket.on("disconnect", () => {
        if (Object.values(rooms).includes(socket.id)) {
            let key = getKeyByValue(rooms, socket.id);
            io.to(key).emit("disconnected");
            delete rooms[key];
            delete users[socket.id];
            io.socketsLeave(key);
            console.log("Socket disconnected! " + socket.id)
        }
    });
});