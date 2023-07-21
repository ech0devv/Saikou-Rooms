## Installation / Setup

Clone this repository using

`git clone https://github.com/ech0devv/Saikou-Rooms`

Move into the directory using

`cd Saikou-Rooms`

Set up all packages

`npm i`

Run

Unix: `node ./app.js`

Windows (pwsh): `node .\app.js`


Websocket is now available @ `ws://localhost:2379`.

It is recommended to use `socket.io` to interact with the server.

------------------------

## Guidelines

### Client to Server

#### Create a room
    .emit("create", argument0, argument1, argument2)
This creates a room and adds the client, removing the client from any other rooms.

argument0 = Room name.
argument1 = Username.
argument2 = Profile Picture Link.

Server will emit error if:
- Room already exists.
- Invalid arguments

#### Join a room
    .emit("join", argument0)
Adds the client to a room, removing the client from any other rooms.

argument0 = Room name.
argument1 = Username.
argument2 = Profile Picture Link.

Server will emit error if:
- Room doesn't exist.
- Invalid arguments

#### Send update to all members of room - 
    .emit("hostUpdate", argument0, argument1, argument2, argument3, argument4)
Sends new data to room members (watchtime, source, title, anilist id).

argument0 = AniList ID

argument1 = Source Index

argument2 = Title

argument3 = Watch Time (millis)

argument4 = Episode index

Server will emit error if:
- Client is not host of room.
- Invalid arguments.

#### Request update of users object - 
    .emit("requestUsers", ())
Asks that the server sends a new JSON array with all user data in it, `users`.

Server will emit error if:
- Client is not in room.

### Server to Client

##### arguments placed inside of .on functions are there for illustrative purposes, and should be replaced with something along the lines of (args...) or (...args)

#### Error
    .on("error", (argument0))
    
Sends error to Client.

argument0 = Cause for error.

#### UpdateRequest
    .on("updateRequest", ())
    
Requests a `hostUpdate` packet from the host.

#### Update
    .on("update", (argument0, argument1, argument2, argument3, argument4))

Contains video data from host. Should not be emitted by client, if this becomes a problem, please make an issue so we can discuss how to fix it.

argument0 = AniList ID

argument1 = Source Index

argument2 = Title

argument3 = Watch Time (millis)

argument4 = Episode Index

#### Users object - 
    .on("users", (argument0))

JSON Array with all users (username, profile picture link) in a room.

argument0 = JSON Array with JSON Array data type, in the following format: (username, profile picture link)

Server will emit error if:
- Client is not in room.

#### Disconnected
    .on("disconnected")

Occurs when the host leaves, therefore banishing the room to the shadow realm, alongside everything inside of it. This notifies the client prior to removing it from the room.

