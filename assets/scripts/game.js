// Variables
var gameState = 0; // Controls Start, Pause, Background
var loopCounter = 0; // How many times the game has updated

/* 
Detla Timer Varibles
Source: https://stackoverflow.com/questions/13996267/loop-forever-and-provide-delta-time/14006703
Improves frame rate (NOT MY OWN CODE)
*/
const perfectFrameTime = 1000 / 300;
var deltaTime = 0;
var lastTimestamp = 0;
// (End of NOT MY OWN CODE)

// Game Canvas
var gameCanvas = {
    // Counters
    score: 0, // Player Score
    // Cancus Creation
    canvas : document.createElement('canvas'),
    create : function() {  //Initial Creation
        this.canvas.setAttribute('id', 'gameZone');
        // Full size of browser
        this.canvas.width  = fullWidth;
        this.canvas.height = fullHeight;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.ctx = this.canvas.getContext("2d");
        gameState = 1; // If 1 the game loop runs
        heroTri.centerY = fullHeight * 0.5; // Resets hero position so it falls in
        loopCounter = 0;
        this.score = 0
        heroTri.alive = true; // Makes sure hero is alive when game start fixes instance death on Play Again
        // Removes vertical side scroller
        $('body').css('height', this.canvas.height);

        // Start Game
         this.loop();
    },

    // Wipes the canvas clean by removing all it content
    clear: function() {
        gameCanvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Clears Canvas
    },

    endGame: function() {
        gameState = 3;
        gameCanvas.clear();
        $('#yourScore').remove();
        var endGameTitle = document.getElementById('gameOverTitle');
        endGameTitle.insertAdjacentHTML('afterend', `<p id="yourScore">You Scored = ${gameCanvas.score}</p>`);
        // Remove Touch Controls
        $('#touchRight').remove();
        $('#touchLeft').remove();
        //Reset Counters
        mapCount = 0;
        loopCounter = 0;
        //Empty Game Arrays
        gameFloor = [];
        gameObstacles = [];
        gameLaser = [];
        gameBg = [];
        $('#pause').remove();
        $('#gameOver').addClass('display-toggle');
        $('#gameZone').remove();
        return
    },

    // GAME LOOP START
    // Update the game canvas each time it runs
    loop: function(timestamp) {
        if(gameState == 1) { // Allows the game to be pause as the game only runs in state 1
        // Self Call to repeat the loop
        requestAnimationFrame(gameCanvas.loop); //Re calls the this fuction to complete the loop (calling this.loop doesn't work)
        }
        // Delta Time Improves Frame Rate (NOT MY OWN CODE)
            deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
            lastTimestamp = timestamp;
        // (End NOT MY OWN CODE)

        // Clears last frame
        gameCanvas.clear();
        
        /* 
        Decides which map to use for the obstacles and call the map renderer to push the 
        obstacles into ther repective arrays
        */
        if(gameState == 1) { // Stops map loop throwing errors when the loop ends
            mapLoop();
             for(i = 0; i < gameBg.length; i++) {
            gameBg[i].draw()
        }
            bgCreation();
        }
        // Draws Back ground titles

        // Push backgrounds titles into thier array

        //Writes score
        score.draw();
        
        // Laser Physics
        laserMovement();
        // Laser Collisions
        laserCollisionCheck();

        // Floor Physics 
        for(i = 0; i < gameFloor.length; i++) {
            gameFloor[i].draw();
            gameFloor[i].x -= moveSpeed; // Moves floor by reducing X value
            //shifts out off screen floor titles
            removeOldFloor()
        }
        
        // rearrange obstacles by their x value so they can be shift out in the correct order
        reArrangeObstacles()

        // Draw new obstacles
        for(i = 0; i < gameObstacles.length; i++) {
            gameObstacles[i].draw();
        }

        // Hero Physics
        heroTri.draw();
        heroTri.gravity();
        // Obstacle Physics
        if (heroTri.alive == true) { // run if hero is alive
            heroTri.onFloor();
            obstacleMovement();
            for(i = 0; i < gameBg.length; i++) {
                gameBg[i].movement()
            }

            // Hero Collisions (doesn't run if hero is dead as it caused the hero to repeatedly crash and ruin the death animation)
            heroTri.cirlceCrash();
            heroTri.rectCrash();
            heroTri.floorCrash(); // Checks if the hero hasn't fallen below the floor
            triCollision();
        }

        obstacleRemove();

        // Add 1 to the amount of time the loop has been run
        loopCounter += 1;
    },
};
 // GAME LOOP END

// Map Renderer
var level = [map0, map1, map2, map3, map4, map5, map6, map7, map8, map9, map10, map11];

function mapLoop() {
    if (loopCounter == 0) {
        mapRender(map0);
        mapNo = 1;
    }

    else if (gameFloor[gameFloor.length - 1].x + gameFloor[gameFloor.length - 1].width < fullWidth) {
        startMap = gameFloor[gameFloor.length - 1].x + gameFloor[gameFloor.length - 1].width - moveSpeed;
        if (mapNo < level.length) {
            nextMap = level[mapNo];
            mapRender(nextMap);
            mapNo += 1
        }
        else {
            mapNo = randomNumber(1, level.length - 1)
        }
    }
}


// Obstacle Map Renderer
function mapRender(map) {
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

        // Defines each column X coordinate
        for (var j = 0; j < map[i].length; j++) {
            if (map == map0) {
                obsX = totalFloorHeight - obstacleHeight * (11 - j - 1);
            }
            
            else {
                obsX = startMap + totalFloorHeight - obstacleHeight * (11 - j - 1);
            }

            // Defines which object to push
            if (map[i][j] == 1) {
                gameObstacles.push(new Obstacle('rect', obsX, obsY));
            }

            if (map[i][j] == 2) {
            gameObstacles.push(new Obstacle('tri', obsX, obsY));
            }

            if (map[i][j] == 3) {
                gameObstacles.push(new Obstacle('circle', obsX, obsY));
            }

            if (map[i][j] == 4) {
                gameFloor.push(new Floor(obsX, obsY));
            }
        }
    }
}
/* Not my own code
Rearranges the obstacles by their X value so they can be shifted out in the correct order.
If they were left in order that the map render pushes them into the array, when the one with the
smallers x value is off the screen instead of shifting that one, the one with the smallest Y value
would be shift as it was pushed into the array first.
Source = https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
*/
function reArrangeObstacles() {
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
/*
Random Numebr Generator
Source: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
*/
function randomNumber(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// (END OF NOT MY OWN CODE)

// Styles and updates score
var score = {
    x : fullWidth / 2 - fullWidth * 0.0125,
    y : fullHeight * 0.15,
    color : 'white',
    draw : function() {
		gameCanvas.ctx.fillStyle = this.color;
		gameCanvas.ctx.font = '5vw Montserrat';
		gameCanvas.ctx.fillText(gameCanvas.score, this.x, this.y);
	}

}