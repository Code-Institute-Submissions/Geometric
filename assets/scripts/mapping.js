var obsY;
var obsX;
var mapGap;
/* Their is all ways a 11 rows of the game canvas
each map is a group of obstacles put together to make a
larger obstacle*/
var map = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // row 0
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 1
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 2
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 3 Obs 
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0], // 4 From Floor Obs
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 5 Obs
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0], // 6 From Floor Obs
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 7 Obs 
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0], // 8 From Floor Obs 
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 9 Obs
    [4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4], // 10 Floor
]

function mapRender() {
    for (var i = 0; i < map.length; i++) {
        // Defines each rows Y coordinate
        if (i == 0) {
            obsY = totalFloorHeight - obstacleHeight * (11 - 1);
        }

        if(i >= 1 && i <= 9) {
            obsY = totalFloorHeight - obstacleHeight * (11 - i - 1);
        }

        if(i == 10) {
            obsY = fullHeight - floorHeight;
        }

        for (var j = 0; j < map[i].length; j++) {
            // Defines each column X coordinate
            obsX = totalFloorHeight - obstacleHeight * (11 - j - 1);

            // Defines which object to push
            if (map[i][j] == 1) {
                gameObstacles.push(new Obstacle('rect', obsY, obsX));
            }

            else if (map[i][j] == 2) {
            gameObstacles.push(new Obstacle('tri', obsY));
            }

            else if (map[i][j] == 3) {
                gameObstacles.push(new Obstacle('circle', obsY));
            }

            else if (map[i][j] == 4) {
                gameFloor.push(new Floor(obsY, obsX));
            }
        }
    }

    mapGap = gameCanvas.columns - map.length;
    //console.log(`inital game floor ${gameFloor.length}`);
    //console.log(`colums ${gameCanvas.columns}`);
    //console.log(`map.length ${map.length}`);
    //console.log(`map gap ${mapGap}`);
}

function fillFloorGap() {
    for (var i = 0; i < mapGap + 4; i++) {
        //console.log(`i ran that many times`);
        obsX = obsX + obstacleHeight;
        gameFloor.push(new Floor(obsY, obsX));
    }
    //console.log(`new game floor legth ${gameFloor.length}`);
}

function rearrangeObstacles() {
    gameObstacles.sort(compare);
}

function compare( a, b ) {
  if ( a.x < b.x ){
    return -1;
  }
  if ( a.x > b.x ){
    return 1;
  }
  return 0;
}