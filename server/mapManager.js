export default class MapManager{
    constructor(roomcode){
        this.grid = [];

        this.roomCode = roomcode;
        let w = 52;
        let h = 52;
        let cellSize = 32;
        this.width = w;
        this.GRID_SIZE = w;
        this.height = h;
        this.cellSize = 32;
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
        this.grid = this.generateRandomMap()
        this.gridarr = this.convertMapToArray(this.grid)

        this.towers = []
        this.maxtowerid = 0;

        this.teamhealth = [100, 100];
        this.teamdamage = [15, 15];
        this.prevtime = 0;
        // console.log(this.gridarr)
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

  convertMapToArray(map){
    let arr = []
    for (let x = 0; x < this.GRID_SIZE; x++) {
      let arr1 = []
      for (let y = 0; y < this.GRID_SIZE; y++) {
        let tile = map.get(`${x}_${y}`);
        arr1.push(tile);
      }
      arr.push(arr1);
    }
    return arr;
  }
  checkIfTowersWithinProximityofotherTowers(x, y){
    for (let i = 0; i < this.towers.length; i++){
      let dist = Math.sqrt((this.towers[i].x - x)**2 + (this.towers[i].y - y)**2);
      if (dist < 14){
        return true;
      }
    }
    return false;
  }

  checkWinCondition(){
    let teamwon = -1;
    if (this.teamhealth[0] < this.teamhealth[1]){
      teamwon = 1;
    } else if (this.teamhealth[1] < this.teamhealth[0]){
      teamwon = 0;
    } else {
      teamwon = -1;
    }
    return teamwon;
  }

  updateMap(tileIndex, tileChar) {
    // Find which char in this.mapTiles to update
    // double check this works
    let rowNum = Math.floor((tileIndex + 1) / this.numCols);
    let colNum = (tileIndex + 1) - (rowNum) * this.numCols;

    let newRow = "";
    for (let i = 0; i < this.numCols; i++) {
        if (i != colNum - 1) {
            newRow += this.mapTiles[rowNum][i];
        }
        else {
            newRow += tileChar;
        }
    }

    this.mapTiles[rowNum] = newRow;
}
  generateTower(x, y, type){
    let z = this.grid.get(`${x}_${y}`).z;
    if (z == "B"){
      z = 2;
    }
    let id = this.maxtowerid;
    let tower = new Tower(x, y, z, type, id);
    this.towers.push(tower);
    this.maxtowerid += 1;
    return tower;
  }
  activateTower(id, team, clients){
    
    if (this.towers.length >= 2){
      let tower = this.towers.find(tower => tower.id == id);
      let index = this.towers.findIndex(towers => towers.id == id);
      if (tower.active == false && tower.linkedtowerid == null){
        tower.active = true;
        tower.team = team;
        tower.activecountdown = 10;
        tower.chargingindicator = 1;
        while (tower.linkedtowerid == null){
          let randindex = Math.round(this.random(0, this.towers.length - 1));
          if (this.towers[randindex].linkedtowerid == null && randindex != index){
            tower.linkedtowerid = this.towers[randindex].id // this.towers[randindex];
          }
          
        }
        let linkedtower = this.towers.find(towers => towers.id == tower.linkedtowerid);
        linkedtower.active = true;
        linkedtower.comboavailable = true;
        linkedtower.team = team;
        linkedtower.activecountdown = 10;
        linkedtower.linkedtowerid = id;
        linkedtower.chargingindicator = 1;
        // tower.linkedtower.active = true;

        // this.towers[tower.linkedtowerindex].active = true;
        // this.towers[tower.linkedtowerindex].team = team;
        // this.towers[tower.linkedtowerindex].activecountdown = 10;
        // this.towers[tower.linkedtowerindex].linkedtowerindex = index;
        // tower.linkedtower.active = true;
        // tower.linkedtower.activecountdown = 15;
        // tower.linkedtower.team = team;
        // tower.linkedtower.linkedtowerindex = tower;
        
        let counter = setInterval(() => {
          if (tower.activecountdown <= 0){
            // console.log(tower, index, 'deactivated')
            clearInterval(counter);
            this.deactivateTower(tower.linkedtowerid, team, clients);
            this.deactivateTower(id, team, clients);
            
            // clearTimeout(countdown);
            // tower.active = false;
            // this.towers[tower.linkedtowerindex].active = false;
            // // tower.linkedtower.active = false;
            // tower.team = null;
            // this.towers[tower.linkedtowerindex].team = null;
            // // tower.linkedtower.team = null;

            // tower.activecountdown = -1;
            // this.towers[tower.linkedtowerindex].activecountdown = -1;
            // // tower.linkedtower.activecountdown = -1;
            // this.towers[tower.linkedtowerindex].linkedtowerindex = null;
            // // tower.linkedtower.linkedtowerindex = null;
            
            // tower.linkedtowerindex = null;
          } else {
            console.log(tower.activecountdown, id, tower, 'tower')
            if (tower.active){
              tower.activecountdown -= 1;
              linkedtower.activecountdown -= 1;
            }
            // tower.linkedtower.activecountdown -= 1;
          }
          // tower.activecountdown -= 1;
          // tower.linkedtower.activecountdown -= 1;
        }
        , 1000);
      }
    }
    // countdown = setTimeout(() => {
    //   tower.active = false;
    //   tower.activecountdown = -1;
    //   tower.linkedtower.active = false;
    //   tower.linkedtower.activecountdown = -1;
    // }
    // , tower.activecountdown * 1000);
    

  }

  

  deactivateTower(id, team, clients){
    if (id == null){
      return;
    }
    let tower = this.towers.find(tower => tower.id == id);
    console.log(tower, id, 'deactivated')
    tower.active = false;
    tower.team = null;
    tower.activecountdown = -1;
    tower.chargingindicator = 0;
    tower.comboavailable = false;
    if (tower.linkedtowerid != null){
      let linkedtower = this.towers.find(towers => towers.id == tower.linkedtowerid);
      linkedtower.active = false;
      linkedtower.team = null;
      linkedtower.activecountdown = -1;
      linkedtower.linkedtowerid = null;
      linkedtower.chargingindicator = 0;
      linkedtower.comboavailable = false;
    }
    tower.linkedtowerid = null;
    for (let c of clients){
      c.socket.emit('updateTower', id, tower, team);
      if (tower.linkedtowerid != null){
        let linkedtower = this.towers.find(towers => towers.id == tower.linkedtowerid);
        c.socket.emit('updateTower', tower.linkedtowerid, linkedtower, team);
      }
    }
    
    // tower.linkedtower.active = false;
    // tower.linkedtower.activecountdown = -1;
    // tower.linkedtower.team = null;
    // tower.linkedtower.linkedtowerindex = null;
    // tower.linkedtowerindex = null;
  }

  

  removeTower(id){
    let index = this.towers.findIndex(tower => tower.id == id); 
    this.towers.splice(index, 1);
  }
  removeTowerByIndex(index){
    // let toweranim = this.towers[index].charginganimation.animation;
    // if (toweranim != null){
    //   toweranim.remove();
    //   // for (let c of clients){
    //   //   c.socket.emit('removeTower', this.towers[index].id);
    //   // }
    // }
    this.towers.splice(index, 1);
  }
  checkIfAnyTowerIsActivated(){
    for (let i = 0; i < this.towers.length; i++){
      if (this.towers[i].active){
        return true;
      }
    }
    return false;
  }

  updateTowers(clients){ // handling tower duration and spawning of new towers

    for (let i = 0; i < this.towers.length; i++){
        if (!this.towers[i].activecountdown > 0 && this.towers[i].active == false){
          this.towers[i].duration += 1;
        } else if (this.towers[i].duration > 18){
          this.towers[i].duration = 10;
        }
      //  console.log(this.towers[i].duration)
        if (this.towers[i].duration > 20 && this.towers[i].active == false && this.towers[i].linkedtowerid == null && !this.checkIfAnyTowerIsActivated()){ 
          let towerid = this.towers[i].id;
          for (let c of clients){
            c.socket.emit('removeTower', towerid);
          }
          this.removeTowerByIndex(i, clients);
          console.log("tower removed", i);
        }
      
    }
    //handle spawning of new towers
    //random chance of spawning a new tower
    let rand = Math.random();
    if (rand < 0.5){
      if (this.towers.length < 9){
        let randx = Math.floor(Math.random() * this.GRID_SIZE);
        let randy = Math.floor(Math.random() * this.GRID_SIZE);
        // let randtype = Math.round(Math.random() * 3);
        let randtype = 1;
        let z = this.grid.get(`${randx}_${randy}`).z;
        if (!this.checkIfTowersWithinProximityofotherTowers(randx, randy)){
        for (let c of clients){
          c.socket.emit('preGenerateTower', randx, randy, z);
        }
        console.log('preGenerateTower', randx, randy, z);
        setTimeout(() => {
          let tower = this.generateTower(randx, randy, randtype);
          // console.log(tower)
          for (let c of clients){
            // c.socket.emit('preGenerateTower', tower);
            c.socket.emit('generateTower', tower);           
            // setTimeout(() => {
            //   c.socket.emit('generateTower', tower);
            // }, 5000);
          }
          // console.log("new tower spawned", randx, randy, this.towers);
        }
        , 5000);
      }
    }
    }
    console.log(this.towers.length)
    // for (let c of clients){
    //   for (let tower of this.towers){
    //     c.socket.emit('updateTower', tower.id, tower, tower.team);
    //   }
    // }
  }
  //   if (this.towers.length < 5){
  //     let randx = Math.floor(Math.random() * this.GRID_SIZE);
  //     let randy = Math.floor(Math.random() * this.GRID_SIZE);
  //     let randtype = Math.floor(Math.random() * 5);
  //     this.generateTower(randx, randy, randtype);
  //     for (let c of clients){
  //       c.socket.emit('generateTower', randx, randy, randtype);
  //     }
    
  // }
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
  comboTower(id, team, clients){ // causes the towers to deactivate while decreasing team health
    let tower = this.towers.find(towers => towers.id == id);
    console.log(tower.linkedtowerid);
    for (let i = 0; i < this.towers.length; i++){
      console.log(this.towers[i].linkedtowerid);
    }
    let linkedtower = this.towers.find(towers => towers.id == tower.linkedtowerid);
    console.log(tower, linkedtower);
    if (tower.active && linkedtower.active){
      
      if (this.teamhealth[0] <= 0 || this.teamhealth[1] <= 0){
        for (let c of clients){
          c.socket.emit('gameOver', team);
        }
      }
      if (tower.type == 0){
      for (let c of clients){
        console.log('baseAttacking', team, linkedtower);
        c.socket.emit('baseAttacking', team, linkedtower);
      }
      
      if (team == 0){
        this.teamhealth[1] -= this.teamdamage[0];
      } else {
        this.teamhealth[0] -= this.teamdamage[1];
      }
      

      
    } else if (tower.type == 1){
        for (let c of clients){
          if (team == 0){
            c.socket.emit('speedBoost', team, linkedtower);
            if (c.team == 0){
              c.statusconditions.push('speedBoost');
              // c.socket.emit('speedBoost', team, linkedtower);
              setTimeout(() => {
                c.statusconditions.splice(c.statusconditions.indexOf('speedBoost'), 1);
              }, 20000); // 20 seconds
            }
          } else {
            c.socket.emit('speedBoost', team, linkedtower);
            if (c.team == 1){
              c.statusconditions.push('speedBoost');
              // c.socket.emit('speedBoost', team, linkedtower);
              setTimeout(() => {
                c.statusconditions.splice(c.statusconditions.indexOf('speedBoost'), 1);
              }, 20000); // 20 seconds
            }
          }
        }
      } else if (tower.type == 2){
        if (team == 0){
          this.teamdamage[0] += 5;
          setTimeout(() => {
            this.teamdamage[0] -= 5;
          }, 20000); // 20 seconds
        } else {
          this.teamdamage[1] += 5;
          setTimeout(() => {
            this.teamdamage[1] -= 5;
          }, 20000); // 20 seconds
        }
      } else if (tower.type == 3){ // heal towers
        if (team == 0){
          this.teamhealth[0] += 9;
        } else {
          this.teamhealth[1] += 9;
        }
        for (let c of clients){
          c.socket.emit('healing', team, linkedtower);
        }
      } else if (tower.type == 4){ // slow towers
        for (let c of clients){
          for (let c of clients){
            c.socket.emit('slowdown', team, linkedtower);
          }
          if (team == 0){
            if (c.team == 1){
              // c.socket.emit('slowdown', team, linkedtower);
              c.statusconditions.push('slow');
              setTimeout(() => {
                c.statusconditions.splice(c.statusconditions.indexOf('slow'), 1);
              }, 20000); // 20 seconds
            }
          } else {
            if (c.team == 0){
              c.statusconditions.push('slow');
              setTimeout(() => {
                c.statusconditions.splice(c.statusconditions.indexOf('slow'), 1);
              }, 20000); // 20 seconds
            }
          }
        }
      } else if (tower.type == 5){ // debuff towers
        if (team == 0){
          this.teamdamage[1] -= 5;
          setTimeout(() => {
            this.teamdamage[1] += 5;
          }, 20000); // 20 seconds
        } else {
          this.teamdamage[0] -= 5;
          setTimeout(() => {
            this.teamdamage[0] += 5;
          }, 20000); // 20 seconds
        }
      }

      
    }
    this.deactivateTower(id, team, clients);
    this.deactivateTower(tower.linkedtowerid, team, clients);
    for (let c of clients){
      c.socket.emit('updateHealth', this.teamhealth);
    }
  }


}

class Tile{
  constructor(x, y, z, type){
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = type;
  }

}

class Tower{
  constructor(x, y, z, type, id){
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = type;
    this.id = id

    this.active = false;
    this.activecountdown = -1;
    this.linkedtowerid = null;
    this.duration = 0;
    this.team = null;

    this.w = 32
    this.h = 32
    // this.charginganimation = null;
    this.chargingindicator = 0;
    this.comboavailable = false;
  }
}
