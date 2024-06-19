import { Server } from "socket.io";
import { readFileSync } from "fs";
import MapManager from './mapManager.js'
import { timingSafeEqual } from "crypto";

const io = new Server(8001, {
    cors: {
        origin: "*",
    },
});
const clients = new Set();
const rooms = [];
const TICK_DELAY = 1000 / 60;
let frameCount = 0;
// const MAPS_DATA = JSON.parse(readFileSync("./maps.json"));

function Client(socket) {
    this.socket = socket;
    this.position = { x: 0, y: 0 ,z:0};
    this.team = null;
    this.action = '';
    this.statusconditions = [];
}

class Room {
    constructor(id) {
        this.clients = [];
        this.id = id;
        this.mapManager = new MapManager(id);
        this.gameStarted = true; // set to false ltr

    }

    addClient(c) {
        if (c.room) {
            throw Error(`Client ${c.socket.id} already in room`);
        }
        this.clients.push(c);
        c.room = this;
    }

    removeClient(c) {
        if (!this.clients.includes(c)) {
            throw Error(`No client ${c.socket.id} in room`);
        }
        this.clients.splice(this.clients.indexOf(c), 1);
        if (this.clients.length === 0) {
            rooms.splice(rooms.indexOf(this), 1);
        }
    }
}

console.log("Server running...");

io.on("connection", (socket) => {
    console.log("New connection!");
    let client = new Client(socket);
    clients.add(client);

    socket.on("position", (x, y, z) => {
        client.position = { x, y, z };
    });

    socket.on("registerClient", (ign, team, roomCode) => {
        client.ign = ign;
        client.team = team;

        // First, we check if the roomcode provided by the client exists
        let roomExists = false;

        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].id == roomCode) {
                // Allow the client to join the existing room
                // if (rooms[i].gameStarted) {
                //     socket.emit("gameAlreadyStarted");
                //     return;
                // }
                roomExists = true;
                rooms[i].addClient(client);
            }
        }

        // Client wants to join a room that does not exist, create a new room
        if (roomExists == false) {
            let room = new Room(roomCode);
            // console.log(room.mapManager.grid)
            room.addClient(client)
            rooms.push(room);
        }

        socket.emit("buildMap", client.room.mapManager);
        socket.emit("setRoomCode", roomCode);
    })

    socket.on("activateTower", (index) => {
        client.room.mapManager.activateTower(index);
        for (let c of client.room.clients) {
            c.socket.emit("updateTower", index, client.room.mapManager.towers[index]);
        }
    }
    );



    // socket.on("requestCreateRoom", () => {
    //     const roomCode = generateRandomRoomCode();
    //     let room = new Room(roomCode);
    //     room.addClient(client);
    //     rooms.push(room);
    //     socket.emit("setRoomCode", roomCode);
    //     socket.emit("buildMap", MAPS_DATA.myWorld);
    // });

    // socket.on("requestJoinRoom", (code) => {
    //     for (let room of rooms) {
    //         if (room.id === code) {
    //             room.addClient(client);
    //             socket.emit("setRoomCode", code);
    //             socket.emit("buildMap", MAPS_DATA.myWorld);
    //             return;
    //         }
    //     }
    // });

    socket.on("disconnect", () => {
        if (client.room) {
            client.room.removeClient(client);
        }
        clients.delete(client);
        clients.forEach((c) => {
            c.socket.emit("removeClient", socket.id);
        });
    });
});

function generateRandomRoomCode() {
    return (+new Date()).toString(36).slice(-5);
}

function tick() {
    frameCount++;
    for (let room of rooms) {
        let allData = [...room.clients].map((c) => {
            return {
                position: c.position,
                id: c.socket.id,
                ign: c.ign,
                statusconditions: c.statusconditions,
            };
        });
        for (let c of room.clients) {
            c.socket.emit("playerDataUpdate", c.socket.id, allData);
        }
        if (frameCount % Math.round(60) == 0 && room.gameStarted) {
            // room.mapManager.generateCoins();
            room.mapManager.updateTowers(room.clients);
            // console.log("generating", frameCount, date.getTime() - lastTime, room.mapManager.coinrate, 60 / room.mapManager.coinrate);
            
        }
    }
}

setInterval(tick, TICK_DELAY);
