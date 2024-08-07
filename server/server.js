import { Server } from "socket.io";
import { readFileSync } from "fs";
import MapManager from './mapManager.js'
import { timingSafeEqual } from "crypto";
import { clear } from "console";

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
    this.team = -1;
    this.action = '';
    this.statusconditions = [];
}

class Room {
    constructor(id) {
        this.clients = [];
        this.id = id;
        this.mapManager = new MapManager(id);
        this.gameStarted = false; // set to false ltr
        this.gamecountdown = 60 * 3; // 3 minutes

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

// console.log("Server running...");

io.on("connection", (socket) => {
    // console.log("New connection!");
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
                if (rooms[i].clients.length >= 4) {
                    socket.emit("roomFull");
                    return;
                }
                if (rooms[i].gameStarted) {
                    socket.emit("gameAlreadyStarted");
                    // console.log("game already started");
                    return;
                }
                rooms[i].addClient(client);
            }
        }

        // Client wants to join a room that does not exist, create a new room
        if (roomExists == false) {
            let room = new Room(roomCode);
            // // console.log(room.mapManager.grid)
            room.addClient(client)
            rooms.push(room);
        }

        socket.emit("buildMap", client.room.mapManager);
        socket.emit("setRoomCode", roomCode);
    })

    socket.on("startGame", () => {
        client.room.gameStarted = true;
        //determine teams
        let team1count = 0;
        let team2count = 0;
        for (let c of client.room.clients) {
            c.team = -1;
        }

        if (client.room.clients.length == 4) {
            while (team1count < 2) {
            let randomclient = client.room.clients[Math.min(Math.round(Math.random() * client.room.clients.length), client.room.clients.length - 1)];
            if (randomclient.team == -1) {
                randomclient.team = 0;
                team1count++;
            }
        }
        } else {
            while (team1count < Math.round(1 + client.room.clients.length - 2)){
                let randomclient = client.room.clients[Math.min(Math.round(Math.random() * client.room.clients.length), client.room.clients.length - 1)];
                if (randomclient.team == -1) {
                    randomclient.team = 0;
                    team1count++;
                }
            }
        }
        
        // team2 
        for (let c of client.room.clients) {
            if (c.team == -1) {
                c.team = 1;
            }
        }
        let clientteams = [];
        for (let c of client.room.clients) {
            clientteams.push({team :c.team , id : c.socket.id});
        }
        // console.log(clientteams);
        for (let c of client.room.clients) {
            c.socket.emit("gameStarted", c.team, clientteams);
        }
        // setInterval(() => {
            
        //     if (client.room.gamecountdown <= 0) {
        //         clearInterval();
        //         if (client.room.gameStarted) {
        //             let teamwon = client.room.mapManager.checkWinCondition();
        //             for (let c of client.room.clients) {
        //                 c.socket.emit("gameEnded", teamwon);
        //             }
        //             client.room.gameStarted = false;
        //             client.room.gamecountdown = 0.5 * 60;
        //             //deactivate all towers
        //             for (let tower of client.room.mapManager.towers) {
        //                 client.room.mapManager.deactivateTower(tower.id, client.team, client.room.clients);
        //                 if (tower.linkedtowerid != null) {
        //                     client.room.mapManager.deactivateTower(tower.linkedtowerid, client.team, client.room.clients); 
        //                 }
        //             }
        //             client.room.mapManager.towers = [];
        //             client.room.mapManager.maxtowerid = 0;
        //             client.room.mapManager.teamhealth = [100, 100];
        //             client.room.mapManager.teamdamage = [15, 15];
        //             for (let c of client.room.clients) {
        //                 c.socket.emit("resetGame", client.room.mapManager)
        //             }
                    
        //         }
                
        //     } else {
        //         client.room.gamecountdown--;
        //     }
        
        // }, 1000);
    });

    socket.on("startingGameSoon", () => {
        for (let c of client.room.clients) {
            c.socket.emit("startingGameSoon");
        }
    });

    socket.on("activateTower", (id) => {
        // console.log('activating tower', id, client.team)
        client.room.mapManager.activateTower(id, client.team, client.room.clients);
        // // console.log('activating tower', index, client.team)
        for (let c of client.room.clients) {
            let index = client.room.mapManager.towers.findIndex(tower => tower.id == id);
            let linkedtower = client.room.mapManager.towers.find(tower => tower.id == client.room.mapManager.towers[index].linkedtowerid);
            // console.log('sending update tower', id, client.room.mapManager.towers[index], client.team)
            c.socket.emit("updateTower", id, client.room.mapManager.towers[index], client.team);
            c.socket.emit("updateTower", client.room.mapManager.towers[index].linkedtowerid, linkedtower, client.team);
        }
    }
    );

    socket.on("comboTower", (id) => {
        // console.log('combining tower', id, client.team)
        client.room.mapManager.comboTower(id, client.team, client.room.clients);
        // // console.log('activating tower', index, client.team)
        for (let c of client.room.clients) {
            let index = client.room.mapManager.towers.findIndex(tower => tower.id == id);
            let linkedtower = client.room.mapManager.towers.find(tower => tower.id == client.room.mapManager.towers[index].linkedtowerid);
            // console.log('sending update tower', id, client.room.mapManager.towers[index], client.team)
            c.socket.emit("updateTower", id, client.room.mapManager.towers[index], client.team);
            c.socket.emit("updateTower", client.room.mapManager.towers[index].linkedtowerid, linkedtower, client.team);
        }
    }
    );

    socket.on("deactivateTower", (id) => {
        // updatetransmission handled here in the deactivateTower function
        client.room.mapManager.deactivateTower(id, client.team, client.room.clients);
        let tower = client.room.mapManager.towers.find(towers => towers.id == id);
        if (tower.linkedtowerid != null) {
            client.room.mapManager.deactivateTower(tower.linkedtowerid, client.team, client.room.clients); 
        }
        // for (let c of client.room.clients) { // the update transmission handled here
        //     c.socket.emit("updateTower", index, client.room.mapManager.towers[index], client.team);
        // }
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
                team: c.team,
                timer: room.gamecountdown,
            };
        });
        for (let c of room.clients) {
            c.socket.emit("playerDataUpdate", c.socket.id, allData);
        }
        if (frameCount % Math.round(60) == 0 && room.gameStarted) {
            // room.mapManager.generateCoins();
            room.mapManager.updateTowers(room.clients);
            // // console.log("generating", frameCount, date.getTime() - lastTime, room.mapManager.coinrate, 60 / room.mapManager.coinrate);
            room.gamecountdown--;
            if (room.gamecountdown <= 0) {
                let teamwon = room.mapManager.checkWinCondition();
                for (let c of room.clients) {
                    c.socket.emit("gameEnded", teamwon);
                }
                room.gameStarted = false;
                room.gamecountdown = 3 * 60;
                //deactivate all towers
                // for (let tower of room.mapManager.towers) {
                //     room.mapManager.deactivateTower(tower.id, c.team, room.clients);
                //     if (tower.linkedtowerid != null) {
                //         room.mapManager.deactivateTower(tower.linkedtowerid, c.team, room.clients); 
                //     }
                // }
                room.mapManager.towers = [];
                room.mapManager.maxtowerid = 0;
                // room.mapManager.updateTowers(room.clients);
                room.mapManager.teamhealth = [100, 100];
                room.mapManager.teamdamage = [15, 15];
                for (let c of room.clients) {
                    c.socket.emit("resetGame", room.mapManager)
                }
            }
        }
    }
}

setInterval(tick, TICK_DELAY);
