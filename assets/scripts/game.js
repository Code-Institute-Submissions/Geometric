// Variables
var gameState = 0; // Controls Start, Pause, Background
var loopCounter = 0;
// Functions
/* Clamp use to work out sections of the canvas for heroTri / Rect Obs Collisions
Limits the value a number between two others.
Source: https://gist.github.com/kujon/2781489 (NOT MY OWN CODE)
*/
(function(){
    Math.clamp = function(val, min, max){
        return Math.max(min, Math.min(max ,val));
    };
})();
// (End of NOT MY OWN CODE)

// Game Canvas
var gameCanvas = {
    rows : 11,
    columns: Math.ceil(fullWidth / obstacleHeight), 
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
        gameState = 1;
        // Removes vertical side scroller
        $('body').css('height', this.canvas.height);

        // Start Game
         this.loop();
    },

    // Updates the game and self calls creating the loop
    loop: function() {
        //Clears last frame
        gameCanvas.clear();
        mapLoop();
        //mapRender(map0);
        // Background
        for(i = 0; i < gameBg.length; i++) {
            gameBg[i].draw()
        }  
        bgCreation();
        //Writes score
        score.draw();
        
        // Laser Physics
        laserMovement();
        // Laser Collisions
        laserCollisionCheck();

        // Floor Physics 
        for(i = 0; i < gameFloor.length; i++) {
            gameFloor[i].draw();
            gameFloor[i].x -= moveSpeed; // Floor Speed
            //removeOldFloor()
        }

        // Initial Floor pushed into the array
        //initalFloorCreation();

        // Adds new floor tile to create continuous infinity floor 
        //infinityFloor();

        // Test Obstacles pushed into the array (Replace with Level Design in Late Commit)
        if(gameCanvas.loopCounter == 0) {
            //gameObstacles.push(new Obstacle('tri'));
            //gameObstacles.push(new Obstacle('rect', totalFloorHeight - obstacleHeight));
            //gameObstacles.push(new Obstacle('circle'));
            
            //fillFloorGap();
            //rearrangeObstacles()
        }
        //fillFloorGap();
        rearrangeObstacles()
        for(i = 0; i < gameObstacles.length; i++) {
            gameObstacles[i].draw();
        }

        // Hero Physics
        heroTri.draw();
        heroTri.gravity();

        // Obstacle Physics
        if (heroTri.alive == true) {
            heroTri.onFloor();
            obstacleMovement();
            for(i = 0; i < gameBg.length; i++) {
                gameBg[i].movement()
            }

            // Hero Collisions
            heroTri.cirlceCrash();
            heroTri.rectCrash();
            triCollision();
        }
        
        obstacleRemove();
        // Add 1 to the amount of time the loop has been run
        loopCounter += 1;
        if(gameState == 1) {
        // Self Call to repeat the loop
            requestAnimationFrame(gameCanvas.loop); //Re calls the this fuction to complete the loop
        }
    },

    clear: function() {
        gameCanvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Clears Canvas
    },
};

//Laser
var gameLaser = [];
var laserColor = 'skyblue';

function Laser() {
    this.width = objectSize * 0.66;
    this.height = objectSize * 0.1;
    this.speed = fullWidth * 0.015;
    this.y = totalFloorHeight - objectSize / 2 - this.height * 2;
    this.x = heroTri.centerX + heroTri.size;
    this.color = laserColor;

    this.draw = function() {
        gameCanvas.ctx.fillStyle = this.color;
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

// Laser Movement
function laserMovement() {
    for (var i = 0; i < gameLaser.length; i++) {
        gameLaser[i].draw();
        gameLaser[i].x += gameLaser[i].speed;
    }
}

// Laser Collisions
function laserCollisionCheck() {
    for (var i = 0; i < gameLaser.length; i++) {

        // Remove off canvas lasers
        if (gameLaser[i].x >= fullWidth || gameLaser[i].x + gameLaser[i].width < 0) {
            gameLaser.shift();
        }

        // Laser vs Hero 
        else if (gameLaser[i].x + gameLaser[i].width > heroTri.centerX && 
        gameLaser[i].x < heroTri.centerX + heroTri.size / 2 &&
        gameLaser[i].y + gameLaser[i].height < heroTri.centerY) {
            heroTri.fillColor = 'red';
            console.log('hero collision');

        }
        
        else if (gameObstacles.length > 0) {
            for (var j = 0; j < gameObstacles.length; j++) {
                
                //Laser vs Rect
                if (
                gameObstacles[j].type == 'rect' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].x && 
                gameLaser[i].x < gameObstacles[j].x + gameObstacles[j].width && 
                gameLaser[i].y + gameLaser[i].height > gameObstacles[j].y &&
                gameLaser[i].y < gameObstacles[j].y + gameObstacles[j].height) {
                    gameLaser[i].x = fullWidth;
                    console.log('rect collision');

                    // Laser Absorb audio 
                    playLaserAbsorbSfx();
                } 
                
                // Laser vs Triangle
                else if (
                gameObstacles[j].type == 'tri' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].triCenterX && 
                gameLaser[i].x < gameObstacles[j].triCenterX + gameObstacles[j].width / 2 &&
                gameLaser[i].y + gameLaser[i].height < gameObstacles[j].triCenterY) {
                    gameLaser[i].speed = -gameLaser[i].speed;
                    gameLaser[i].color = 'red';
                    console.log('tri collision');
                    gameLaser[i].x -= 40; // Make a percentage of full width

                    // Lazer Bounce Sound
                    playLaserBounceSfx();
                }
                
                // Laser vs Circle
                else if (
                gameObstacles[j].type == 'circle' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].circleCenterX && 
                gameLaser[i].x < gameObstacles[j].circleCenterX + gameObstacles[j].radius) {
                    gameLaser[i].color = 'red';
                    console.log('circle collision');
                    gameObstacles[j].alive = false;

                    // Cirlce Explosion Sound
                    playCircleExplosionSfx();
                }
            }
        }
    }
}

// Obstacles
var gameObstacles = [];

function Obstacle(type, x, y) {

    this.type = type;

    // Rectangle
    this.height = objectSize * 1.5;
    this.width = this.height;
    this.x = x;
    this.y = y;
    
    // Circle
    this.radius = objectSize * 0.75;
    this.circleCenterX = this.x + this.radius;
    this.circleCenterY = this.y + this.radius;
    this.alive = true;
    this.deathR1 = this.radius * 0.25;
    this.deathR2 = this.radius * 0.25;
    this.deathR3 = this.radius * 0.25;
    this.deathStroke = 4;

    // Triangle
    this.sides = 3;
    this.size = objectSize;
    this.triCenterX = this.x + this.size / 1.325;
    this.triCenterY = y + this.size;
    //this.strokeWidth = 0;
    //this.strokeColor = 'purple';
    this.rotationDegrees = 180;

    //Tri Points
    this.backPointX = this.triCenterX - this.size * Math.sin(1 * 2 * Math.PI / this.sides);
    this.backPointY =  this.triCenterY - this.size * Math.cos(1 * 2 * Math.PI / this.sides);

    this.topPointX = this.triCenterX;
    this.topPointY = this.triCenterY - this.size;

    this.frontPointX = this.triCenterX + this.size * Math.sin(1 * 2 * Math.PI / this.sides);
    this.frontPointY = this.triCenterY - this.size * Math.cos(1 * 2 * Math.PI / this.sides);

    // Demeterines which obstacle to draw based on type
    this.draw = function() {
        if(this.type == 'tri') {
            this.drawObsTri();
        } 
        else if(this.type == 'circle' && this.alive == true) {
            this.drawObsCircle();
        }

        else if(this.type == 'circle' && this.alive == false) {
            this.drawCircleDeath();
        }

        else if(this.type == 'rect'){
            this.drawObsRect();
        }
    };

    // Draw Rectangle Obstacles
    this.drawObsRect = function() {
        gameCanvas.ctx.fillStyle = 'yellow';
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);
        gameCanvas.ctx.closePath();
    };

    // Draw Cirlce Obstacles
    this.drawObsCircle = function() {
        gameCanvas.ctx.fillStyle = 'purple';
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.arc(this.circleCenterX, this.circleCenterY, this.radius, 0, 2 * Math.PI, true);
        gameCanvas.ctx.closePath();
        gameCanvas.ctx.fill();
    };

    // Draw Triangle Obstacles
    this.drawObsTri = function() {
        console.log(`y = ${this.y} and center tri y = ${this.triCenterY}`)
        var radiansObs = this.rotationDegrees * Math.PI/180;
        gameCanvas.ctx.translate(this.triCenterX, this.triCenterY);
        gameCanvas.ctx.rotate(radiansObs);
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.moveTo (this.size * Math.sin(0), this.size * Math.cos(0));          
        for (var i = 1; i <= this.sides; i += 1) {
            gameCanvas.ctx.lineTo (this.size * Math.sin(i * 2 * Math.PI / this.sides), this.size * Math.cos(i * 2 * Math.PI / this.sides));
        }
        gameCanvas.ctx.closePath();
        gameCanvas.ctx.fillStyle = 'pink';
        //gameCanvas.ctx.strokeStyle = this.strokeColor;
        //gameCanvas.ctx.lineWidth = this.strokeWidth;
        //gameCanvas.ctx.stroke();
        gameCanvas.ctx.rotate(-radiansObs);
        gameCanvas.ctx.translate(-this.triCenterX,-this.triCenterY);
        gameCanvas.ctx.fill();
    };

    // Draw Cirlce Death
    this.drawCircleDeath = function() {
        // Largest Ring
        gameCanvas.ctx.strokeStyle = 'red';
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.arc(this.circleCenterX, this.circleCenterY, this.deathR1, 0, 2 * Math.PI, false);
        gameCanvas.ctx.lineWidth = this.deathStroke;
        gameCanvas.ctx.stroke();

       // Medium Ring
        gameCanvas.ctx.strokeStyle = 'red';
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.arc(this.circleCenterX, this.circleCenterY, this.deathR2, 0, 2 * Math.PI, false);
        gameCanvas.ctx.lineWidth = this.deathStroke;
        gameCanvas.ctx.stroke();

        // Small Ring
        gameCanvas.ctx.strokeStyle = 'red';
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.arc(this.circleCenterX, this.circleCenterY, this.deathR3, 0, 2 * Math.PI, false);
        gameCanvas.ctx.lineWidth = this.deathStroke;
        gameCanvas.ctx.stroke();
    };

    // Circle Deat Animation
    this.circleDeathAnimation = function() {
        if (gameObstacles[i].alive == false) {
            this.deathR1 += 1;
            this.deathR2 += 0.75;
            this.deathR3 += 0.25; 
        }
    }
}

// Moves the obstacles
function obstacleMovement() {
    for(i = 0; i < gameObstacles.length; i++) {
        gameObstacles[i].x -= moveSpeed;
        gameObstacles[i].circleCenterX -= moveSpeed;
        
        // Move all triangle points for collision
        if (gameObstacles[i].type == 'tri') {
            gameObstacles[i].triCenterX -= moveSpeed;
            gameObstacles[i].backPointX -= moveSpeed;
            gameObstacles[i].topPointX -= moveSpeed;
            gameObstacles[i].frontPointX -= moveSpeed;
        }

        gameObstacles[i].circleDeathAnimation();
    }
}

// Removes obstacles outside the canvas (left side only)
function obstacleRemove(){
    for(var i = 0; i < gameObstacles.length; i++) {
        if (gameObstacles[i].x + gameObstacles[i].width < 0 && gameObstacles[i].type == 'rect' || 
            gameObstacles[i].triCenterX + gameObstacles[i].size < 0 && gameObstacles[i].type == 'tri'|| 
            gameObstacles[i].circleCenterX + gameObstacles[i].size < 0 && gameObstacles[i].type == 'circle') {
            gameObstacles.shift();
            gameCanvas.score += 1;
        }
    }
}


//Controller
var jumpKey = 87; // S
var shootKey = 68; // Spacebar

$(document).keydown(function (event) {
//console.log(`press ${event.which}`)
//console.log(`shoot ${shootKey}`)
//console.log(`jump ${jumpKey}`)

    // Jump Control
    if (event.which === jumpKey && heroTri.airBorn == false && heroTri.shooting == false) {
        heroTri.jump();
    }

    // Shoot Control
    if (event.which === shootKey && heroTri.airBorn == false) {
        heroTri.shoot();
    }

    if (event.which === 80 && heroTri.airBorn == false) { // P
        if (gameState == 2) {
            resumeGame();
        }
        else {
            pauseGame();
        }
    }
});

// Score
var score = {
    x : fullWidth / 2 - fullWidth * 0.0125,
    y : fullHeight * 0.1,
    color : 'white',
    draw : function() {
		gameCanvas.ctx.fillStyle = this.color;
		gameCanvas.ctx.font = '5vw Montserrat';
		gameCanvas.ctx.fillText(gameCanvas.score, this.x, this.y);
	}

}

var level = [map0,map1,map2];

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

/* Random Number Generator
Source: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
NOT MY OWN CODE */
function randomNumber(min, max) { 
    return randomNo = Math.floor(Math.random() * (max - min + 1) + min);
}
// (END OF NOT MY OWN CODE)