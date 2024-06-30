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
let team0healthdisplay;
let team1healthdisplay;
let timeRemaining = 180;
let fps;
let speedBoost = false;
let speedSlow = false;

let healths = [100, 100];

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
    map.updateTowers(mapManager.towers);
    console.log(mapManager.towers, map.towerarr)
    displayPlayer = createVisiblePlayerSprite(localIGN, playerZ);
    playerZ = map.setPlayerPosition(1, mechplayer);//map.getTile(round(map.)).z;
    cam.setTarget(displayPlayer);
    map.initializeCollisions(playerZ, mechplayer);
    setupComplete = true;
    mapBuilt = true;
    // updateTeamHealth((healthBar0.elt.contentDocument || healthBar0.elt.contentWindow.document), map.basehealths[0], 0, map.towerhealths[0]);
    // updateTeamHealth((healthBar1.elt.contentDocument || healthBar1.elt.contentWindow.document), map.towerhealths[1], 1, map.towerhealths[1]);
    
});

socket.on("playerDataUpdate", (id, playerData) => {
    for (let data of playerData) {
        if (data.id === id) {
            // coins = data.coins;
            statusconditions = data.statusconditions;
            timeRemaining = data.timer;
            team = data.team;
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
    // map.updateTowers()
    console.log(id, 'updated')
}
);

socket.on("preGenerateTower", (randx, randy, randtype) => {
    map.preGenerateTower(randx, randy, randtype);
    console.log(randx, randy, 'pre-generated')
}
);

socket.on("gameStarted", () => {
    startGame = true;
    map.deleteIdleFrogs();
}
);

socket.on("startingGameSoon", () => {
    console.log("Game starting soon...");
    interactionBtn.remove();
        interactionBtn = undefined;
        Swal.fire({
            title: 'Game starting...',
            html: 'Game will start in 5 seconds.',
            timer: 5000, // milliseconds - 10 seconds for the example
            timerProgressBar: true,
            icon: 'success',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                const content = Swal.getHtmlContainer();
                const timerInterval = setInterval(() => {
                    // Calculate remaining time
                    const timeLeft = Swal.getTimerLeft();
                    if (timeLeft !== null) {
                        content.textContent = `Time remaining: ${Math.ceil(timeLeft / 1000)} seconds`;
                    } else {
                        clearInterval(timerInterval);
                    }
                }, 100);
            },
        });
});

socket.on("gameEnded", (teamwon) => { //temp function
    if (teamwon == team) {
        Swal.fire({
            title: "Victory!",
            text: "Your team has won the game!",
            icon: "success"
        });
    } else {
        Swal.fire({
            title: "Defeat!",
            text: "Your team has lost the game.",
            icon: "error"
        });
    }
}
);

socket.on("updateHealth", (health) => {
    healths = health;
    for (let i = 0; i < health.length; i++) {
        if (health[i] - map.basehealths[i] > 0) {
            console.log('health increased')
        } else if (health[i] - map.basehealths[i] < 0) {
            console.log('health decreased')
        }
    }
    
    console.log('updated health', health)
}
);

socket.on("baseAttacking", (team, tower) => {
    console.log('base attacking')
    map.attackBase(team, tower);
    // speedBoost = true;
    // speedSlow = false;
    
}
);

socket.on("speedBoost", (team, tower) => {
    console.log('speedboost')
    map.boostTeam(team, tower, em.entities, displayPlayer, team);
    speedBoost = true;
    speedSlow = false;
}
);

socket.on("slowdown", (team, tower) => {
    console.log(em)
    map.slowTeam(team, tower, em.entities, displayPlayer, team);
    speedSlow = true;
    speedBoost = false;
}
);

socket.on("healing", (team, tower) => {
    console.log('healing')
    map.healBase(team, tower);
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
let playerSpriteGroup;
function preload() {
    map = new mapBuilder(52, 52, 32);
    // preload idle animation
    // loadAnimation("images/spritesheets/characters/hero/idle.png", "idle", 64, 64, 5);
    playerSpriteGroup = new Group();
    playerSpriteGroup.visible = true;
    playerSpriteGroup.collider = 'none';
    // playerSprite.img = "./new_tileset/tile_001.png";
    playerSpriteGroup.spriteSheet = './textures/charanimap.png';
    // playerSprite.anis.offset.x = -64;
    playerSpriteGroup.anis.offset.y = -64
    playerSpriteGroup.anis.offset.x = 0;
    playerSpriteGroup.anis.frameDelay = 2
    playerSpriteGroup.scale.x = 0.5;
    playerSpriteGroup.scale.y = 0.5;
    playerSpriteGroup.addAnis({
      idle: {row:0, frames: 6, w:128, h:128}, 
      run: {row:7, frames: 6, w:128, h:128},

    });
    // playerSpriteGroup.anis.scale = 0.5;
    // playerSprite.changeAni('idle');
    // playerSprite.layer = 99999;
}

let healthBar0;
let healthBar1;
let timerFrame;
let FPSFrame;

let testspeedBoost;

function setup() {
    createCanvas(windowWidth, windowHeight);
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

    // map =  new mapBuilder(52, 52, 32);
    em = new EntityManager();
    cam = new CameraManager(windowWidth / 2, windowHeight / 2, camera);

    // Create an iframe to display player stats
    
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
        fill("black");
        text(`Room Code: ${currentRoomCode}`, 0, 50, width, 50);
    };
    // startGame = true;
    totalhealth = 100;
    
    healthBar0 = createElement('iframe').size(330, 70);
    healthBar0.addClass('opacity-75 hover:opacity-100 transition ease-in-out rounded-md');
    healthBar0.position(0,0);
    healthBar0.attribute('src', './ui/healthbar.html');

    healthBar1 = createElement('iframe').size(330, 70);
    healthBar1.addClass('opacity-75 hover:opacity-100 transition ease-in-out rounded-md');
    healthBar1.position(windowWidth - 330,0);
    healthBar1.attribute('src', './ui/healthbar1.html');


    // healthBar0.attribute('src', './ui/healthbar.html');
    // console.log(healthBar0)
    map.basehealths[0] -= 10;
    map.basehealths[1] -= 10;
    setTimeout(() => {
        map.basehealths[0] += 10;
        map.basehealths[1] += 10;
    }, 50);


    timerFrame = createElement('iframe').size(200, 60);
    timerFrame.addClass('opacity-80 hover:opacity-100 rounded-lg border-2 transition ease-in-out border-primary bg-gray-800');
    timerFrame.position(width / 2 - 100, -5);
    timerFrame.attribute('src', './ui/timer.html');

    FPSFrame = createElement('iframe').size(150, 60);
    FPSFrame.addClass('opacity-80 hover:opacity-100 rounded-lg border-2 transition ease-in-out border-primary bg-gray-800');
    FPSFrame.position(width - 140, height -37);
    FPSFrame.attribute('src', './ui/fps.html');

    
}

function draw() {
    
    background("grey");
    fps = frameRate().toFixed(2);
    if (setupComplete){
        
        
        move();
        interpolateOtherPlayers();
        cam.update()
        manageVisiblePlayer(mechplayer, displayPlayer, map)
        if (playerZ != prevPlayerZ){
            map.updateCollisionLayers(playerZ, mechplayer);
            prevPlayerZ = playerZ;
        }

        if (startGame == false) {
            map.displayIdleFrogs();
        }

        if (startGame == false && interactionBtn == undefined) {
            interactionBtn = createButton('Start Game');
            interactionBtn.addClass('flex m-0 my-2 p-4 scale-90 btn btn-primary hover:scale-100 border-offset-0 text-center justify-self-center hover:border-2 border-secondary hover:border-offset-4 overflow-visible w-32');
            interactionBtn.position(width / 2 - 64, height - 100);
            interactionBtn.mouseClicked(() => {
                if (em.entities.size < 0) {
                    Swal.fire({
                        title: "Not enough players...",
                        text: "Not enough players to start the game. A minimum of 2 players are needed for the game to start. Please wait for more players to join.",
                        icon: "info"
                    });
                } else {
                    socket.emit("startingGameSoon");
                    interactionBtn.remove();
                    interactionBtn = undefined;
                    Swal.fire({
                        title: 'Game starting...',
                        html: 'Game will start in 5 seconds.',
                        timer: 5000, // milliseconds - 10 seconds for the example
                        timerProgressBar: true,
                        icon: 'success',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                            const content = Swal.getHtmlContainer();
                            const timerInterval = setInterval(() => {
                                // Calculate remaining time
                                const timeLeft = Swal.getTimerLeft();
                                if (timeLeft !== null) {
                                    content.textContent = `Time remaining: ${Math.ceil(timeLeft / 1000)} seconds`;
                                } else {
                                    clearInterval(timerInterval);
                                }
                            }, 100);
                        },
                    });
                    setTimeout(() => {
                        socket.emit("startGame");
                        
                    }, 5000);
            }
            })

        } else if (startGame == true && interactionBtn != undefined) {
            interactionBtn.remove();
            interactionBtn = undefined;
        }
        if (startGame) {
            updateStatusConditions();
            map.checkIfPlayerIsNearTower(mechplayer);
            if (map.checkIfPlayerIsNearTower(mechplayer) != false && interactionBtn == undefined && startGame == true) {
            // console.log(map.checkIfPlayerIsNearTower(displayPlayer))
            // interactionBtn = createButton('Examine');
            // interactionBtn.addClass('flex m-0 my-2 p-4 scale-90 btn btn-primary hover:scale-100 text-center justify-self-center hover:border-2 hover:border-secondary hover:border-offset-2 overflow-visible w-32');
            // interactionBtn.position(width / 2 - 64, height - 100);
            // interactionBtn.mouseClicked(towerToggled);
            // checkKeyPressed();
            }
            else if (map.checkIfPlayerIsNearTower(mechplayer) == false && interactionBtn != undefined && startGame == true) {
                // interactionBtn.remove();
                // interactionBtn = undefined;
            }
            map.toggleFrogFacing(displayPlayer);
        }
        // mapBuilder.checkIfPlayerIsNearTower
        // checkIfPlayerIsNearTower(player);
        
        // console.log(map.towerarr)

        socket.emit("position", mechplayer.pos.x, mechplayer.pos.y, playerZ);

        updateTeamHealth((healthBar0.elt.contentDocument || healthBar0.elt.contentWindow.document), map.basehealths[0], 0, healths[0]);
        updateTeamHealth((healthBar1.elt.contentDocument || healthBar1.elt.contentWindow.document), map.basehealths[1], 1, healths[1]);
        updateTimer((timerFrame.elt.contentDocument || timerFrame.elt.contentWindow.document), timeRemaining);
       
        // console.log(fps)
        
        map.updateHealth(healths);
    }

     updateFPS((FPSFrame.elt.contentDocument || FPSFrame.elt.contentWindow.document), fps);

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

// function checkKeyPressed() {
//     if (keyIsPressed && keyCode == 32) {
//         console.log('shift')
//         towerToggled();
        
//     }
//     // if (keyIsPressed && keyCode === CONTROL) {
//     //     if (map.towerarr.length > 0){
// }

function keyPressed() {
    if (keyCode === 32) {
        console.log('space')
        healths[0] -= 10;
        healths[1] -= 10;
        towerToggled();
    } else if (keyCode == 74){
        console.log('j')
        healths[0] += 10;
        healths[1] += 10;
    
    }
}

function towerToggled() {
    let index = map.checkIfPlayerIsNearTower(displayPlayer);
    if (index == 0) {
        console.log(index, 'no tower')
    } else if (index == false) {
        return
    }
    let tower = map.towerobjarr[index];
    console.log(tower)
    let id = tower.id;
    if (tower.active && tower.team != team) {
        socket.emit("deactivateTower", id);
    } else if (tower.active == false && map.countNumOfUnactivatedTowers() > 1){
        socket.emit("activateTower", id);

        console.log("activated")
    } else if (tower.active && tower.team == team && tower.comboavailable) {
        socket.emit("comboTower", id);
    }
    if (map.checkIfPlayerIsNearTower(mechplayer) != false) {
        
    }
}

let SPEED = 4.5;
let adjacentSPEED = 2 * SPEED**0.5;
let oppSPEED = SPEED**0.5;
function updateStatusConditions() {
    // console.log(statusconditions);
    // console.log(muted)
    // Update statusconditions (from playerStats.js)
    SPEED = 4.5;
    adjacentSPEED = 2 * SPEED**0.5;
    oppSPEED = SPEED**0.5;

    for (let status of statusconditions) {
        if (status == "speedBoost") {
            console.log("speedboost")
            SPEED = 7;
            adjacentSPEED = 2 * SPEED**0.5;
            oppSPEED = SPEED**0.5;
        } else if (status == "slow") {
            console.log("slow") 
            SPEED = 2.5;
            adjacentSPEED = 2 * SPEED**0.5;
            oppSPEED = SPEED**0.5;
        }
        
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
    

    // Play running animation when moving
    // Invert animation where necessary
    if (kb.pressing("w")) {
        displayPlayer.changeAni('run');
        displayPlayer.scale.x = 0.5;
        // move in a diagonal direction based on isometric x and y
        mechplayer.pos.y -= SPEED * oppSPEED / SPEED; 
        mechplayer.pos.x += SPEED * adjacentSPEED / SPEED;

        // mechplayer.pos.y -= SPEED;
        // breakDir = 0;
    }
    if (kb.pressing("a")) {
        displayPlayer.changeAni('run');
        displayPlayer.scale.x =  - abs(displayPlayer.scale.x);
        mechplayer.pos.x -= SPEED * adjacentSPEED / SPEED;
        mechplayer.pos.y -= SPEED * oppSPEED / SPEED;
        // breakDir = 1;
    }
    if (kb.pressing("s")) {
        displayPlayer.changeAni('run');
        displayPlayer.scale.x = -abs(displayPlayer.scale.x);
        mechplayer.pos.y += SPEED * oppSPEED / SPEED;
        mechplayer.pos.x -= SPEED * adjacentSPEED / SPEED;
        // breakDir = 2;
    }
    if (kb.pressing("d")) {
        displayPlayer.changeAni('run');
        displayPlayer.scale.x = 0.5;
        mechplayer.pos.x += SPEED * adjacentSPEED / SPEED;
        mechplayer.pos.y += SPEED * oppSPEED / SPEED;
        // breakDir = 3;
    }

    // Reset animation after player stops moving
    if (kb.released("w")  || kb.released("d")) {
        displayPlayer.scale.x = 0.5;
        displayPlayer.changeAni('idle');
    }
    else if (kb.released("a") || kb.released("s")) {
        displayPlayer.scale.x = -abs(displayPlayer.scale.x);
        displayPlayer.changeAni('idle');
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
