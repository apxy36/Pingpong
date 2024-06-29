class Tile{
  constructor(x, y, z, type){
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = type;
  }

}


class mapBuilder{
  constructor(w, h, cellSize){ // width and height in tiles, width is to the right, height is to left cuz isometric
    this.grid = new Map();
    // first, we generate the map
    // then, we build the map into map tiles
    // then, we build the visual map

    this.mapTiles = null;
    this.displayMapTiles = null;

    this.width = w;
    this.GRID_SIZE = w;
    this.height = h;
    this.cellSize = cellSize;
    this.numCols = w;
    this.numRows = h;
    this.numLayers = 7; // including boundary

    this.gridscale = 1.0;
    this.TILE_WIDTH = cellSize;
    this.TILE_HEIGHT = 16;
    this.TILE_SIDE_LENGTH = cellSize; //(this.TILE_WIDTH**2 + this.TILE_HEIGHT**2)**0.5;


    this.truewidth = this.width * this.TILE_WIDTH;
    this.trueheight = this.height * this.TILE_HEIGHT;
    // console.log(this.truewidth, this.trueheight)
    // this.graphics = this.draw_grid(windowWidth/2, windowHeight/2, this.graphics);
    this.xstart = this.truewidth / 2 - this.TILE_WIDTH / 2;
    this.ystart = this.trueheight / 2 - this.GRID_SIZE * this.TILE_HEIGHT / 2;
    this.mapBuilt = false;

    // this.grid = this.generateRandomMap();
    // // this.tile_images = tile_images;
    // this.gridarray = this.generateMapWithCenterRoom(this.width,this.height,8,10);
    // this.gridarray = this.convertMapToGridArray(this.grid);
    // console.log(this.gridarray)
    // // this.generateMap();
    // this.isoarray = this.generateIsometricTileArray();
    // console.log(this.gridarray)
    // for (let i = 0; i < this.width; i++) {
    //   for (let j = 0; j < this.height; j++) {
    //     this.grid.set(i + "_" + j, new Tile(i, j, round(random(0,2)), 0));
    //   }
    // }
    
    // console.log(this.grid, this.width, this.height, this.gridarray)

    



    this.mapDiagram = null;
    // this.mapBuilt = false;
    this.mapX = 0;
    this.mapY = 0;

    this.w  = 2;
    this.h = 2;




    // Stores location of map overlay areas
    this.mapOverlayAreas;

    // Create sprite groups based on the different tiles available in the map
    // this.floorBricks = new Group();
    // this.wallBricks1 = new Group();
    // this.boundaryBricks = new Group();
    // this.emptyBricks = new Group();
    // this.goldBricks = new Group();
    // this.coingroup = new Group();
    this.mapOverlayAreaSprite = new Group();
  
    // this.graphics = createGraphics(windowWidth, windowHeight);
    
    // for mechanics
    // this.displayLayers = [];
    // for (let i = 0; i < this.numLayers; i++){
    //   this.displayLayers.push(new Group());
    // }


    this.displayLayer0 = new Group();
    this.displayLayer1 = new Group();
    this.displayLayer2 = new Group();
    this.displayLayer3 = new Group();
    this.displayLayer4 = new Group();
    this.displayLayer5 = new Group();
    this.displayBoundaryLayer = new Group();

    // for display
    // this.displayElevatedTileLayers = [];
    // for (let i = 0; i < this.numLayers - 1; i++){
    //   this.displayElevatedTileLayers.push(new Group());
    // }
    this.displayElevatedTileLayer0 = new Group();
    this.displayElevatedTileLayer1 = new Group();
    this.displayElevatedTileLayer2 = new Group();
    this.displayElevatedTileLayer3 = new Group();
    this.displayElevatedTileLayer4 = new Group();
    this.displayElevatedTileLayer5 = new Group();
    this.displayElevatedBoundaryLayer = new Group();

    this.wallColor = '#484848';
    this.pathColor = "#484848";
    this.boundaryColor = "#484848";
    this.goldColor = "#484848";

    // this.convertMapToGridArray(this.grid);
    
    // three storages for tiles: the map, the mechanics, and the display
    this.towers = new Group();
    this.towers.overlaps(allSprites);
    this.towers.collider = 'static';
    this.towers.layer = 9999;
    this.towers.w = this.TILE_SIDE_LENGTH;
    this.towers.h = this.TILE_SIDE_LENGTH * 2;
    this.towers.image = loadImage('./textures/Towers/Green towers/tower_green(7).png');
    this.towers.image.scale = 0.15;
    this.towerarr = [];
    this.towerobjarr = [];
    this.towerprevcountdowns = [];

    this.pretowers = new Group();
    this.pretowers.overlaps(allSprites);
    this.pretowers.collider = 'static';
    this.pretowers.layer = 99999;
    this.pretowers.w = this.TILE_SIDE_LENGTH;
    this.pretowers.h = this.TILE_HEIGHT;
    this.pretowerarr = [];
    this.pretowers.image = loadImage('./textures/Towers/prespawnedtower.png');
    this.pretowers.image.scale = 0.25;
    // client\textures\Towers\prespawnedtower.png
    // this.acti
    this.basehealths = [100, 100];
    this.basetowers = new Group();
    this.basetowers.overlaps(allSprites);
    this.basetowers.collider = 'static';
    this.basetowers.layer = 99999;
    this.basetowers.w = this.TILE_SIDE_LENGTH;
    this.basetowers.h = this.TILE_HEIGHT;
    this.basetowerarr = [];
    // this.basetowers.image = loadImage('./textures/Towers/Green towers/tower_green(7).png');
    // this.basetowers.image.scale = 0.25;

    this.charginganim = new Group();
    this.charginganim.overlaps(allSprites);
    this.charginganim.collider = 'static';
    this.charginganim.layer = 99999;
    this.charginganim.w = this.TILE_SIDE_LENGTH;  
    this.charginganim.h = this.TILE_HEIGHT;
    this.chargingarr = [];
    this.charginganim.spriteSheet = loadImage('./textures/Towers/charginganim.png');
     this.charginganim.addAnis({
        idle: { row: 0, frames: 20, w: 192, h: 192},
        inactive: { row: 1, frames: 20, w: 192, h: 192},
    });
    // this.charginganim.anis.offset.x = 16;
    this.charginganim.anis.frameDelay = 2;
    this.charginganim.anis.scale = 4;
    this.charginganim.anis.rotation = 0;


    // this.towerhealths = [100, 100];

    this.exchangebulletarr = [];
    this.exchangebullets = new Group();
    this.exchangebullets.overlaps(allSprites);
    this.exchangebullets.collider = 'static';
    this.exchangebullets.layer = 99999;
    this.exchangebullets.w = this.TILE_SIDE_LENGTH;
    this.exchangebullets.h = this.TILE_HEIGHT;

    this.explosions = new Group();
    this.explosions.overlaps(allSprites);
    this.explosions.collider = 'static';
    this.explosions.layer = 99999;
    this.explosions.w = this.TILE_SIDE_LENGTH;
    this.explosions.h = this.TILE_HEIGHT;
    this.explosions.spriteSheet = loadImage('./textures/Towers/explosion.png');
    this.explosions.addAnis({
        idle: { row: 0, frames: 9, w: 32, h: 32},
    });
    this.explosions.anis.frameDelay = 2;
    this.explosions.anis.scale = 1;
    this.explosions.anis.rotation = 0;


    this.towerfrogarr = [];
    this.type0towerfrogs = new Group();
    this.type0towerfrogs.overlaps(allSprites);
    this.type0towerfrogs.collider = 'static';
    this.type0towerfrogs.layer = 99999;
    this.type0towerfrogs.w = this.TILE_SIDE_LENGTH;
    this.type0towerfrogs.h = this.TILE_HEIGHT;
    this.type0towerfrogs.spriteSheet = loadImage('./textures/Towers/ToxicFrog/0/ToxicFrogBlueBlue_Sheet.png');
    this.type0towerfrogs.addAnis({
        idle: { row: 0, frames: 8, w: 48, h: 48},
        attack: { row: 2, frames: 6, w: 48, h: 48},
        explode: { row: 4, frames: 9, w: 48, h: 48},
        jump: { row: 1, frames: 7, w: 48, h: 48},
    });
    this.type0towerfrogs.anis.frameDelay = 2;
    this.type0towerfrogs.anis.scale = 2/3;
    this.type0towerfrogs.anis.rotation = 0;


    this.type1towerfrogs = new Group();
    this.type1towerfrogs.overlaps(allSprites);
    this.type1towerfrogs.collider = 'static';
    this.type1towerfrogs.layer = 99999;
    this.type1towerfrogs.w = this.TILE_SIDE_LENGTH;
    this.type1towerfrogs.h = this.TILE_HEIGHT;
    this.type1towerfrogs.spriteSheet = loadImage('./textures/Towers/ToxicFrog/1/ToxicFrogGreenBlue_Sheet.png');
    this.type1towerfrogs.addAnis({
        idle: { row: 0, frames: 8, w: 48, h: 48},
        attack: { row: 2, frames: 6, w: 48, h: 48},
        explode: { row: 4, frames: 9, w: 48, h: 48},
        jump: { row: 1, frames: 7, w: 48, h: 48},

    });
    this.type1towerfrogs.anis.frameDelay = 2;
    this.type1towerfrogs.anis.scale = 2/3;
    this.type1towerfrogs.anis.rotation = 0;

    this.type2towerfrogs = new Group();
    this.type2towerfrogs.overlaps(allSprites);
    this.type2towerfrogs.collider = 'static';
    this.type2towerfrogs.layer = 99999;
    this.type2towerfrogs.w = this.TILE_SIDE_LENGTH;
    this.type2towerfrogs.h = this.TILE_HEIGHT;
    this.type2towerfrogs.spriteSheet = loadImage('./textures/Towers/ToxicFrog/2/ToxicFrogBlueBrown_Sheet.png');
    this.type2towerfrogs.addAnis({
        idle: { row: 0, frames: 8, w: 48, h: 48},
        attack: { row: 2, frames: 6, w: 48, h: 48},
        explode: { row: 4, frames: 9, w: 48, h: 48},
        jump: { row: 1, frames: 7, w: 48, h: 48},
    });
    this.type2towerfrogs.anis.frameDelay = 2;
    this.type2towerfrogs.anis.scale = 2/3;
    this.type2towerfrogs.anis.rotation = 0;

    this.type3towerfrogs = new Group();
    this.type3towerfrogs.overlaps(allSprites);
    this.type3towerfrogs.collider = 'static';
    this.type3towerfrogs.layer = 99999;
    this.type3towerfrogs.w = this.TILE_SIDE_LENGTH;
    this.type3towerfrogs.h = this.TILE_HEIGHT;
    this.type3towerfrogs.spriteSheet = loadImage('./textures/Towers/ToxicFrog/3/ToxicFrogGreenBrown_Sheet.png');
    this.type3towerfrogs.addAnis({
        idle: { row: 0, frames: 8, w: 48, h: 48},
        attack: { row: 2, frames: 6, w: 48, h: 48},
        explode: { row: 4, frames: 9, w: 48, h: 48},
        jump: { row: 1, frames: 7, w: 48, h: 48},

    });
    this.type3towerfrogs.anis.frameDelay = 2;
    this.type3towerfrogs.anis.scale = 2/3;
    this.type3towerfrogs.anis.rotation = 0;

    this.type4towerfrogs = new Group();
    this.type4towerfrogs.overlaps(allSprites);
    this.type4towerfrogs.collider = 'static';
    this.type4towerfrogs.layer = 99999;
    this.type4towerfrogs.w = this.TILE_SIDE_LENGTH;
    this.type4towerfrogs.h = this.TILE_HEIGHT;
    this.type4towerfrogs.spriteSheet = loadImage('./textures/Towers/ToxicFrog/4/ToxicFrogPurpleBlue_Sheet.png');
    this.type4towerfrogs.addAnis({
        idle: { row: 0, frames: 8, w: 48, h: 48},
        attack: { row: 2, frames: 6, w: 48, h: 48},
        explode: { row: 4, frames: 9, w: 48, h: 48},
        jump: { row: 1, frames: 7, w: 48, h: 48},
    });
    this.type4towerfrogs.anis.frameDelay = 2;
    this.type4towerfrogs.anis.scale = 2/3;
    this.type4towerfrogs.anis.rotation = 0;

    this.type5towerfrogs = new Group();
    this.type5towerfrogs.overlaps(allSprites);
    this.type5towerfrogs.collider = 'static';
    this.type5towerfrogs.layer = 99999;
    this.type5towerfrogs.w = this.TILE_SIDE_LENGTH;
    this.type5towerfrogs.h = this.TILE_HEIGHT;
    this.type5towerfrogs.spriteSheet = loadImage('./textures/Towers/ToxicFrog/5/ToxicFrogPurpleWhite_Sheet.png');
    this.type5towerfrogs.addAnis({
        idle: { row: 0, frames: 8, w: 48, h: 48},
        attack: { row: 2, frames: 6, w: 48, h: 48},
        explode: { row: 4, frames: 9, w: 48, h: 48},
        jump: { row: 1, frames: 7, w: 48, h: 48},
    });
    this.type5towerfrogs.anis.frameDelay = 2;
    this.type5towerfrogs.anis.scale = 2/3;
    this.type5towerfrogs.anis.rotation = 0;

    this.healthbars = new Group();
    this.healthbars.overlaps(allSprites);
    this.healthbars.collider = 'static';
    this.healthbars.layer = 99999;
    this.healthbars.w = 100;
    this.healthbars.h = this.TILE_HEIGHT;
    this.basehealthbars = [];

    this.idlefrogs = [];


    // this.exchangebullets.image = loadImage('./textures/Towers/bullet.png');
    // add boid follow mechanics for bullets

    // this.basetowers.image = loadImage('./textures/Towers/basetower.png');

  }

  displayIdleFrogs(){
    //adds frogs
    for (let i = this.idlefrogs.length; i < 10; i++){
      let idlefrog = new this.type0towerfrogs.Sprite();
      let isox = random(0, this.width);
      let isoy = random(0, this.height);
      idlefrog.position.x = (isox - isoy) * this.TILE_WIDTH / 2;
      idlefrog.position.y = (isox + isoy) * this.TILE_HEIGHT / 2;
      this.idlefrogs.push(idlefrog);
      idlefrog.changeAni('jump');
    }
    console.log(this.idlefrogs)
    // move frogs
    for (let i = 0; i < this.idlefrogs.length; i++){
      let idlefrog = this.idlefrogs[i];
      let isox = idlefrog.position.x / this.TILE_WIDTH + idlefrog.position.y / this.TILE_HEIGHT;
      let isoy = idlefrog.position.y / this.TILE_HEIGHT - idlefrog.position.x / this.TILE_WIDTH;
      let newisox = isox + noise(isox * 10000, isoy) * 0.07;
      let newisoy = isoy + noise(isox * 100, -isoy) * 0.07;
      let newx = (newisox - newisoy) * this.TILE_WIDTH / 2;
      let newy = (newisox + newisoy) * this.TILE_HEIGHT / 2;
      let dx = newx - idlefrog.position.x;
      let dy = newy - idlefrog.position.y;
      // change facing of frog 
      if (dx > 0 || dy < 0){
        idlefrog.anis.scale = 2/3;
      } else {
        idlefrog.anis.scale = -2/3;
      }
      idlefrog.position.x = newx;
      idlefrog.position.y = newy;
    }


  }

  deleteIdleFrogs(){
    for (let i = 0; i < this.idlefrogs.length; i++){
      this.idlefrogs[i].remove();
    }
    this.idlefrogs = [];
  }


  buildBaseMap(mapManager){
    this.grid = this.convertTileArrayToMap(mapManager.gridarr);
    console.log(this.grid)
    this.gridarray = this.convertMapToGridArray(this.grid);
    // this.grid = mapManager.grid;
    // console.log(this.gridarray)
    // this.generateMap();
    this.isoarray = this.generateIsometricTileArray();

  }

  convertTileArrayToMap(gridarray){
    let grid = new Map();
    let numCols = gridarray.length;
    let numRows = gridarray[0].length;
    for (let i = 0; i < numCols; i++) {
      for (let j = 0; j < numRows; j++) {
        grid.set(i + "_" + j, gridarray[i][j]);
      }
    }
    return grid;
  }

  getTile(x, y){ // from the map
    if (this.grid.has(x + "_" + y)){
      return this.grid.get(x + "_" + y);
    } else {
      return null;
    }
    // return this.grid.get(x + "_" + y);
  }
  getTileFromMechanicIndex(x, y){ //based on the index x and y of the tile. outofuse
    //gets sprite object\
    let tileIndex = x * this.numCols + y;
    return this.mapTiles[tileIndex];
  }

  generateRandomMap(){
    function initializeGrid(N) {
      let grid = new Map();
      for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
          grid.set(`${x}_${y}`, new Tile(x, y, 0, 'empty'));
        }
        // console.log(grid)
      }
      return grid;
    }

    // Improved Cellular Automata for terrain height generation with gentler slopes
    function generateTerrainHeights(grid, N) {
      // Initialize grid with a less steep initial height distribution
      for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
          grid.get(`${x}_${y}`).z = Math.random() > 0.7 ? 1 : 0; // Fewer initial hills
        }
      }

      // Apply cellular automata rules
      for (let step = 0; step < 5; step++) {
        let newGrid = new Map(grid);
        for (let x = 1; x < N - 1; x++) {
          for (let y = 1; y < N - 1; y++) {
            let neighbors = [
              grid.get(`${x-1}_${y}`).z,
              grid.get(`${x+1}_${y}`).z,
              grid.get(`${x}_${y-1}`).z,
              grid.get(`${x}_${y+1}`).z,
              grid.get(`${x-1}_${y-1}`).z,
              grid.get(`${x+1}_${y-1}`).z,
              grid.get(`${x-1}_${y+1}`).z,
              grid.get(`${x+1}_${y+1}`).z
            ];
            let sum = neighbors.reduce((a, b) => a + b, 0);
            if (sum >= 5) {
              newGrid.get(`${x}_${y}`).z += 1;
              newGrid.get(`${x}_${y}`).z = Math.max(Math.min(newGrid.get(`${x}_${y}`).z, 5), 0)
            } else if (sum <= 2.5) {
              newGrid.get(`${x}_${y}`).z -= 1;
              newGrid.get(`${x}_${y}`).z = Math.max(Math.min(newGrid.get(`${x}_${y}`).z, 5), 0)
            }
          }
        }
        grid = newGrid;
      }

      // Scale heights to range 0-5 and smooth the terrain
      for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
          let avgHeight = (
            grid.get(`${x}_${y}`).z +
            (grid.has(`${x-1}_${y}`) ? grid.get(`${x-1}_${y}`).z : 0) +
            (grid.has(`${x+1}_${y}`) ? grid.get(`${x+1}_${y}`).z : 0) +
            (grid.has(`${x}_${y-1}`) ? grid.get(`${x}_${y-1}`).z : 0) +
            (grid.has(`${x}_${y+1}`) ? grid.get(`${x}_${y+1}`).z : 0)
          ) / 5;
          grid.get(`${x}_${y}`).z = Math.round(avgHeight);
        }
      }
    }

    // Improved Wave Function Collapse for assigning tile types
    function assignTileTypes(grid, N) {
      const types = ['stone', 'grass', 'wall', 'brick', 'wood'];
      const tileTypeWeights = {
        'stone': 1,
        'grass': 2,
        'wall': 1,
        'brick': 1,
        'wood': 1,
      };

      function getPossibleTypes(tile) {
        return types.filter(type => tileTypeWeights[type]);
      }

      function collapseTile(x, y) {
        let tile = grid.get(`${x}_${y}`);
        let possibleTypes = getPossibleTypes(tile);
        if (possibleTypes.length === 0) return;
        let totalWeight = possibleTypes.reduce((sum, type) => sum + tileTypeWeights[type], 0);
        let rand = Math.random() * totalWeight;
        for (let type of possibleTypes) {
          rand -= tileTypeWeights[type];
          if (rand <= 0) {
            tile.type = type;
            break;
          }
        }
      }

      for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
          collapseTile(x, y);
        }
      }
    }

    function createBoundaryLayer(grid, N) {
      for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
          if (x === 0 || x === N - 1 || y === 0 || y === N - 1) {
            grid.get(`${x}_${y}`).z = 'B';
            grid.get(`${x}_${y}`).type = 'boundary';
          }
        }
      }
    }

    function createBridge(grid, N) {
      let startX = Math.floor(Math.random() * (N - 4)) + 2;
      let startY = Math.floor(Math.random() * (N - 4)) + 2;
      let length = Math.floor(Math.random() * (N / 2)) + 3;
      let direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';

      for (let i = 0; i < length; i++) {
        let x = startX;
        let y = startY;

        if (direction === 'horizontal') {
          x = (startX + i) % N;
        } else {
          y = (startY + i) % N;
        }

        if (x === 0 || x === N - 1 || y === 0 || y === N - 1) break;

        grid.get(`${x}_${y}`).z = 3; // Flat bridge height
        grid.get(`${x}_${y}`).type = 'wood';
      }
    }

    // Add lakes and forests
    function addLakesAndForests(grid, N) {
      let lakeSize = Math.floor(Math.random() * (N / 4)) + 2;
      let forestSize = Math.floor(Math.random() * (N / 4)) + 2;
      let lakeX = Math.floor(Math.random() * (N - lakeSize));
      let lakeY = Math.floor(Math.random() * (N - lakeSize));
      let forestX = Math.floor(Math.random() * (N - forestSize));
      let forestY = Math.floor(Math.random() * (N - forestSize));

      // Create a lake
      for (let x = lakeX; x < lakeX + lakeSize; x++) {
        for (let y = lakeY; y < lakeY + lakeSize; y++) {
          grid.get(`${x}_${y}`).type = 'water';
          grid.get(`${x}_${y}`).z = 0;
        }
      }

      // Create a forest
      for (let x = forestX; x < forestX + forestSize; x++) {
        for (let y = forestY; y < forestY + forestSize; y++) {
          grid.get(`${x}_${y}`).type = 'forest';
        }
      }
    }

    function printMap(grid, N) {
      for (let y = 0; y < N; y++) {
        let row = '';
        for (let x = 0; x < N; x++) {
          let tile = grid.get(`${x}_${y}`);
          row += `${tile.type[0]}(${tile.z}) `;
        }
        console.log(row);
      }
    }

    function generateMap(N) {
      let grid = initializeGrid(N);
      generateTerrainHeights(grid, N);
      assignTileTypes(grid, N);
      
      createBridge(grid, N);
      addLakesAndForests(grid, N);
      createBoundaryLayer(grid, N);
      // ensureAccessibility(grid, N);

      return grid;
    }
    return generateMap(this.GRID_SIZE)

  }

  generateMap(){
    for (let i = 0; i < this.numCols; i++) {
      for (let j = 0; j < this.numRows; j++) {
        if (this.gridarray[j][i] == "0"){
          this.grid.set(i + "_" + j, new Tile(i, j, 0, "0"));
        } else if (this.gridarray[j][i] == "1"){
          this.grid.set(i + "_" + j, new Tile(i, j, 1, "1"));
        } else if (this.gridarray[j][i] == "2"){
          this.grid.set(i + "_" + j, new Tile(i, j, 2, "2"));
        } else if (this.gridarray[j][i] == "3"){
          this.grid.set(i + "_" + j, new Tile(i, j, 3, "3"));
        } else if (this.gridarray[j][i] == "4"){
          this.grid.set(i + "_" + j, new Tile(i, j, 4, "4"));
        } else if (this.gridarray[j][i] == "5"){
          this.grid.set(i + "_" + j, new Tile(i, j, 5, "5"));
        } else if (this.gridarray[j][i] == "B"){
          this.grid.set(i + "_" + j, new Tile(i, j, "B", "B"));
        }

        // this.grid.set(i + "_" + j, new Tile(i, j, round(random(0,2)), this.gridarray[j][i]));
      }
    }
    // console.log(this.grid)
  }

  convertMapToGridArray(map){
    // console.log(map.get("0_1"))
    let gridarray = [];
    for (let i = 0; i < this.numCols; i++) {
      // join the array to make it a string
      let row = [];
      for (let j = 0; j < this.numRows; j++) {
        row.push(map.get(i + "_" + j).z);
      }
      row = row.join('');
      // console.log(row)
      gridarray.push(row);
    }
    // console.log(gridarray)
    return gridarray;
  }
  // temporary generation function for testing
  generateMapWithCenterRoom(mapWidth, mapHeight, treasureRoomWidth, treasureRoomHeight) {
      // Initialize the map with "*" for the outside area.
      let map = Array.from({ length: mapHeight }, () => Array(mapWidth).fill('0'));

      // Set the outer boundary of the map as "2".
      for (let y = 0; y < mapHeight; y++) {
          for (let x = 0; x < mapWidth; x++) {
              if (x === 0 || y === 0 || x === mapWidth - 1 || y === mapHeight - 1) {
                  map[y][x] = 'B';
              }
          }
      }

      let rooms = []; // To keep track of the rooms' coordinates and sizes.

      // Helper function to check if a room can be placed.
      function canPlaceRoom(topLeftX, topLeftY, roomWidth, roomHeight) {
          if (topLeftX + roomWidth + 1 >= mapWidth || topLeftY + roomHeight + 1 >= mapHeight || topLeftX < 1 || topLeftY < 1) {
              return false; // Room goes out of the boundary or touches the boundary edge.
          }

          return rooms.every(room => {
              return topLeftX + roomWidth < room.x || topLeftX > room.x + room.width ||
                  topLeftY + roomHeight < room.y || topLeftY > room.y + room.height;
          });
      }

      // Helper function to place a room on the map.
      function placeRoom(topLeftX, topLeftY, roomWidth, roomHeight, isTreasureRoom) {
          for (let y = topLeftY; y < topLeftY + roomHeight; y++) {
              for (let x = topLeftX; x < topLeftX + roomWidth; x++) {
                  if (y === topLeftY || y === topLeftY + roomHeight - 1 || x === topLeftX || x === topLeftX + roomWidth - 1) {
                      map[y][x] = '1'; // Place wall
                  } else {
                      if (isTreasureRoom) {
                          map[y][x] = '2'; //change back ltr
                      }
                      else {
                          map[y][x] = '2'; // Place path inside the room
                      }
                  }
              }
          }
          rooms.push({ x: topLeftX, y: topLeftY, width: roomWidth, height: roomHeight });
      }

      // Ensure a central room is always placed first. Its location is fixed
      const [centralRoomWidth, centralRoomHeight] = [40, 12]

      // Minus 2 to avoid touching boundary walls
      // Minus additional 4 from mapHeight to ensure the  center room is slightly above the boundary edge
      const centralRoomLocation = {
          x: Math.floor((mapWidth - centralRoomWidth - 2) / 2),
          y: Math.floor((mapHeight - centralRoomHeight - 2 - 4) / 2)
      };

      placeRoom(centralRoomLocation.x, centralRoomLocation.y + (mapHeight - 12) / 2, centralRoomWidth, centralRoomHeight, false);

      this.centralRoomLocation = {
          x: centralRoomLocation.x,
          y: centralRoomLocation.y + (mapHeight - 12) / 2
      };

      this.centralRoomHeight = centralRoomHeight;
      this.centralRoomWidth = centralRoomWidth;

      // Attempt to place 3 other treasure rooms on the map.
      let numTreasureRooms = 0;
      // Randomly generate which treasure room contains the real gold
      let realTreasureRoomIndex = Math.floor(this.random(0, 2));
      this.realTreasureRoomIndex = realTreasureRoomIndex;

      while (numTreasureRooms < 3) {
          const topLeftX = Math.floor(Math.random() * (mapWidth - treasureRoomWidth - 1)) + 1;
          // Rooms must spawn above the central room
          const topLeftY = Math.floor(Math.random() * (this.centralRoomLocation.y - treasureRoomHeight - 1)) + 1;

          let vertDistBetwTreasureMainRm = Math.abs((topLeftY + treasureRoomHeight) - (this.centralRoomLocation.y));

          if (canPlaceRoom(topLeftX, topLeftY, treasureRoomWidth, treasureRoomHeight) && vertDistBetwTreasureMainRm > 15) {
              placeRoom(topLeftX, topLeftY, treasureRoomWidth, treasureRoomHeight, true);

              if (numTreasureRooms == realTreasureRoomIndex) {
                  // Push the real treasure room to the global variable
                  this.realTreasureRoomLocation = { x: topLeftX, y: topLeftY, width: treasureRoomWidth, height: treasureRoomHeight };
                  // this.realTreasureRoomLocationCoords = {x : topLeftX * 32 }
              }

              numTreasureRooms += 1;
          }
      }

      return map.map(row => row.join(''));
  }

  generateIsometricTileArray() {
    this.isoarray = Array.from({ length: (this.numCols + this.numRows - 1) }, () => Array(this.numCols + this.numRows - 1).fill('.'));
    let xstart = round((this.numCols + this.numRows - 1) / 2);
    let ystart = 0
    for (let i = 0; i < this.numCols; i++) {
      for (let j = 0; j < this.numRows; j++) {
        this.editIsoTileArray(i, j, this.grid.get(i + "_" + j).z, xstart, ystart);
      }
    }
    this.isoarray = this.isoarray.map(row => row.join('')); 
    // console.log(this.isoarray)
    return this.isoarray;
  }

  editIsoTileArray(x, y, type, xstart, ystart){
    let arrayx = (x - y) + xstart;
    let arrayy = (x + y) + ystart;
    
    if (this.isoarray){
      this.isoarray[arrayy][arrayx] = type;
    }
    // if (arrayy < 5){
    //   console.log(arrayx, arrayy, type, this.isoarray[arrayy])
    // }
    
  }

  getIndexFromIsoArray(x, y){
    let xstart = round((this.numCols + this.numRows - 1) / 2);
    let ystart = 0;
    let arrayx = (x - y) + xstart;
    let arrayy = (x + y) + ystart;
    return arrayx * (this.numCols + this.numRows - 1) + arrayy;
  }

  findFromCoords(x,y){
    let xstart = round((this.numCols + this.numRows - 1) / 2) * this.TILE_WIDTH / 2;
    let ystart = 0;
    let coordx = (y / this.TILE_HEIGHT) - (ystart / this.TILE_HEIGHT) + (x / this.TILE_WIDTH) - (xstart / this.TILE_WIDTH);
    let coordy = coordx + (2 * xstart) / this.TILE_WIDTH -  (2 * x) / this.TILE_WIDTH;
    // console.log(coordx, coordy, x, y, xstart, ystart)
    return createVector(round(coordx), round(coordy));
  }

  getAdjacentTiles(x, y){
    let adjacents = [];
    // finds adjacent tiles from map given x and y
    if (x > 0){
      adjacents.push(this.getTile(x - 1, y));
    }
    if (x < this.numCols - 1){
      adjacents.push(this.getTile(x + 1, y));
    }
    if (y > 0){
      adjacents.push(this.getTile(x, y - 1));
    }
    if (y < this.numRows - 1){
      adjacents.push(this.getTile(x, y + 1));
    }
    return adjacents;
  }


  buildMap() { // out of use
    // Leveraging p5play mechanics to manage player movement

      // Clear existing map before building
      if (this.mapTiles != null) {
          this.mapTiles.removeAll();
      }

      // this.numCols = this.numCols;
      // this.numRows = this.numRows;
      // this.mapDiagram = createGraphics(this.numCols * this.w, this.numRows * this.h);

      // Construct map based on this from server side


      this.floorBricks.w = this.TILE_SIDE_LENGTH; // Width of each brick
      this.floorBricks.h = this.TILE_SIDE_LENGTH; // Height of each brick
      this.floorBricks.tile = "0";
      // this.floorBricks.color = this.wallColor;
      this.floorBricks.collider = 'static';
      // this.floorBricks.stroke = this.wallColor;
      this.floorBricks.overlaps(allSprites);
      // this.floorBricks.layer = 990;
    //   this.floorBricks.img = "./textures/wall.png";

      this.wallBricks1.w = this.TILE_SIDE_LENGTH;
      this.wallBricks1.h = this.TILE_SIDE_LENGTH;
      this.wallBricks1.tile = "1";
      // this.wallBricks1.color = this.pathColor;
      this.wallBricks1.collider = 'static';
      // this.wallBricks1.stroke = this.pathColor;
      // this.wallBricks1.layer = 990;
    //   this.wallBricks1.img = "./textures/path.png";

      this.boundaryBricks.w = this.TILE_SIDE_LENGTH;
      this.boundaryBricks.h = this.TILE_SIDE_LENGTH;
      this.boundaryBricks.tile = "2";
      // this.boundaryBricks.color = this.boundaryColor;
      this.boundaryBricks.collider = 'static';
      // this.boundaryBricks.stroke = this.boundaryColor;
      // this.boundaryBricks.layer = 990;
    //   this.boundaryBricks.img = "./textures/boundary.png";

      this.goldBricks.w = this.TILE_SIDE_LENGTH;
      this.goldBricks.h = this.TILE_SIDE_LENGTH;
      this.goldBricks.tile = "3";
      // this.goldBricks.color = this.goldColor;
      this.goldBricks.collider = 'static';
      // this.goldBricks.stroke = this.goldColor;
      this.goldBricks.overlaps(allSprites);
      // this.goldBricks.layer = -999;
    //   this.goldBricks.img = "./textures/gold.png";

      this.emptyBricks.w = this.TILE_SIDE_LENGTH;
      this.emptyBricks.h = this.TILE_SIDE_LENGTH;
      this.emptyBricks.tile = "4";
      // this.emptyBricks.color = "#484848";
      this.emptyBricks.collider = 'static';
      // this.emptyBricks.stroke = "#484848";
      this.emptyBricks.overlaps(allSprites);
      // this.emptyBricks.layer = -999;
    //   this.emptyBricks.img = "./textures/empty.png";

      // Position tiles at the bottom center of the screen
      this.mapTiles = new Tiles(this.gridarray, // 2D array of tiles
          0, // x to centralise map
          0, // y to position at top
          this.TILE_SIDE_LENGTH,
          this.TILE_SIDE_LENGTH);

      this.mapTiles.visible = false;
      // console.log(this.mapTiles)

      this.mapX = 0;//(width / 2) - (this.numCols / 2) * this.cellSize;
      this.mapY = 0;//height - this.numRows * this.cellSize;

      // Obtain the real treasure room
      // this.realTreasureRoomLocation = this.realTreasureRoomLocation;
      this.mapCellSize = this.TILE_SIDE_LENGTH;

      // Build map overlays
      // Define props for map overlays
      // this.mapOverlayAreaSprite.collider = 'static';
      // this.mapOverlayAreaSprite.layer = 999;

      // Build map overlay areas
      // let mapOverlayAreas = this.mapOverlayAreas;
      // this.mapOverlayAreas = this.mapOverlayAreas;

      // for (let i = 0; i < mapOverlayAreas.length; i++) {
      //     let mapOverlayArea = mapOverlayAreas[i];
      //     let mapOverlayAreaSprite = new this.mapOverlayAreaSprite.Sprite();

      //     if (mapOverlayArea.collider == "none") {
      //         mapOverlayAreaSprite.overlaps(allSprites);
      //     }

      //     mapOverlayAreaSprite.w = mapOverlayArea.w * this.mapCellSize;
      //     mapOverlayAreaSprite.h = mapOverlayArea.h * this.mapCellSize;
      //     // p5play treats position of rectangle using the center point of the rect, hence this suspicious positioning fix
      //     mapOverlayAreaSprite.x = (mapOverlayArea.x * this.mapCellSize) + this.mapX + (mapOverlayAreaSprite.w / 2) - (this.mapCellSize / 2);
      //     mapOverlayAreaSprite.y = (mapOverlayArea.y * this.mapCellSize) + this.mapY + (mapOverlayAreaSprite.h / 2) - (this.mapCellSize / 2);
      //     mapOverlayAreaSprite.img = mapOverlayArea.img;
      // }

      this.mapBuilt = true;
  }

  buildVisualMap() {

    //revamping the entire map groupings: 0 -> z = 0, 1 -> z = 1, 2 -> z = 2, 3 -> z = 3, 4 -> z = 4, 5 -> z = 5

    if (this.displayMapTiles != null) {
      this.displayMapTiles.removeAll();
    }



    this.displayLayer0.w = this.TILE_WIDTH; // Width of each brick
    this.displayLayer0.h = this.TILE_HEIGHT; // Height of each brick
    this.displayLayer0.tile = "0";
    this.displayLayer0.collider = 'static';
    // this.displayLayer0.overlaps(allSprites);
    this.displayLayer0.layer = -990;
    this.displayLayer0.visible = false;
    // this.displayLayer0.img = './new_tileset/tile_066.png';

    this.displayLayer1.w = this.TILE_WIDTH;
    this.displayLayer1.h = this.TILE_HEIGHT
    this.displayLayer1.tile = "1";
    this.displayLayer1.collider = 'static';
    // this.displayLayer1.overlaps(allSprites);
    this.displayLayer1.layer = 0;
    // this.displayLayer1.img = './new_tileset/tile_067.png';
    this.displayLayer1.visible = false;

    this.displayLayer2.w = this.TILE_WIDTH;
    this.displayLayer2.h = this.TILE_HEIGHT;
    this.displayLayer2.tile = "2";
    this.displayLayer2.collider = 'static';;
    this.displayLayer2.layer = 0//990;
    // this.displayLayer2.img = './new_tileset/tile_028.png';
    this.displayLayer2.visible = false;

    this.displayLayer3.w = this.TILE_WIDTH;
    this.displayLayer3.h = this.TILE_HEIGHT;
    this.displayLayer3.tile = "3";
    this.displayLayer3.collider = 'static';
    this.displayLayer3.layer = 0; //2*999;
    // this.displayLayer3.img = './new_tileset/tile_068.png';
    this.displayLayer3.visible = false;

    this.displayLayer4.w = this.TILE_WIDTH;
    this.displayLayer4.h = this.TILE_HEIGHT;
    this.displayLayer4.tile = "4";
    this.displayLayer4.collider = 'static';
    this.displayLayer4.layer = 0; //3*999;
    // this.displayLayer4.img = './new_tileset/tile_069.png';
    this.displayLayer4.visible = false;

    this.displayLayer5.w = this.TILE_WIDTH;
    this.displayLayer5.h = this.TILE_HEIGHT;
    this.displayLayer5.tile = "5";
    // this.displayLayer5.color = "#484848";
    this.displayLayer5.collider = 'static';
    // this.displayLayer5.stroke = "#484848";
    // this.displayLayer5.overlaps(allSprites);
    this.displayLayer5.layer = 0; //4*999;
    // this.displayLayer5.img = './new_tileset/tile_070.png';
    this.displayLayer5.visible = false;

    

    this.displayBoundaryLayer.w = this.TILE_WIDTH;
    this.displayBoundaryLayer.h = this.TILE_HEIGHT;
    this.displayBoundaryLayer.tile = "B";
    this.displayBoundaryLayer.collider = 'static';
    this.displayBoundaryLayer.layer = -500; //5*999;
    this.displayBoundaryLayer.img = './new_tileset/tile_071.png';

    // for (let i = 0; i < this.numLayers - 1; i++){
    //   this.displayElevatedTileLayers[i].w = this.TILE_WIDTH;
    //   this.displayElevatedTileLayers[i].h = this.TILE_HEIGHT;
    //   this.displayElevatedTileLayers[i].collider = 'static';
    //   this.displayElevatedTileLayers[i].overlaps(allSprites);
    //   this.displayElevatedTileLayers[i].layer = i*999;
    //   this.displayElevatedTileLayers[i].img = './new_tileset/tile_027.png';
    // }

    this.displayElevatedTileLayer0.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer0.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer0.collider = 'none';
    // this.displayElevatedTileLayer0.overlaps(allSprites);
    this.displayElevatedTileLayer0.layer = -1*999;


    this.displayElevatedTileLayer1.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer1.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer1.collider = 'none';
    // this.displayElevatedTileLayer1.overlaps(allSprites);
    this.displayElevatedTileLayer1.layer = 0*999;
    // this.displayElevatedTileLayer1.img = './new_tileset/tile_027.png';

    this.displayElevatedTileLayer2.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer2.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer2.collider = 'none';
    // this.displayElevatedTileLayer2.overlaps(allSprites);
    this.displayElevatedTileLayer2.layer = 1*999;
    // this.displayElevatedTileLayer2.img = './new_tileset/tile_027.png';

    this.displayElevatedTileLayer3.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer3.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer3.collider = 'none';
    // this.displayElevatedTileLayer3.overlaps(allSprites);
    this.displayElevatedTileLayer3.layer = 2*999;
    // this.displayElevatedTileLayer3.img = './new_tileset/tile_027.png';

    this.displayElevatedTileLayer4.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer4.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer4.collider = 'none';
    // this.displayElevatedTileLayer4.overlaps(allSprites);
    this.displayElevatedTileLayer4.layer = 3*999;
    // this.displayElevatedTileLayer4.img = './new_tileset/tile_027.png';

    this.displayElevatedTileLayer5.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer5.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer5.collider = 'none';
    // this.displayElevatedTileLayer5.overlaps(allSprites);
    this.displayElevatedTileLayer5.layer = 4*999;
    // this.displayElevatedTileLayer5.img = './new_tileset/tile_027.png';

    // this.displayElevatedBoundaryLayer.w = this.TILE_WIDTH;
    // this.displayElevatedBoundaryLayer.h = this.TILE_HEIGHT;
    // this.displayElevatedBoundaryLayer.collider = 'static';
    // this.displayElevatedBoundaryLayer.overlaps(allSprites);
    // this.displayElevatedBoundaryLayer.layer = 5*999;
    // this.displayElevatedBoundaryLayer.img = './new_tileset/tile_027.png';



    this.displayMapTiles = new Tiles(this.isoarray, // 2D array of tiles
        0, // x to centralise map
        0, // y to position at top
        this.TILE_WIDTH / 2,
        this.TILE_HEIGHT / 2);
    // console.log(this.displayMapTiles)
    // this.mapTiles.collider = 'none';

    // console.log(this.displayMapTiles)
    // for (let i = 0; i < this.displayMapTiles.length; i++) {
    //   let tile = this.displayMapTiles[i]; //sprite object
    //   let vect = this.findFromCoords(tile.pos.x, tile.pos.y);
    //   let z = this.getTile(vect.x, vect.y).z;
    //   if (z != 0){
        
    //     // this.displayLayer0.overlaps(allSprites);
    //   }
    // }

    for (let i = 0; i < this.displayMapTiles.length; i++) {
      let tile = this.displayMapTiles[i]; //sprite object
      let vect = this.findFromCoords(tile.pos.x, tile.pos.y);
      let z = this.getTile(vect.x, vect.y).z;
      if (z != 'B'){
        // tile.pos.y -= z * this.TILE_HEIGHT / 2;
        // console.log(z, vect.x, vect.y)
        
        // + z * this.TILE_HEIGHT / 2; //make an entirely new tile that displays another image but has no collision, at the elevated pos. the original tile is at the original pos
        let type = this.getTile(vect.x, vect.y).type;
        let displayTile;
        // if (z != 'B'){
        //   displayTile = new this.displayElevatedTileLayers[z - 1].Sprite();
        // } else {
        //   displayTile = new this.displayElevatedBoundaryLayer.Sprite();
        // } else {
        //   displayTile = new this.displayElevatedTileLayer1.Sprite();
        // }
        if (z == 0){
          displayTile = new this.displayElevatedTileLayer0.Sprite();
        } else if (z == 1){
          displayTile = new this.displayElevatedTileLayer1.Sprite();
        } else if (z == 2){
          displayTile = new this.displayElevatedTileLayer2.Sprite();
        } else if (z == 3){
          displayTile = new this.displayElevatedTileLayer3.Sprite();
        } else if (z == 4){
          displayTile = new this.displayElevatedTileLayer4.Sprite();
        } else if (z == 5){
          displayTile = new this.displayElevatedTileLayer5.Sprite();
        } else if (z == 'B'){
          continue;
          displayTile = new this.displayElevatedBoundaryLayer.Sprite();
        } else {
          displayTile = new this.displayElevatedTileLayer1.Sprite();
        }
        if (z != 'B'){
          if (type == "grass"){
            displayTile.img = './new_tileset/tile_027.png';
          } else if (type == "stone"){
            displayTile.img = './new_tileset/tile_063.png';
          } else if (type == "wood"){
            displayTile.img = './new_tileset/tile_014.png';
          } else if (type == "brick"){
            displayTile.img = './new_tileset/tile_066.png';
          } else if (type == "wall"){
            displayTile.img = './new_tileset/tile_031.png';
          } else if (type == "water"){
            displayTile.img = './new_tileset/tile_104.png';
          } else if (type == "forest"){
            displayTile.img = './new_tileset/tile_036.png';
          }


          // let newtile = new this.displayElevatedTileLayer0.Sprite();
          // newtile.pos = createVector(tile.pos.x, tile.pos.y);
          // newtile.img = displayTile.img;

          displayTile.pos.x = tile.pos.x;
          if (z != 'B'){
          displayTile.pos.y = tile.pos.y - z * this.TILE_HEIGHT / 2;
          } else {
            displayTile.pos.y = tile.pos.y - 10 * this.TILE_HEIGHT / 2;
          }
        }

      }
    }



    // for (let i = 0; i < this.numCols; i++) { //x 
    //     for (let j = 0; j < this.numRows; j++) { // y
    //       let tile = this.getTile(i, j);
    //       if (tile != null) {
    //         // console.log(43)
    //         let displayTile;
    //         if (tile.type == "0") {
    //           displayTile = new this.displayLayer0.Sprite();
    //         } else if (tile.type == "1") {
    //             displayTile = new this.displayLayer1.Sprite();
    //         } else if (tile.type == "2") {
    //             displayTile = new this.displayLayer2.Sprite();
    //         } else if (tile.type == "2") {
    //             displayTile = new this.displayLayer3.Sprite();
    //         } else if (tile.type == "4") {
    //             displayTile = new this.displayLayer4.Sprite();
    //         } else {
    //             displayTile = new this.displayLayer4.Sprite();
    //         }
    //         displayTile.pos.x = this.xstart + (i - j) * this.TILE_WIDTH/2;//i * this.cellSize + (j * this.cellSize / 2);
    //         displayTile.pos.y = this.ystart + (i + j) * this.TILE_HEIGHT/2 - tile.z * this.TILE_HEIGHT/2; 
    //         // j * this.cellSize / 2 - i * this.cellSize / 2;
    //         this.displayMapTiles.push(displayTile); 
    //       }
    //       // console.log(tile)
          
    //   }

    // }
    // console.log(" displayer",this.displayMapTiles)
    this.basehealthbars = [];
    for (let i = 0; i < 2; i++){
      let base = new this.basetowers.Sprite();
      if (i == 0){
        // let xpos = this.xstart + (this.numCols - this.numRows) * this.TILE_WIDTH / 2;
        base.pos = createVector(this.xstart, this.ystart + (2) * this.TILE_HEIGHT / 2);
        // find z pos
        let z = this.getTile(1, 1).z;
        base.pos.y -= z * this.TILE_HEIGHT / 2;
        base.img = "./textures/Towers/Green towers/tower_green(1).png"
      } else {
        let xpos = this.xstart + (this.numCols - this.numRows) * this.TILE_WIDTH / 2;
        let ypos = this.ystart + (this.numCols + this.numRows - 2) * this.TILE_HEIGHT / 2;
        base.pos = createVector(xpos, ypos);
        base.img = "./textures/Towers/Orange towers/tower_orange(1).png"
        let z = this.getTile(this.numCols - 3, this.numRows - 3).z;
        base.pos.y -= z * this.TILE_HEIGHT / 2;
      }
      base.img.scale = 0.18;
      base.img.offset.x = 105;
      base.img.offset.y = -90;

      let healthbar = new this.healthbars.Sprite();
      healthbar.pos = createVector(base.pos.x  - 50, base.pos.y - 100);
      healthbar.collider = "none";
    // making it a health bar that dynamically updates its colours and size
      healthbar.draw = () => {
        let team0health = this.basehealths[i];
        // let team1health = map.team1health;
        // let totalhealth = team0health + team1health;
        let team0healthpercentage = team0health / 100;
        
        //first, an outline with rounded edges
        // fill("black");
        stroke("black");
        fill("white"); //
        strokeWeight(2);
        // rect(0,0, windowWidth / 4, windowHeight / 10, 8);
        //then, the actual health bar through lerpcolor
        let green = color('#03C04A'); //green
        let red = color('#FF7F50'); //red
        let intermediate = lerpColor(green, red, team0healthpercentage);
        for (let j = 0; j < team0healthpercentage * 100; j++) {
            // fill("green");
            // noStroke();
            let newcolor = lerpColor(green, intermediate, j / (team0healthpercentage * 100));
            fill(newcolor);
            strokeWeight(0);
            rect(j + 20, 30, 1, 10);
        }

        // let team1healthpercentage = team1health / totalhealth;
        // let team0healthbar = new Sprite(0, 0, team0healthpercentage * 100, 10);
        // let team1healthbar = new Sprite(0, 0, team1healthpercentage * 100, 10);
        // team0healthbar.fill = "green";
        // team1healthbar.fill = "red";
        // team0healthbar.pos.x = width / 2 - 50;
        // team0healthbar.pos.y = height - 50;
        // team1healthbar.pos.x = width / 2 + 50;
        // team1healthbar.pos.y = height - 50;
        // team0healthbar.draw();
        // team1healthbar.draw();
      }
      this.basehealthbars.push(healthbar);

      this.basetowerarr.push(base);
    }
    this.mapBuilt = true;
  }

  updateCollisionLayers(playerZ, playerSprite){ // reconfig to make it player based? ie playersprite.overlaps(displayLayer0)
    // for (let i = -1; i < 1; i++){
    //   let index = min(max(playerZ + i, 0), this.numLayers - 2);
    //   this.displayLayers[index].overlaps(allSprites);
    // }
    playerSprite.collides(this.displayBoundaryLayer)
    if (playerZ == 0){
      // playerSprite.overlaps(this.displayLayer0);
      // playerSprite.overlaps(this.displayLayer1);
      playerSprite.collides(this.displayLayer2);
      // playerSprite.collides(this.displayLayer3);
      // playerSprite.collides(this.displayLayer4);
      // playerSprite.collides(this.displayLayer5);
      // this.displayLayer0.overlaps(allSprites);
      // this.displayLayer1.overlaps(allSprites);
      // this.displayLayer2.overlaps(null)
      // this.displayLayer3.overlaps(null)
      // this.displayLayer4.overlaps(null)
      // this.displayLayer5.overlaps(null)

      // this.displayLayer2.overlaps(allSprites, null);
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(allSprites);
    } else if (playerZ == 1){
      playerSprite.overlaps(this.displayLayer0);
      // playerSprite.overlaps(this.displayLayer1);
      playerSprite.overlaps(this.displayLayer2);
      playerSprite.collides(this.displayLayer3);
      // playerSprite.collides(this.displayLayer4);
      // playerSprite.collides(this.displayLayer5);

      // this.displayLayer0.overlaps(allSprites);
      // this.displayLayer1.overlaps(allSprites);
      // this.displayLayer2.overlaps(allSprites);
      // this.displayLayer3.overlaps(null)
      // this.displayLayer4.overlaps(null)
      // this.displayLayer5.overlaps(null)
      // console.log(this.displayLayer2)
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(allSprites);
    } else if (playerZ == 2){
      playerSprite.collides(this.displayLayer0);
      playerSprite.overlaps(this.displayLayer1);
      // playerSprite.overlaps(this.displayLayer2);
      playerSprite.overlaps(this.displayLayer3);
      playerSprite.collides(this.displayLayer4);
      // playerSprite.collides(this.displayLayer5);
      // this.displayLayer0.overlaps(allSprites);
      // this.displayLayer0.overlaps(null)
      // this.displayLayer1.overlaps(allSprites);
      // this.displayLayer2.overlaps(allSprites);
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(null);
      // this.displayLayer5.overlaps(null);
    } else if (playerZ == 3){
      // playerSprite.collides(this.displayLayer0);
      playerSprite.collides(this.displayLayer1);
      playerSprite.overlaps(this.displayLayer2);
      // playerSprite.overlaps(this.displayLayer3);
      playerSprite.overlaps(this.displayLayer4);
      playerSprite.collides(this.displayLayer5);

      // this.displayLayer0.overlaps(null);
      // this.displayLayer1.overlaps(null);
      // this.displayLayer2.overlaps(allSprites);
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(null);
    } else if (playerZ == 4){
      // playerSprite.collides(this.displayLayer0);
      // playerSprite.collides(this.displayLayer1);
      playerSprite.collides(this.displayLayer2);
      playerSprite.overlaps(this.displayLayer3);
      // playerSprite.overlaps(this.displayLayer4);
      playerSprite.overlaps(this.displayLayer5);
      // this.displayLayer0.overlaps(null);
      // this.displayLayer1.overlaps(null);
      // this.displayLayer2.overlaps(null);
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(allSprites);
    } else if (playerZ == 5){
      // playerSprite.collides(this.displayLayer0);
      // playerSprite.collides(this.displayLayer1);
      // playerSprite.collides(this.displayLayer2);
      playerSprite.collides(this.displayLayer3);
      // playerSprite.overlaps(this.displayLayer4);
      // playerSprite.overlaps(this.displayLayer5);
      // this.displayLayer0.overlaps(null);
      // this.displayLayer1.overlaps(null);
      // this.displayLayer2.overlaps(null);
      // this.displayLayer3.overlaps(null);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(allSprites);
    
    }


  }
  

  addTower(tower){
    let towersprite = new this.towers.Sprite();
    // this.towers.push(tower);
    // translate into isometric
    let towerx = (tower.x - tower.y) * this.TILE_WIDTH / 2 + this.xstart;
    let towery = (tower.x + tower.y) * this.TILE_HEIGHT / 2 - max(0, (tower.z - 2)) * this.TILE_HEIGHT / 2 + this.ystart;
    towersprite.pos = createVector(towerx, towery);
    towersprite.rotation = 0;

    let towerfrog;
    if (tower.type == 0){
      towerfrog = new this.type0towerfrogs.Sprite();
    } else if (tower.type == 1){
      towerfrog = new this.type1towerfrogs.Sprite();
    } else if (tower.type == 2){
      towerfrog = new this.type2towerfrogs.Sprite();
    } else if (tower.type == 3){
      towerfrog = new this.type3towerfrogs.Sprite();
    } else if (tower.type == 4){
      towerfrog = new this.type4towerfrogs.Sprite();
    } else if (tower.type == 5){
      towerfrog = new this.type5towerfrogs.Sprite();
    } else {
      towerfrog = new this.type0towerfrogs.Sprite();
    }
    towerfrog.pos = createVector(towerx, towery - this.TILE_HEIGHT * 1.5);
    towerfrog.rotation = 0;
    towerfrog.scale = 1;
    towerfrog.changeAni('idle');  
    this.towerfrogarr.push({frog: towerfrog, id: tower.id});

    let charginganimation = new this.charginganim.Sprite();
    charginganimation.pos = createVector(towersprite.pos.x, towersprite.pos.y);
    charginganimation.width = this.TILE_WIDTH;
    charginganimation.height = this.TILE_HEIGHT * 2;
    charginganimation.scale = {x: 1/2.5, y: 1/2.5};
    charginganimation.changeAni('inactive');
    const initialframe = frameCount;
    charginganimation.draw = () => {


      if (tower.active == true){
      // add an oscillating base to the tower based on framecount and sine
        let freq = 4;
        let angularfreq = 2 * PI * freq;
        let amplitude = 10;
        let oscillation = amplitude * sin(angularfreq * frameCount * 1.2) + 50;
        fill(0, 0, 255, 150);
        ellipse(0, 30, oscillation, oscillation / 2);
        //mimic a beam of light that grows brighter
        let diff = frameCount - initialframe;
        

        this.drawLightColumn(0, 33, 20, 250, diff)
      }

      charginganimation.ani.draw(0,0,0, charginganimation.scale.x, charginganimation.scale.y);
    }
    this.chargingarr.push({animation: charginganimation, id : tower.id});

    // towersprite.width = this.TILE_WIDTH;
    // towersprite.height = this.TILE_HEIGHT * 3;

    //scale? 
    // towersprite.draw = () => {
    //   fill(255, 0, 0);
    //   rect(0, 0, this.TILE_WIDTH, this.TILE_HEIGHT * 3);
    //   text(tower.type, 0, 0);
    // }
    console.log(towersprite.pos.x, towersprite.pos.y)
    this.towerarr.push(towersprite);
    this.towerobjarr.push(tower);
    this.towerprevcountdowns.push(tower.activecountdown);
    // this.chargingarr.push(null);
  }

  toggleTower(index, team){
    let tower = this.towerobjarr[index];
    if (tower.active == false){
      socket.emit('activateTower', index);
    } else if (tower.linkedtowerid != null && tower.team != team){
      socket.emit('deactivateTower', index);
    } else if (tower.linkedtowerid != null && tower.team == team && tower.comboavailable == true){
      // socket.emit('deactivateTower', index);
    
    } // need to add else if for shooting tower
  }

  checkIfPlayerIsNearTower(player){ //iterates through all towers
    if (mapBuilt == true){
      for (let i = 0; i < this.towerobjarr.length; i++){
        let tower = this.towerobjarr[i];
        let playerx = player.pos.x;
        let playery = player.pos.y;

        let padding = 3;
        // let startx = ();
        let x = (tower.x - tower.y) * this.TILE_WIDTH / 2 + this.xstart - padding * this.TILE_WIDTH;
        let y = (tower.x + tower.y) * this.TILE_HEIGHT / 2  + this.ystart - padding * this.TILE_HEIGHT / 2;
        let w = this.TILE_WIDTH + padding * this.TILE_WIDTH; //tile width is tower width
        let h = this.TILE_HEIGHT * 2 + padding * this.TILE_HEIGHT; //tile height is tower height
        // let x = (mapOverlayArea.x - areaPadding) * this.mapCellSize + this.mapX;- tower.z * this.TILE_HEIGHT / 2
        // let y = (mapOverlayArea.y - areaPadding) * this.mapCellSize + this.mapY;
        // let w = (mapOverlayArea.w + areaPadding * 2) * this.mapCellSize;
        // let h = (mapOverlayArea.h + areaPadding * 2) * this.mapCellSize;
        // console.log(tower, i)
        if (playerx > x && playerx < x + w && playery > y && playery < y + h) {
          console.log('player near tower', i)
            return i;
        }
        

      }
      return false;


          // let tower = this.towerobjarr[index];
          // let playerx = player.pos.x;
          // let playery = player.pos.y;
          // let towerx = this.towerarr[index].pos.x;
          // let towery = this.towerarr[index].pos.y;
          // let distance = dist(playerx, playery, towerx, towery);
          // if (distance < 50){
          //   return true;
          // } else {
          //   return false;
          // }
    }

    
  }

  updateTowers(towers){ //use?
    for (let i = 0; i < this.towerarr.length; i++) {
      if (this.towerarr[i] != null) {
          this.towerarr[i].remove();
      }
  }
    this.towerarr = [];
    this.towerobjarr = [];
    this.towerprevcountdowns = [];
    this.chargingarr = [];

    // Spawn coins on the map
    for (let i = 0; i < towers.length; i++) {
        // We know which tile the coin is on
        let tower = towers[i];
        this.addTower(tower)
        this.updateTower(tower.id, tower);
    }
  }

  removeTower(id){
    let index = this.towerobjarr.findIndex(tower => tower.id == id);
    if (index < 0){
      return;
    }
    console.log(index, 'removing index', id, 'id')
    if (this.towerobjarr[index].linkedtowerid != null){
      let linkedtower = this.towerobjarr.find(tower => tower.id == this.towerobjarr[index].linkedtowerid);
      this.updateTower(this.towerobjarr[index].linkedtowerid, linkedtower);
      linkedtower.linkedtowerid = null;
    }
    let explosion = new this.explosions.Sprite();
    explosion.pos = createVector(this.towerarr[index].pos.x, this.towerarr[index].pos.y);
    explosion.anis.scale = 2.5;
    explosion.scale = {x: 2.5, y: 2.5};
    setTimeout(() => {
      let index = this.towerobjarr.findIndex(tower => tower.id == id);
      this.towerarr[index].remove();
      this.towerarr.splice(index, 1);
      this.towerobjarr.splice(index, 1);
      this.towerprevcountdowns.splice(index, 1);
      // explosion.remove();
    }, 300);
    setTimeout(() => {
      explosion.remove();
    }, 1000);
    let chargingindex = this.chargingarr.findIndex(animation => animation.id == id);
    if (this.chargingarr[chargingindex] != null && chargingindex >= 0){
      this.chargingarr[chargingindex].animation.remove();
      this.chargingarr.splice(chargingindex, 1);
    }
    let frogindex = this.towerfrogarr.findIndex(frog => frog.id == id);
    if (this.towerfrogarr[frogindex] != null && frogindex >= 0){
      this.towerfrogarr[frogindex].frog.changeAni('explode');
      // console.log('frogarr', this.towerfrogarr[frogindex].frog, 'frog')
      setTimeout(() => {
        frogindex = this.towerfrogarr.findIndex(frog => frog.id == id);
        this.towerfrogarr[frogindex].frog.remove();
        this.towerfrogarr.splice(frogindex, 1);

      }, 1000);
    }
    // this.towerarr.splice(index, 1);
    // this.towerobjarr.splice(index, 1);
    // this.towerprevcountdowns.splice(index, 1);
    // let animationindex = this.chargingarr.findIndex(animation => animation.id == id);
    
    
    console.log('removed tower', index)
  }
  scanForUpdatedCountdowns(){
    for (let i = 0; i < this.towerobjarr.length; i++){
        console.log(this.towerobjarr[i].activecountdown, this.towerprevcountdowns[i], 'countdowns')
        //what if the obj is immediately deleted after active is false?
        if (this.towerprevcountdowns[i] == -1){
          if (this.towerobjarr[i].activecountdown > 0){
            let id = this.towerobjarr[i].id;
            setInterval(() => {
              let index = this.towerobjarr.findIndex(tower => tower.id == id);
              if (index < 0){
                clearInterval();
              } else {
                if (this.towerobjarr[index].activecountdown > 0){
                  this.towerobjarr[index].activecountdown -= 1;
                  console.log(this.towerobjarr[index].activecountdown, 'countdown')
                } else {
                  this.towerobjarr[index].activecountdown = -1;
                  if (this.towerobjarr[index].charginganimation != null){
                    // this.towerobjarr[index].charginganimation.remove();
                    // this.towerobjarr[index].charginganimation = null;
                  }
                  // this.towerobjarr[index].charginganimation.remove();
                  // this.towerobjarr[index].charginganimation = null;
                  clearInterval();

                }
              }
              
              // this.towerobjarr[i].activecountdown -= 1;
            }, 1000);
          }
        }
        this.towerprevcountdowns[i] = this.towerobjarr[i].activecountdown;
      
    }
  }

  toggleFrogFacing(playerSprite){
    for (let i = 0; i < this.towerfrogarr.length; i++){
      let towerfrog = this.towerfrogarr[i].frog;
      let tower = this.towerobjarr[i];
      let playerx = playerSprite.pos.x;
      let playery = playerSprite.pos.y;
      let towerx = towerfrog.pos.x;
      let towery = towerfrog.pos.y;
      let distance = dist(playerx, playery, towerx, towery);
      // console.log(distance, 'distance')
      if (distance < 200){
        if (towerfrog.ani.name == 'idle'){
          console.log('changing to jump')
          towerfrog.changeAni('jump');
        } 
      } else if (towerfrog.ani.name == 'jump'){
        towerfrog.changeAni('idle');
      }
      //check if player is to left or right of frog
      if (playerx < towerx){
        towerfrog.scale.x = -1;
        // console.log('left', towerfrog.ani)
      } else {
        towerfrog.scale.x = 1;
      }
    }
  }

  updateTower(id, tower){
    // let tower = tower;
    let index = this.towerobjarr.findIndex(tower => tower.id == id);
    let towersprite = this.towerarr[index];
    // const chargeanimation = this.towerobjarr[index].charginganimation;
    // console.log(chargeanimation, 'chargeanimation')
    this.towerobjarr[index] = tower;

    // this.towerobjarr[index].chargeanimation = chargeanimation;

    console.log(tower.activecountdown, 'countdown')
    this.scanForUpdatedCountdowns();
    // this.towerprevcountdowns[index] = tower.activecountdown;
    //change draw function and add teams
    console.log('animationcharge', this.chargingarr.animation, 'charging animation')
    if (tower.active){
      let linkedtower = this.towerobjarr.find(tower => tower.id == tower.linkedtowerid);
      // shoot bullet sprites at each other

      // console.log('active', this.towerobjarr[index].charginganimation, 'charging animation')
      if (tower.chargingindicator == 1){
        console.log('generating charging animation')
        let frogindex = this.towerfrogarr.findIndex(frog => frog.id == tower.id);
        if (this.towerfrogarr[frogindex] != null && frogindex >= 0){
          this.towerfrogarr[frogindex].frog.changeAni('attack');
        }
        // generates charging tower sprite
        // let charginganimation = new this.charginganim.Sprite();
        // charginganimation.pos = createVector(towersprite.pos.x, towersprite.pos.y);
        // charginganimation.width = this.TILE_WIDTH;
        // charginganimation.height = this.TILE_HEIGHT * 2;
        // charginganimation.scale = {x: 1/2.5, y: 1/2.5};
        let charginganimation = this.chargingarr.find(animation => animation.id == tower.id).animation;
        if (charginganimation != null){
          charginganimation.changeAni('idle');
          const initialframe = frameCount;
          charginganimation.draw = () => {
            // add an oscillating base to the tower based on framecount and sine
            let freq = 4;
            let angularfreq = 2 * PI * freq;
            let amplitude = 10;
            let oscillation = amplitude * sin(angularfreq * frameCount * 1.2) + 50;
            fill(0, 0, 255, 150);
            ellipse(0, 30, oscillation, oscillation / 2);
            //mimic a beam of light that grows brighter
            let diff = frameCount - initialframe;

            this.drawLightColumn(0, 33, 20, 250, diff)

            charginganimation.ani.draw(0,0,0, charginganimation.scale.x, charginganimation.scale.y);
          }
          this.chargingarr.push({animation: charginganimation, id : tower.id});
          // this.towerobjarr[index].charginganimation = charginganimation;
        }
      }

      // towersprite.draw = () => {
      //   image(tower.img, 0, 0, this.TILE_WIDTH, this.TILE_HEIGHT * 3);
      // }
    } else {
      // console.log('removing charging animation', this.chargingarr[index], 'charging animation')
      if (tower.chargingindicator == 0){
        console.log('removing charging animation')
        // this.towerobjarr[index].charginganimation.remove();
        let animindex = this.chargingarr.findIndex(animation => animation.id == tower.id);
        if (this.chargingarr[animindex] != null && animindex >= 0  && this.chargingarr[animindex].animation != null){
          let anim = this.chargingarr[animindex].animation;
          anim.changeAni('inactive');
          anim.draw = () => {
            anim.ani.draw(0,0,0, anim.scale.x, anim.scale.y);
          }
          // this.chargingarr[animindex].animation.changeAni('inactive');
          //  this.chargingarr[animindex].animation.draw = () => {
          //   this.chargingarr[animindex].animation.ani.draw(0,0,0, this.chargingarr[animindex].animation.scale.x, this.chargingarr[animindex].animation.scale.y);
          // }
        }
        // this.chargingarr[animindex].animation.remove();
        // this.chargingarr.splice(animindex, 1);

        let frogindex = this.towerfrogarr.findIndex(frog => frog.id == tower.id);
        if (this.towerfrogarr[frogindex] != null && frogindex >= 0){
          this.towerfrogarr[frogindex].frog.changeAni('idle');
        }
        // this.chargingarr[animindex] = null;
        // if (this.chargingarr[index] != null){
          
        // }
      }
      // towersprite.draw = () => {
      //   image(tower.img, 0, 0, this.TILE_WIDTH, this.TILE_HEIGHT * 3);
      // }
    }
    

  }

  drawLightColumn(x, y, width, maxHeight, diff) {
    function map(value, start1, stop1, start2, stop2) {
      return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }
    let currentHeight = map(diff, 0, 80, 0, maxHeight);
    let intensity = map(diff, 0, 80, 0, 210);
    // console.log(currentHeight, intensity, 'current height and intensity', diff, 'diff')
    
    if (currentHeight > maxHeight) {
      currentHeight = maxHeight;
    }
    if (intensity > 255) {
      intensity = 255;
    }
    strokeWeight(0);
    for (let i = currentHeight; i >0 ; i -=2) {      
      let alpha = map(i, 0, currentHeight, intensity, 0);
      fill(255, 255, 0, alpha); // Light yellow color
      rect(x, -i + y, width, 2);
    }
  }
  updateHealth(health){
    // takes in arr of healths
    for (let i = 0; i < this.basehealths.length; i++){
      this.basehealths[i] = health[i];
    }
    // add UI for health
  }

  preGenerateTower(x, y, z){
    let towersprite = new this.pretowers.Sprite();
    let towerx = (x - y) * this.TILE_WIDTH / 2 + this.xstart;
    let towery = (x + y) * this.TILE_HEIGHT / 2 - z * this.TILE_HEIGHT / 2 + this.ystart;
    towersprite.pos = createVector(towerx, towery);
    towersprite.rotation = 0;
    towersprite.width = this.TILE_WIDTH;
    towersprite.height = this.TILE_HEIGHT;
    this.pretowerarr.push(towersprite);
    setTimeout(() => {
      towersprite.remove();
      this.pretowerarr.splice(this.pretowerarr.indexOf(towersprite), 1);
    }, 5000);
  }
    //scale?



  getDisplayTile(x, y){
    return this.displayMapTiles[x * this.numCols + y];
  }


  random(min, max) {
        let rand;

        rand = Math.random();

        if (typeof min === 'undefined') {
            return rand;
        } else if (typeof max === 'undefined') {
            if (Array.isArray(min)) {
                return min[Math.floor(rand * min.length)];
            } else {
                return rand * min;
            }
        } else {
            if (min > max) {
                const tmp = min;
                min = max;
                max = tmp;
            }

            return rand * (max - min) + min;
        }
    };
  draw_tile(img, x, y, z, graphics, X_start, Y_start) { // out of use
    let X_screen = X_start + (x - y) * this.TILE_WIDTH/2;
    let Y_screen = Y_start + (x + y) * this.TILE_HEIGHT/2 - z * this.TILE_HEIGHT/2;
    graphics.image(img, X_screen, Y_screen);
  }
  draw_grid(camx, camy, graphic = this.graphics) { // out of use
    let graphics = createGraphics(this.truewidth, this.trueheight);
    let offsetx = camx - this.truewidth / 2;
    let offsety = camy - this.trueheight / 2; //scaling needs to be dealt with
    let X_start = this.truewidth/2 - this.TILE_WIDTH/2 //+ offsetx;
    let Y_start = this.trueheight/2 - this.GRID_SIZE * this.TILE_HEIGHT/2 //+ offsety;
    //i is x
    for (let i = 0; i < this.GRID_SIZE; i++) {
      let y = 0;
      let x = 0;
      //we assume square grid
      // when i = 0, y can only be 0
      // when i = 1, y can be 0 or 1
      // when i = 2, y can be 0, 1, or 2
      while (i >= y) {
        let image;
        if (this.gridarray[y][i] == "_"){
          image = this.tile_images[66];
        } else if (this.gridarray[y][i] == "2"){
          image = this.tile_images[65];
        } else if (this.gridarray[y][i] == "1"){
          image = this.tile_images[67];
        } else if (this.gridarray[y][i] == "2"){
          image = this.tile_images[68];
        } else if (this.gridarray[y][i] == "4") {
          image = this.tile_images[69]; 
        }
        // console.log(this.grid.get(i + "_" + y).z)
        this.draw_tile(image, i, y, this.grid.get(i + "_" + y).z, graphics, X_start, Y_start);
        y++;
      }
      while (i >= x) {
        let image;
        if (this.gridarray[i][x] == "_"){
          image = this.tile_images[66];
        } else if (this.gridarray[i][x] == "2"){
          image = this.tile_images[65];
        } else if (this.gridarray[i][x] == "1"){
          image = this.tile_images[67];
        } else if (this.gridarray[i][x] == "2"){
          image = this.tile_images[68];
        } else if (this.gridarray[i][x] == "4") {
          image = this.tile_images[69]; 
        }
        this.draw_tile(image, x, i, this.grid.get(x + "_" + i).z, graphics, X_start, Y_start);
        x++;
      }

      // for (let j = 0; j < GRID_SIZE; j++) {
      //   draw_tile(tile_images[grid[j][i]], i, j); //sequential, use while loop now (while x > y, draw_tile, y++ )
      // }
    }
    return graphics;
  }
  displayIso(camx, camy, camscale){ // out of use and broken
    this.gridscale = camscale;
    // let newgraphics = createGraphics(windowWidth, windowHeight);
    // this.draw_grid(camx, camy, newgraphics);
    // this.graphics = newgraphics;
    // console.log(this.graphics)
    let offsetx = (camx - windowWidth / 2) * this.gridscale; //scaling needs to be dealt with
    let offsety = (camy - windowHeight / 2) * this.gridscale; //scaling needs to be dealt with
    // console.log(offsetx, offsety)
    this.graphics = this.draw_grid(camx, camy, this.graphics);
    //how to delete prev image? 
    this.xstart = (this.truewidth / 2 - this.TILE_WIDTH / 2) * this.gridscale + offsetx;
    this.ystart = (this.trueheight / 2 - this.GRID_SIZE * this.TILE_HEIGHT / 2) * this.gridscale + offsety; 
    image(this.graphics,  - 1 / 2* (this.gridscale * this.truewidth - windowWidth) + offsetx,  - 1 / 2 * (this.gridscale * this.trueheight - windowHeight) + offsety, this.truewidth * this.gridscale, this.trueheight * this.gridscale);
    // let newGraphics = createGraphics(windowWidth * this.gridscale, windowHeight * this.gridscale);
    // newGraphics.image(this.graphics,  -windowWidth / 2* (this.gridscale - 1), -windowHeight / 2 * (this.gridscale - 1), windowWidth * this.gridscale, windowHeight * this.gridscale);
    // image(this.graphics,  -windowWidth / 2* (this.gridscale - 1),  - windowHeight / 2 * (this.gridscale - 1), windowWidth * this.gridscale, windowHeight * this.gridscale);
  }
  buildIso(camx, camy){ // out of use
    this.graphics = this.draw_grid(camx, camy);
    // console.log(this.graphics)
  }

  initializeCollisions(playerZ, playerSprite){
    if (playerZ == 0){
      playerSprite.overlaps(this.displayLayer0);
      playerSprite.overlaps(this.displayLayer1);
      playerSprite.collides(this.displayLayer2);
      playerSprite.collides(this.displayLayer3);
      playerSprite.collides(this.displayLayer4);
      playerSprite.collides(this.displayLayer5);
      // this.displayLayer0.overlaps(allSprites);
      // this.displayLayer1.overlaps(allSprites);
      // this.displayLayer2.overlaps(null)
      // this.displayLayer3.overlaps(null)
      // this.displayLayer4.overlaps(null)
      // this.displayLayer5.overlaps(null)

      // this.displayLayer2.overlaps(allSprites, null);
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(allSprites);
    } else if (playerZ == 1){
      playerSprite.overlaps(this.displayLayer0);
      playerSprite.overlaps(this.displayLayer1);
      playerSprite.overlaps(this.displayLayer2);
      playerSprite.collides(this.displayLayer3);
      playerSprite.collides(this.displayLayer4);
      playerSprite.collides(this.displayLayer5);

      // this.displayLayer0.overlaps(allSprites);
      // this.displayLayer1.overlaps(allSprites);
      // this.displayLayer2.overlaps(allSprites);
      // this.displayLayer3.overlaps(null)
      // this.displayLayer4.overlaps(null)
      // this.displayLayer5.overlaps(null)
      // console.log(this.displayLayer2)
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(allSprites);
    } else if (playerZ == 2){
      playerSprite.collides(this.displayLayer0);
      playerSprite.overlaps(this.displayLayer1);
      playerSprite.overlaps(this.displayLayer2);
      playerSprite.overlaps(this.displayLayer3);
      playerSprite.collides(this.displayLayer4);
      playerSprite.collides(this.displayLayer5);
      // this.displayLayer0.overlaps(allSprites);
      // this.displayLayer0.overlaps(null)
      // this.displayLayer1.overlaps(allSprites);
      // this.displayLayer2.overlaps(allSprites);
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(null);
      // this.displayLayer5.overlaps(null);
    } else if (playerZ == 3){
      playerSprite.collides(this.displayLayer0);
      playerSprite.collides(this.displayLayer1);
      playerSprite.overlaps(this.displayLayer2);
      playerSprite.overlaps(this.displayLayer3);
      playerSprite.overlaps(this.displayLayer4);
      playerSprite.collides(this.displayLayer5);

      // this.displayLayer0.overlaps(null);
      // this.displayLayer1.overlaps(null);
      // this.displayLayer2.overlaps(allSprites);
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(null);
    } else if (playerZ == 4){
      playerSprite.collides(this.displayLayer0);
      playerSprite.collides(this.displayLayer1);
      playerSprite.collides(this.displayLayer2);
      playerSprite.overlaps(this.displayLayer3);
      playerSprite.overlaps(this.displayLayer4);
      playerSprite.overlaps(this.displayLayer5);
      // this.displayLayer0.overlaps(null);
      // this.displayLayer1.overlaps(null);
      // this.displayLayer2.overlaps(null);
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(allSprites);
    } else if (playerZ == 5){
      playerSprite.collides(this.displayLayer0);
      playerSprite.collides(this.displayLayer1);
      playerSprite.collides(this.displayLayer2);
      playerSprite.collides(this.displayLayer3);
      playerSprite.overlaps(this.displayLayer4);
      playerSprite.overlaps(this.displayLayer5);
      // this.displayLayer0.overlaps(null);
      // this.displayLayer1.overlaps(null);
      // this.displayLayer2.overlaps(null);
      // this.displayLayer3.overlaps(null);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(allSprites);
    
    }
  }




  resize(size){
    this.gridscale = size;
  }
  setPlayerPosition(servermap, player){
    // console.log(player)
    player.pos.x = this.numCols/2 * this.TILE_SIDE_LENGTH;
    player.pos.y = this.numRows/2 * this.TILE_HEIGHT;
    // finds z coordinate of player
    let x = round(player.pos.x / this.TILE_SIDE_LENGTH);
    let y = round(player.pos.y / this.TILE_HEIGHT);
    return this.grid.get(x + "_" + y).z;

  }
}

function createPlayerSprite(name) {
    let mechanicSprite = new Sprite(0, 0, 10);
    mechanicSprite.visible = false;
    return mechanicSprite;
    // mechanicSprite.visible = true;
    // mechanicSprite.collider = 'static';
    // mechanicSprite.overlaps(allSprites);

    // Load sprite sheet
    // playerSprite.spriteSheet = "./images/textures/dwarf-sprite-sheet.png";
    // playerSprite.anis.offset.y = -4;
    // playerSprite.anis.frameDelay = 2;
    // playerSprite.addAnis({
    //     idle: {row: 0, frames: 5, w: 64, h: 32},
    //     run: {row: 1, frames: 8, w: 64, h: 32},
    // });
    // playerSprite.anis.scale = 2;

    // // Manually draw the ign by overriding the draw function
    // // Taking reference from https://github.com/quinton-ashley/p5play/blob/main/p5play.js
    // playerSprite.draw = () => {
    //     fill("white");
    //     textAlign(CENTER, CENTER);
    //     textSize(16);
    //     text(name, 0, -35);

    //     playerSprite.ani.draw(playerSprite.offset.x, playerSprite.offset.y, 0, playerSprite.scale.x, playerSprite.scale.y);
    // }


    
}

function createVisiblePlayerSprite(name, playerZ) { //scaling added after animation
    let playerSprite = new Sprite(0, 0, 32, 32);
    playerSprite.visible = true;
    playerSprite.collider = 'none';
    // playerSprite.img = "./new_tileset/tile_001.png";
    playerSprite.spriteSheet = './textures/charanimap.png';
    playerSprite.anis.offset.y = -4
    playerSprite.anis.frameDelay = 2
    playerSprite.addAnis({
      idle: {row:0, frames: 6, w:128, h:128}, 
      run: {row:7, frames: 6, w:128, h:128},

    });
    playerSprite.anis.scale = 0.5;
    playerSprite.changeAni('idle');
    

    // Load sprite sheet
    // playerSprite.spriteSheet = mechanicSprite;
    // playerSprite.anis.offset.y = -4;
    // playerSprite.anis.frameDelay = 2;
    // playerSprite.addAnis({
    //     idle: {row: 0, frames: 5, w: 64, h: 32},
    //     run: {row: 1, frames: 8, w: 64, h: 32},
    // });
    // playerSprite.anis.scale = 2;

    // Manually draw the ign by overriding the draw function
    // Taking reference from
    playerSprite.draw = () => {
        
        fill("white");
        textAlign(CENTER, CENTER);
        textSize(16);
        text(name, 0, -35);
        // console.log(name)

        // circle(0, 0, 32);
        // rect(10, 0, 32, 50);
        // scaling = 1 + playerZ * 0.1;
        // console.log(playerZ, scaling)
        // image(playerSprite.img, 0, 0, 32, 16);
        // img = loadImage('./new_tileset/tile_001.png');
        // image(img, 0, 0, 32, 16);

        playerSprite.ani.draw(playerSprite.offset.x, playerSprite.offset.y, 0, playerSprite.scale.x, playerSprite.scale.y);
    }
    return playerSprite;

}




