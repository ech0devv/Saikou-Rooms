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

Websocket is available @ ws://localhost:2378.
It is recommended to use `socket.io` to interact with the server.

------------
## Socket Events

### Client to Server - create
- Argument 0: Room name (string)
- Makes the client leave any current room and move to a new one.
- Emits an error if the room already exists or if the arguments are invalid.
- Emits an error if the name of the room isn't a string to prevent misuse.

### Client to Server - join
- Argument 0: Room name (string)
- Makes the client leave any current room and move to the requested one.
- Emits an error if the room doesn't exist.

### Client to Server - hostUpdate
- Argument 0: Anilist ID (number)
- Argument 1: Source (string)
- Argument 2: Title (string)
- Argument 3: Time (milliseconds)
- Sends information to all clients in the room.
- Can only be executed by the original creator of the room to prevent misuse.
- Emits an error if the types are invalid or if the client isn't the original creator of the room.
- IGNORE IF RECEIVING! FOR SERVER USE ONLY!

### Server to Client - update
- Argument 0: Anilist ID (number)
- Argument 1: Source (string)
- Argument 2: Title (string)
- Argument 3: Time (milliseconds)

### Server to Client - error
- Argument 0: Error reason (string)

### Server to Client - disconnected
- Sent to clients when the host of the room disconnects.
- Prior to removing everyone from the room and deleting it.

### Server to Client - updateRequest
- Sent to the host of the room when a new user joins.
- Requests that the host emits a 'HostUpdate' event.