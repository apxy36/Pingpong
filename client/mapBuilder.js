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
    this.mapBuilt = false;
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

    // for (let i = 0; i < this.numLayers ; i++){
    //   this.displayLayers[i].w = this.TILE_WIDTH; // Width of each brick
    //   this.displayLayers[i].h = this.TILE_HEIGHT; // Height of each brick
    //   if (i != this.numLayers - 1){
    //     this.displayLayers[i].tile = toString(i);
    //   } else {
    //     this.displayLayers[i].tile = "B";
    //   }
    //   this.displayLayers[i].collider = 'static';
    //   if (i == 0 || i == 1){
    //     this.displayLayers[i].overlaps(allSprites);
    //   }
    //   // this.displayLayers[i].overlaps(allSprites);
    //   this.displayLayers[i].layer = (i - 1)*999;
    //   if (i == 0){
    //     this.displayLayers[i].img = './new_tileset/tile_066.png';
    //   } else if (i == this.numLayers - 1){
    //     this.displayLayers[i].img = './new_tileset/tile_071.png'; //boundary
    //   } else {
    //     this.displayLayers[i].visible = false;
    //   // this.displayLayers[i].img = "./textures/wall.png";
    //   }
    // }

    this.displayLayer0.w = this.TILE_WIDTH; // Width of each brick
    this.displayLayer0.h = this.TILE_HEIGHT; // Height of each brick
    this.displayLayer0.tile = "0";
    this.displayLayer0.collider = 'static';
    this.displayLayer0.overlaps(allSprites);
    this.displayLayer0.layer = -990;
    this.displayLayer0.img = './new_tileset/tile_066.png';

    this.displayLayer1.w = this.TILE_WIDTH;
    this.displayLayer1.h = this.TILE_HEIGHT
    this.displayLayer1.tile = "1";
    this.displayLayer1.collider = 'static';
    this.displayLayer1.overlaps(allSprites);
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

    this.displayElevatedTileLayer1.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer1.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer1.collider = 'static';
    this.displayElevatedTileLayer1.overlaps(allSprites);
    this.displayElevatedTileLayer1.layer = 0*999;
    this.displayElevatedTileLayer1.img = './new_tileset/tile_027.png';

    this.displayElevatedTileLayer2.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer2.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer2.collider = 'static';
    this.displayElevatedTileLayer2.overlaps(allSprites);
    this.displayElevatedTileLayer2.layer = 1*999;
    this.displayElevatedTileLayer2.img = './new_tileset/tile_027.png';

    this.displayElevatedTileLayer3.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer3.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer3.collider = 'static';
    this.displayElevatedTileLayer3.overlaps(allSprites);
    this.displayElevatedTileLayer3.layer = 2*999;
    this.displayElevatedTileLayer3.img = './new_tileset/tile_027.png';

    this.displayElevatedTileLayer4.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer4.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer4.collider = 'static';
    this.displayElevatedTileLayer4.overlaps(allSprites);
    this.displayElevatedTileLayer4.layer = 3*999;
    this.displayElevatedTileLayer4.img = './new_tileset/tile_027.png';

    this.displayElevatedTileLayer5.w = this.TILE_WIDTH;
    this.displayElevatedTileLayer5.h = this.TILE_HEIGHT;
    this.displayElevatedTileLayer5.collider = 'static';
    this.displayElevatedTileLayer5.overlaps(allSprites);
    this.displayElevatedTileLayer5.layer = 4*999;
    this.displayElevatedTileLayer5.img = './new_tileset/tile_027.png';

    this.displayElevatedBoundaryLayer.w = this.TILE_WIDTH;
    this.displayElevatedBoundaryLayer.h = this.TILE_HEIGHT;
    this.displayElevatedBoundaryLayer.collider = 'static';
    this.displayElevatedBoundaryLayer.overlaps(allSprites);
    this.displayElevatedBoundaryLayer.layer = 5*999;
    this.displayElevatedBoundaryLayer.img = './new_tileset/tile_027.png';



    this.displayMapTiles = new Tiles(this.isoarray, // 2D array of tiles
        0, // x to centralise map
        0, // y to position at top
        this.TILE_WIDTH / 2,
        this.TILE_HEIGHT / 2);
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
      if (z != 0){
        // tile.pos.y -= z * this.TILE_HEIGHT / 2;
        // console.log(z, vect.x, vect.y)
        // let newtile = new this.displayLayer0.Sprite();
        // newtile.pos = createVector(tile.pos.x, tile.pos.y);
        // + z * this.TILE_HEIGHT / 2; //make an entirely new tile that displays another image but has no collision, at the elevated pos. the original tile is at the original pos
        
        let displayTile;
        // if (z != 'B'){
        //   displayTile = new this.displayElevatedTileLayers[z - 1].Sprite();
        // } else {
        //   displayTile = new this.displayElevatedBoundaryLayer.Sprite();
        // } else {
        //   displayTile = new this.displayElevatedTileLayer1.Sprite();
        // }
        if (z == 1){
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
          displayTile = new this.displayElevatedBoundaryLayer.Sprite();
        } else {
          displayTile = new this.displayElevatedTileLayer1.Sprite();
        }
        displayTile.pos.x = tile.pos.x;
        if (z != 'B'){
        displayTile.pos.y = tile.pos.y - z * this.TILE_HEIGHT / 2;
        } else {
          displayTile.pos.y = tile.pos.y - 10 * this.TILE_HEIGHT / 2;
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
  }

  toggleOverlappingLayers(layernum){
    if (layernum == 0){
      this.displayLayer0.overlaps(allSprites);
      this.displayLayer1.overlaps(null);
      this.displayLayer2.overlaps(null);
      this.displayLayer3.overlaps(null);
      this.displayLayer4.overlaps(null);
      this.displayLayer5.overlaps(null);
    }
  }

  updateCollisionLayers(playerZ){ // reconfig to make it player based? ie playersprite.overlaps(displayLayer0)
    // for (let i = -1; i < 1; i++){
    //   let index = min(max(playerZ + i, 0), this.numLayers - 2);
    //   this.displayLayers[index].overlaps(allSprites);
    // }

    if (playerZ == 0){

      this.displayLayer0.overlaps(allSprites);
      this.displayLayer1.overlaps(allSprites);
      // this.displayLayer2.overlaps(null)
      // this.displayLayer3.overlaps(null)
      // this.displayLayer4.overlaps(null)
      // this.displayLayer5.overlaps(null)

      this.displayLayer2.overlaps(allSprites, null);
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(allSprites);
    } else if (playerZ == 1){
      this.displayLayer0.overlaps(allSprites);
      this.displayLayer1.overlaps(allSprites);
      this.displayLayer2.overlaps(allSprites);
      // this.displayLayer3.overlaps(null)
      // this.displayLayer4.overlaps(null)
      // this.displayLayer5.overlaps(null)
      // console.log(this.displayLayer2)
      // this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(allSprites);
    } else if (playerZ == 2){
      // this.displayLayer0.overlaps(allSprites);
      // this.displayLayer0.overlaps(null)
      this.displayLayer1.overlaps(allSprites);
      this.displayLayer2.overlaps(allSprites);
      this.displayLayer3.overlaps(allSprites);
      // this.displayLayer4.overlaps(null);
      // this.displayLayer5.overlaps(null);
    } else if (playerZ == 3){
      // this.displayLayer0.overlaps(null);
      // this.displayLayer1.overlaps(null);
      this.displayLayer2.overlaps(allSprites);
      this.displayLayer3.overlaps(allSprites);
      this.displayLayer4.overlaps(allSprites);
      // this.displayLayer5.overlaps(null);
    } else if (playerZ == 4){
      // this.displayLayer0.overlaps(null);
      // this.displayLayer1.overlaps(null);
      // this.displayLayer2.overlaps(null);
      this.displayLayer3.overlaps(allSprites);
      this.displayLayer4.overlaps(allSprites);
      this.displayLayer5.overlaps(allSprites);
    } else if (playerZ == 5){
      // this.displayLayer0.overlaps(null);
      // this.displayLayer1.overlaps(null);
      // this.displayLayer2.overlaps(null);
      // this.displayLayer3.overlaps(null);
      this.displayLayer4.overlaps(allSprites);
      this.displayLayer5.overlaps(allSprites);
    
    }


  }


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

function createVisiblePlayerSprite(mechanicSprite, name, map) {
    let playerSprite = new Sprite(0, 0, 32, 32);
    playerSprite.visible = true;
    playerSprite.collider = 'none';
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

        circle(0, 0, 32);
        rect(10, 0, 32, 50);

        // playerSprite.ani.draw(playerSprite.offset.x, playerSprite.offset.y, 0, playerSprite.scale.x, playerSprite.scale.y);
    }
    return playerSprite;

}