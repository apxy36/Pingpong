const GRID_SIZE = 10;

// let tile_images = [];
const TILE_WIDTH = 32;
const TILE_HEIGHT = 16;
let GRID_SCALE = 1.0;

let mechplayer;
let playerZ = 0;
let prevPlayerZ = 0; 
let em;

//next, to change the "x" into numbers, and then to change the numbers into images
//then to change the images into the isometric view
// then to revamp map generation





let grid = [
  [14, 23, 23, 23, 23, 23, 23, 23, 23, 13],
  [21, 32, 33, 33, 28, 33, 28, 33, 31, 20],
  [21, 34,  0,  0, 25, 33, 30,  1, 34, 20],
  [21, 34,  0,  0, 34,  1,  1, 10, 34, 20],
  [21, 25, 33, 33, 24, 33, 33, 33, 27, 20],
  [21, 34,  4,  7, 34, 18, 17, 10, 34, 20],
  [21, 34,  4,  7, 34, 16, 19, 10, 34, 20],
  [21, 34,  6,  8, 34, 10, 10, 10, 34, 20],
  [21, 29, 33, 33, 26, 33, 33, 33, 30, 20],
  [11, 22, 22, 22, 5, 22, 22, 22, 22, 12]
];


let graphics
let cam;
let displayPlayer;
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  // for (let i = 0; i <= 114; i++) {
  //   tile_images.push(loadImage("./new_tileset/tile_" + i.toString().padStart(3, '0') + ".png"));
  // }

  map = new mapBuilder(70, 70, 32)
  cam = new CameraManager(windowWidth / 2, windowHeight / 2, camera);
  em = new EntityManager()
  // graphics = createGraphics(windowWidth, windowHeight);
  // map.buildMap();
  mechplayer = createPlayerSprite('test') // creates mechanics for player
  map.buildVisualMap();
  displayPlayer = createVisiblePlayerSprite(mechplayer, 'test', map);

  
  // map.buildIso();
  
  
  
  //set playerZ to z coordinate of the tile
  playerZ = map.setPlayerPosition(1, mechplayer);//map.getTile(round(map.)).z;
  cam.setTarget(displayPlayer);
}

function draw_tile(img, x, y, graphics) {
  let x_screen = x_start + (x - y) * TILE_WIDTH/2;
  let y_screen = y_start + (x + y) * TILE_HEIGHT/2;
  graphics.image(img, x_screen, y_screen);
}
//z axis simulated by toggling collider types?
function draw_grid(graphic) {
  x_start = width/2 - TILE_WIDTH/2;
  y_start = height/2 - GRID_SIZE * TILE_HEIGHT/2;
  //i is x
  for (let i = 0; i < GRID_SIZE; i++) {
    let y = 0;
    let x = 0;
    //we assume square grid
    // when i = 0, y can only be 0
    // when i = 1, y can be 0 or 1
    // when i = 2, y can be 0, 1, or 2
    while (i >= y) {
      draw_tile(tile_images[grid[y][i]], i, y, graphic);
      y++;
    }
    while (i >= x) {
      draw_tile(tile_images[grid[i][x]], x, i, graphic);
      x++;
    }
    // for (let j = 0; j < GRID_SIZE; j++) {
    //   draw_tile(tile_images[grid[j][i]], i, j); //sequential, use while loop now (while x > y, draw_tile, y++ )
    // }
  }
}
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


// next step: create a player which interacts with the grid -> DONE
// then integrate z axis mvt with player -> DONE
// improve map generation -> DONE 

// make an entity manager to manage all entities
// make mapManager to manage all maps
// introduce multiplayer
// animate player sprites
// animate tiles
function draw() {
  background("black");
  
  // draw_grid(graphics);
  // let newGraphics = createGraphics(windowWidth * GRID_SCALE, windowHeight * GRID_SCALE);
  // newGraphics.image(graphics,  -windowWidth / 2* (GRID_SCALE - 1), -windowHeight / 2 * (GRID_SCALE - 1), windowWidth * GRID_SCALE, windowHeight * GRID_SCALE);
  // image(graphics,  -windowWidth / 2* (GRID_SCALE - 1),  - windowHeight / 2 * (GRID_SCALE - 1), windowWidth * GRID_SCALE, windowHeight * GRID_SCALE);
  // image(graphics, 0,0)
  // graphics = newGraphics;
  cam.update();
  manageVisiblePlayer(mechplayer, displayPlayer, map)
  if (playerZ != prevPlayerZ){
    map.updateCollisionLayers(playerZ);
    prevPlayerZ = playerZ;
  }
  // map.updateCollisionLayers(playerZ);
  // map.displayIso(cam.camera.x, cam.camera.y, cam.true_scale);
  move();

  // reSize();
  // moveCamera();
}

function reSize(){
  if (kb.pressing("ArrowUp")){
    cam.setScaling(cam.targetscaling + 0.01);
  } else if (kb.pressing("ArrowDown")){
    cam.setScaling(cam.targetscaling - 0.01);
  }
}

function moveCamera(){
  if (kb.pressing("w")){
    // console.log("w")
    cam.setCoordTarget(cam.target.x, cam.target.y - 6 * map.gridscale);
  } else if (kb.pressing("s")){
    cam.setCoordTarget(cam.target.x, cam.target.y + 6 * map.gridscale);
  } else if (kb.pressing("a")){
    cam.setCoordTarget(cam.target.x - 6 * map.gridscale, cam.target.y);
  } else if (kb.pressing("d")){
    cam.setCoordTarget(cam.target.x + 6 * map.gridscale, cam.target.y);
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
