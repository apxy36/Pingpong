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
let prevPlayerZ = -1; 
// let em;


let graphics
let cam;
let displayPlayer;
let localIGN = '';
let setupComplete = false;
let team = 0;
let statusconditions = [];
let interactionBtn;
let startGame = false;

const socket = io.connect("ws://localhost:8001");

// window.onload = () => { // temporary
//     const room_code_input = prompt("Enter Room Code", "12345");
//     // validate room code
//     if (room_code_input.length !== 5) {
//         window.onload();
//     } else {
//         localIGN = prompt('Enter IGN');
//         if (localIGN.length === 0) {
//             window.onload();
//         }
//         socket.emit("registerClient", localIGN, team, room_code_input);
//     }
//     // const join_option_input = prompt('Select: "CREATE" or "JOIN"', "CREATE");
//     // if (join_option_input === "CREATE") {
//     //     // socket.emit("requestCreateRoom");
//     //     let localIGN = prompt('Enter IGN');
//     //     let room
//     //     socket.emit("registerClient", localIGN, team, room_code_input);
//     // } else if (join_option_input === "JOIN") {
//     //     const room_code_input = prompt("Enter Room Code");
//     //     let localIGN = prompt('Enter IGN')
//     //     socket.emit("registerClient", localIGN, team, room_code_input);
//     //     // socket.emit("requestJoinRoom", room_code_input);
//     // } else {
//     //     window.onload();
//     // }
// };

socket.on("setRoomCode", (code) => {
    currentRoomCode = code;
});

socket.on("buildMap", (mapManager) => {
    // console.log(mapManager)
    mechplayer = createPlayerSprite(localIGN) // creates mechanics for player
    map.buildBaseMap(mapManager);
    map.buildVisualMap();
    map.updateTowers(mapManager);
    console.log(mapManager.towers, map.towerarr)
    displayPlayer = createVisiblePlayerSprite(localIGN, playerZ);
    playerZ = map.setPlayerPosition(1, mechplayer);//map.getTile(round(map.)).z;
    cam.setTarget(displayPlayer);
    map.initializeCollisions(playerZ, mechplayer);
    setupComplete = true;
    mapBuilt = true;
    
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

socket.on("generateTower", (tower) => {
    console.log(tower)
    map.addTower(tower);
}
);
socket.on("removeTower", (index) => {
    map.removeTower(index);
    console.log(index, 'removed')
}
);

socket.on("updateTower", (id, tower, team) => {
    map.updateTower(id, tower, team);
    console.log(id, 'updated')
}
);

socket.on("preGenerateTower", (randx, randy, randtype) => {
    map.preGenerateTower(randx, randy, randtype);
    console.log(randx, randy, 'pre-generated')
}
);

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
    // playerSprite.img.scale.x = 1 + 0.25 * playerZ;
    // playerSprite.img.scale.y = 1 + 0.25 * playerZ;

    // playerSprite.scale.x = 1 + 0.55 * playerZ;
    // playerSprite.scale.y = 1 + 0.55 * playerZ;
    // console.log(playerSprite.scale)
    playerSprite.pos = createVector(mechanicSprite.pos.x, mechanicSprite.pos.y - playerZ * map.TILE_HEIGHT/2);
    // playerSprite.pos.x = mechanicSprite.pos.x;
    // playerSprite.pos.y = mechanicSprite.pos.y - playerZ * map.TILE_HEIGHT/2;
  
  }

function setup() {
    new Canvas("fullscreen");
    loadingBall = new LoadingBall();
    // loadingBall.setCollider("circle", 0, 0, 20);

    const urlParams = new URLSearchParams(
        window.location.search,
    );

    localIGN = urlParams.get('ign');
    Object.freeze(localIGN);

    room_code_input = urlParams.get('roomCode');
    Object.freeze(room_code_input);

    // console.log(localIGN, room_code_input);
    socket.emit("registerClient", localIGN, team, room_code_input);

    map =  new mapBuilder(52, 52, 32);
    em = new EntityManager();
    cam = new CameraManager(windowWidth / 2, windowHeight / 2, camera);
    // mechplayer = createPlayerSprite('test') // creates mechanics for player
//   map.buildVisualMap();
    // displayPlayer = createVisiblePlayerSprite(mechplayer, 'test', map);
     // Retrieve IGN and room code from url query
    
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
    startGame = true;
}

function draw() {
    background("grey");
    
    if (setupComplete){
        
        
        move();
        interpolateOtherPlayers();
        cam.update()
        manageVisiblePlayer(mechplayer, displayPlayer, map)
        if (playerZ != prevPlayerZ){
            map.updateCollisionLayers(playerZ, mechplayer);
            prevPlayerZ = playerZ;
        }
        // mapBuilder.checkIfPlayerIsNearTower
        // checkIfPlayerIsNearTower(player);
        if (map.checkIfPlayerIsNearTower(mechplayer) != false && interactionBtn == undefined && startGame == true) {
            console.log(map.checkIfPlayerIsNearTower(mechplayer))
            interactionBtn = createButton('Examine');
            interactionBtn.addClass('flex m-0 my-2 p-4 scale-90 btn btn-primary hover:scale-100 text-center justify-self-center hover:border-2 hover:border-secondary hover:border-offset-2 overflow-visible w-32');
            interactionBtn.position(width / 2 - 64, height - 100);
            interactionBtn.mouseClicked(towerToggled);
        }
        else if (map.checkIfPlayerIsNearTower(mechplayer) == false && interactionBtn != undefined && startGame == true) {
            interactionBtn.remove();
            interactionBtn = undefined;
        }
        // console.log(map.towerarr)

        socket.emit("position", mechplayer.pos.x, mechplayer.pos.y, playerZ);
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

function towerToggled() {
    let index = map.checkIfPlayerIsNearTower(mechplayer);
    let tower = map.towerobjarr[index];
    let id = tower.id;
    if (tower.active && tower.team != team) {
        socket.emit("deactivateTower", id);
    } else if (tower.active == false){
        socket.emit("activateTower", id);

        console.log("activated")
    } else if (tower.active && tower.team == team) {
        socket.emit("comboTower", id);
    }
    if (map.checkIfPlayerIsNearTower(mechplayer) != false) {
        
    }
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

// function mousePressed() {
//     if (keyIsPressed && keyCode === SHIFT) {
//         console.log(map.towers)
//     } else if (keyIsPressed && keyCode === CONTROL) {
//         if (map.towerarr.length > 0){
//             socket.emit("activateTower", 0);
//         }
//     }
//     // if (allowMapModification) {
//     //     let tile = map.getTile(mouseX, mouseY);
//     //     if (tile) {
//     //         if (wallEditorMode === "*") {
//     //             map.setTile(tile.x, tile.y, tile.z + 1, "wall");
//     //         } else if (wallEditorMode === "=") {
//     //             map.setTile(tile.x, tile.y, tile.z - 1, "wall");

//     //         } else if (wallEditorMode === "x") {
//     //             map.setTile(tile.x, tile.y, tile.z, "barrier");
//     //         } else if (wallEditorMode === "4") {
//     //             map.setTile(tile.x, tile.y, tile.z, "4");
//     //         }
//     //     }

//     // }
// }

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
        displayPlayer.scale.x =  - abs(displayPlayer.scale.x);
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
        displayPlayer.scale.x = -abs(displayPlayer.scale.x);
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
