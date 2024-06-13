let ball;
let em;
// let camManager;
let currentRoomCode = null;

const GRID_SIZE = 10;

// let tile_images = [];
const TILE_WIDTH = 32;
const TILE_HEIGHT = 16;
let GRID_SCALE = 1.0;

let mechplayer;
let playerZ = 0;
let prevPlayerZ = 0; 
// let em;


let graphics
let cam;
let displayPlayer;
let localIGN = '';
let setupComplete = false;
let team = 0;
let statusconditions = [];

const socket = io.connect("ws://localhost:8001");

window.onload = () => { // temporary
    const room_code_input = prompt("Enter Room Code", "12345");
    // validate room code
    if (room_code_input.length !== 5) {
        window.onload();
    } else {
        let localIGN = prompt('Enter IGN');
        socket.emit("registerClient", localIGN, team, room_code_input);
    }
    // const join_option_input = prompt('Select: "CREATE" or "JOIN"', "CREATE");
    // if (join_option_input === "CREATE") {
    //     // socket.emit("requestCreateRoom");
    //     let localIGN = prompt('Enter IGN');
    //     let room
    //     socket.emit("registerClient", localIGN, team, room_code_input);
    // } else if (join_option_input === "JOIN") {
    //     const room_code_input = prompt("Enter Room Code");
    //     let localIGN = prompt('Enter IGN')
    //     socket.emit("registerClient", localIGN, team, room_code_input);
    //     // socket.emit("requestJoinRoom", room_code_input);
    // } else {
    //     window.onload();
    // }
};

socket.on("setRoomCode", (code) => {
    currentRoomCode = code;
});

socket.on("buildMap", (mapManager) => {
    // console.log(mapManager)
    mechplayer = createPlayerSprite(localIGN) // creates mechanics for player
    map.buildBaseMap(mapManager);
    map.buildVisualMap();
    displayPlayer = createVisiblePlayerSprite(mechplayer, localIGN, map);
    playerZ = map.setPlayerPosition(1, mechplayer);//map.getTile(round(map.)).z;
    cam.setTarget(displayPlayer);
    setupComplete = true;
});

socket.on("playerDataUpdate", (id, playerData) => {
    for (let data of playerData) {
        if (data.id === id) {
            // coins = data.coins;
            statusconditions = data.statusconditions;
            // timeRemaining = data.timer;
            continue;
        };
        if (!em.exists(data.id)) {
            em.registerNewPlayer(data);
        } else {
            em.updatePlayerData(data);
        }
    }
});

socket.on("removeClient", (id) => {
    let playerData = em.get(id);
    if (playerData) {
        playerData.sprite.remove();
        em.delete(id);
    }
});

function manageVisiblePlayer(mechanicSprite, playerSprite, map){
    // console.log(mechanicSprite.pos.x, mechanicSprite.pos.y, playerSprite.pos.x, playerSprite.pos.y, map)
    // project the sprite onto isometric grid from x and y
    // let X_screen = map.xstart + (mechanicSprite.pos.x - mechanicSprite.pos.y) * 1/2;
    // let Y_screen = map.ystart + (mechanicSprite.pos.x + mechanicSprite.pos.y) * (map.TILE_HEIGHT/4) / map.TILE_HEIGHT - 0 * map.TILE_HEIGHT/2; // z is 0 for now
    // console.log(X_screen, Y_screen, mechanicSprite.pos.x, mechanicSprite.pos.y)
    // playerSprite.pos.x = X_screen;
    // playerSprite.pos.y = Y_screen;
    let tilecoords = map.findFromCoords(mechanicSprite.pos.x, mechanicSprite.pos.y)
    tilecoords.x = min(max(0, tilecoords.x), map.numCols - 1)
    tilecoords.y = min(max(0, tilecoords.y), map.numRows - 1)
    let tile = map.getTile(tilecoords.x, tilecoords.y)
    // if tile.z is integer
    if (abs(tile.z - playerZ) <= 2){
      playerZ = tile.z;
      displayPlayer.layer = (tile.z + 2) * 1000;
    }
    // console.log(tile.z, playerZ, map.getAdjacentTiles(tilecoords.x, tilecoords.y));
    // console.log(tilecoords, tile.z, playerZ)
    // console.log(mechanicSprite)
    playerSprite.pos = createVector(mechanicSprite.pos.x, mechanicSprite.pos.y - playerZ * map.TILE_HEIGHT/2);
    // playerSprite.pos.x = mechanicSprite.pos.x;
    // playerSprite.pos.y = mechanicSprite.pos.y - playerZ * map.TILE_HEIGHT/2;
  
  }

function setup() {
    new Canvas("fullscreen");
    map =  new mapBuilder(70, 70, 32);
    em = new EntityManager();
    cam = new CameraManager(windowWidth / 2, windowHeight / 2, camera);
    // mechplayer = createPlayerSprite('test') // creates mechanics for player
//   map.buildVisualMap();
    // displayPlayer = createVisiblePlayerSprite(mechplayer, 'test', map);
    
    // cam.setTarget(displayPlayer);
    // playerZ = map.setPlayerPosition(1, mechplayer);//map.getTile(round(map.)).z;
//   cam.setTarget(displayPlayer);
    // p5play draws over our draw() loop, so we
    // have to jump thru hoops to draw our text
    // over our sprites...... by making a another
    // sprite. wow.
    let text_layer = new Sprite();
    text_layer.visible = false;
    text_layer.collider = "none";
    text_layer.update = () => {
        textAlign(CENTER, CENTER);
        textSize(32);
        text(`Room Code: ${currentRoomCode}`, 0, 50, width, 50);
    };
}

function draw() {
    if (setupComplete){
        background("grey");
        move();
        interpolateOtherPlayers();
        cam.update()
        manageVisiblePlayer(mechplayer, displayPlayer, map)
        if (playerZ != prevPlayerZ){
            map.updateCollisionLayers(playerZ);
            prevPlayerZ = playerZ;
        }

        socket.emit("position", displayPlayer.pos.x, displayPlayer.pos.y, playerZ);
    }
    // if (!currentRoomCode) {
    //     allSprites.visible = false;
    //     push();
    //     background("white");
    //     textSize(32);
    //     textAlign(CENTER, CENTER);
    //     text("Room Not Found", 0, 0, width, height);
    //     pop();
    //     return;
    // }
    
}

function interpolateOtherPlayers() {
    const now = +new Date();
    const EXPECTED_SERVER_TICK_RATE = 60;
    const est_render_timestamp = now - 1000.0 / EXPECTED_SERVER_TICK_RATE;
    for (const [id, playerData] of em.entities) {
        if (id == socket.id || playerData.positionBuffer.length < 2) {
            continue;
        }
        while (
            playerData.positionBuffer.length > 2 &&
            playerData.positionBuffer[1].timestamp <= est_render_timestamp
        ) {
            playerData.positionBuffer.shift();
        }
        if (
            playerData.positionBuffer.length >= 2 &&
            playerData.positionBuffer[0].timestamp <= est_render_timestamp &&
            est_render_timestamp <= playerData.positionBuffer[1].timestamp
        ) {
            const x0 = playerData.positionBuffer[0].x;
            const x1 = playerData.positionBuffer[1].x;
            const y0 = playerData.positionBuffer[0].y;
            const y1 = playerData.positionBuffer[1].y;
            const t0 = playerData.positionBuffer[0].timestamp;
            const t1 = playerData.positionBuffer[1].timestamp;
            playerData.sprite.x =
                x0 + ((x1 - x0) * (est_render_timestamp - t0)) / (t1 - t0);
            playerData.sprite.y =
                y0 + ((y1 - y0) * (est_render_timestamp - t0)) / (t1 - t0) - playerData.z * map.TILE_HEIGHT/2;
        }
    }
}

function move() {
    const SPEED = 5;
    const adjacentSPEED = 2 * 5**0.5;
    const oppSPEED = 5**0.5;

    // Play running animation when moving
    // Invert animation where necessary
    if (kb.pressing("w")) {
        // playerSprite.changeAni('run');
        displayPlayer.scale.x = 1;
        // move in a diagonal direction based on isometric x and y
        mechplayer.pos.y -= SPEED * oppSPEED / SPEED; 
        mechplayer.pos.x += SPEED * adjacentSPEED / SPEED;

        // mechplayer.pos.y -= SPEED;
        // breakDir = 0;
    }
    if (kb.pressing("a")) {
        // playerSprite.changeAni('run');
        displayPlayer.scale.x = -1;
        mechplayer.pos.x -= SPEED * adjacentSPEED / SPEED;
        mechplayer.pos.y -= SPEED * oppSPEED / SPEED;
        // breakDir = 1;
    }
    if (kb.pressing("s")) {
        // playerSprite.changeAni('run');
        displayPlayer.scale.x = 1;
        mechplayer.pos.y += SPEED * oppSPEED / SPEED;
        mechplayer.pos.x -= SPEED * adjacentSPEED / SPEED;
        // breakDir = 2;
    }
    if (kb.pressing("d")) {
        // playerSprite.changeAni('run');
        displayPlayer.scale.x = 1;
        mechplayer.pos.x += SPEED * adjacentSPEED / SPEED;
        mechplayer.pos.y += SPEED * oppSPEED / SPEED;
        // breakDir = 3;
    }

    // Reset animation after player stops moving
    if (kb.released("w") || kb.released("s") || kb.released("d")) {
        displayPlayer.scale.x = 1;
        // playerSprite.changeAni('idle');
    }
    else if (kb.released("a")) {
        displayPlayer.scale.x = -1;
        // playerSprite.changeAni('idle');
    }

    // To allow the players to change the block added
    // if (kb.pressing("p") && allowMapModification) {
    //     wallEditorMode = "*";
    // } else if (kb.pressing("q") && allowMapModification) {
    //     wallEditorMode = "=";
    // } else if (kb.pressing("b") && allowMapModification) { //barrier block
    //     wallEditorMode = "x";
    // } else if (kb.pressing("backspace") && allowMapModification) {
    //     wallEditorMode = "4";
    // }
}
