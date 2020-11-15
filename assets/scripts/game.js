// Variables
var fullWidth = $(window).width();
var fullHeight = $(window).height();
var strokeWidth = fullHeight * 0.02;
var objectSize = fullHeight * 0.06; // Triange, others are scaled based off it
var floorHeight = fullHeight * 0.1;
var totalFloorHeight = fullHeight - floorHeight - strokeWidth / 2;
var obstacleHeight = objectSize * 1.6;
var moveSpeed = 15;
var gameState = 0; // Controls Start, Pause, Background

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
    loopCounter : 0, // How many time the loop function runs
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
        // Background
        for(i = 0; i < gameBg.length; i++) {
            gameBg[i].draw()
        }  
        bgCreation();
        //Writes score
        score.draw();
        console.log(gameFloor.length);
        
        // Laser Physics
        laserMovement();
        // Laser Collisions
        laserCollisionCheck();

        // Floor Physics 
        for(i = 0; i < gameFloor.length; i++) {
            gameFloor[i].draw();
            gameFloor[i].x -= moveSpeed; // Floor Speed
            removeOldFloor()
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
            mapRender();
            fillFloorGap();
            rearrangeObstacles()
        }

        for(i = 0; i < gameObstacles.length; i++) {
            gameObstacles[i].draw();
        }

        // Hero Physics
        heroTri.draw();
        heroTri.gravity();

        console.log(heroTri.airBorn)

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
        gameCanvas.loopCounter += 1;
        if(gameState == 1) {
        // Self Call to repeat the loop
            requestAnimationFrame(gameCanvas.loop); //Re calls the this fuction to complete the loop
        }
    },

    clear: function() {
        gameCanvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Clears Canvas
    },
};

// Hero Character
// Source https://stackoverflow.com/questions/38238282/how-to-rotate-a-triangle-without-rotating-the-entire-canvas ADAPTED TO MY NEEDS (Not all my own code)
var heroTri = {
    sides: 3,
    size: objectSize,
    centerX: fullWidth * 0.15,
    centerY: totalFloorHeight - objectSize / 2,
    //strokeWidth: 0,
    //strokeColor: 'purple',
    fillColor: 'limegreen',
    rotationDegrees: 270,
    velocityY: 0,
    airBorn: true, // true = Hero is off the floor
    shooting: false,
    shootMax: false,
    rotationSpeed: 0,
    jumpHeight: obstacleHeight * 1,
    alive: true,

    // Death
    deathSize: objectSize * 0.3,
    deathX1: fullWidth * 0.13,
    deathX2: fullWidth * 0.15,
    deathX3: fullWidth * 0.16,
    
    draw: function() {
        if (this.alive == true) {
            //Draw tri boundary circle 
            gameCanvas.ctx.fillStyle = 'purple';
            gameCanvas.ctx.beginPath();
            gameCanvas.ctx.arc(this.centerX, this.centerY, this.size, 0, 2 * Math.PI, true);
            gameCanvas.ctx.closePath();
            gameCanvas.ctx.fill();

            //Draw tri
            var radians = this.rotationDegrees*Math.PI/180;
            gameCanvas.ctx.translate(this.centerX, this.centerY);
            gameCanvas.ctx.rotate(radians);
            gameCanvas.ctx.beginPath();
            gameCanvas.ctx.moveTo (this.size * Math.cos(0), this.deathSize * Math.sin(0));          
            for (var i = 1; i <= this.sides; i += 1) {
                gameCanvas.ctx.lineTo (this.size * Math.cos(i * 2 * Math.PI / this.sides), this.size * Math.sin(i * 2 * Math.PI / this.sides));
            }
            gameCanvas.ctx.closePath();
            gameCanvas.ctx.fillStyle = this.fillColor;
            //gameCanvas.ctx.strokeStyle = this.strokeColor;
            //gameCanvas.ctx.lineWidth = this.strokeWidth;
            //gameCanvas.ctx.stroke();
            gameCanvas.ctx.fill();
            gameCanvas.ctx.rotate(-radians);
            gameCanvas.ctx.translate(-this.centerX,-this.centerY);
        }

        else {
            // Death Tri 1
            var radians = this.rotationDegrees*Math.PI/180;
            gameCanvas.ctx.translate(this.deathX1, this.centerY * 0.85);
            gameCanvas.ctx.rotate(radians);
            gameCanvas.ctx.beginPath();
            gameCanvas.ctx.moveTo (this.deathSize * Math.cos(0), this.deathSize * Math.sin(0));          
            for (var i = 1; i <= this.sides; i += 1) {
                gameCanvas.ctx.lineTo (this.deathSize * Math.cos(i * 2 * Math.PI / this.sides), this.deathSize * Math.sin(i * 2 * Math.PI / this.sides));
            }
            gameCanvas.ctx.closePath();
            gameCanvas.ctx.fillStyle = this.fillColor;
            //gameCanvas.ctx.strokeStyle = this.strokeColor;
            //gameCanvas.ctx.lineWidth = this.strokeWidth;
            //gameCanvas.ctx.stroke();
            gameCanvas.ctx.fill();
            gameCanvas.ctx.rotate(-radians);
            gameCanvas.ctx.translate(-this.deathX1, -this.centerY * 0.85);
            
            // Death Tri 2
            var radians = this.rotationDegrees*Math.PI/180;
            gameCanvas.ctx.translate(this.deathX2, this.centerY * 0.8);
            gameCanvas.ctx.rotate(radians);
            gameCanvas.ctx.beginPath();
            gameCanvas.ctx.moveTo (this.deathSize * Math.cos(0), this.deathSize * Math.sin(0));          
            for (var i = 1; i <= this.sides; i += 1) {
                gameCanvas.ctx.lineTo (this.deathSize * Math.cos(i * 2 * Math.PI / this.sides), this.deathSize * Math.sin(i * 2 * Math.PI / this.sides));
            }
            gameCanvas.ctx.closePath();
            gameCanvas.ctx.fillStyle = this.fillColor;
            //gameCanvas.ctx.strokeStyle = this.strokeColor;
            //gameCanvas.ctx.lineWidth = this.strokeWidth;
            //gameCanvas.ctx.stroke();
            gameCanvas.ctx.fill();
            gameCanvas.ctx.rotate(-radians);
            gameCanvas.ctx.translate(-this.deathX2, -this.centerY * 0.8);

            // Death Tri 3
            var radians = this.rotationDegrees*Math.PI/180;
            gameCanvas.ctx.translate(this.deathX3, this.centerY * 0.9);
            gameCanvas.ctx.rotate(radians);
            gameCanvas.ctx.beginPath();
            gameCanvas.ctx.moveTo (this.deathSize * Math.cos(0), this.deathSize * Math.sin(0));          
            for (var i = 1; i <= this.sides; i += 1) {
                gameCanvas.ctx.lineTo (this.deathSize * Math.cos(i * 2 * Math.PI / this.sides), this.deathSize * Math.sin(i * 2 * Math.PI / this.sides));
            }
            gameCanvas.ctx.closePath();
            gameCanvas.ctx.fillStyle = this.fillColor;
            //gameCanvas.ctx.strokeStyle = this.strokeColor;
            //gameCanvas.ctx.lineWidth = this.strokeWidth;
            //gameCanvas.ctx.stroke();
            gameCanvas.ctx.fill();
            gameCanvas.ctx.rotate(-radians);
            gameCanvas.ctx.translate(-this.deathX3, -this.centerY * 0.9);
        }    
    },
//(End of Not all my own code)

    // Hero Collision with Circle Obstacle (Pythagoras Therom)
    cirlceCrash: function() {
        for(i = 0; i < gameObstacles.length; i++) {
            if (gameObstacles[i].alive == true) {
                // Use Pythagoras Therom to work out the distance from Hero Center to Obstacle Center
                var disHyp = pythagoras(heroTri.centerX ,heroTri.centerY , gameObstacles[i].circleCenterX, gameObstacles[i].circleCenterY);
                

                // If the length of the hypotenuse is smaller than the size of the two radii add together they must be overlapping
                if(disHyp < heroTri.size + gameObstacles[i].radius) {
                    heroTri.fillColor = 'red'; //Change to END GAME
                }
            }
        }
    },

    // Hero Collision with Rectangle Obstacle Source: https://www.mmbyte.com/article/84023.html Adapted to my needs (Not all my own code)
    rectCrash: function() {
        for (i = 0; i < gameObstacles.length; i++) {
            // Landing on top of rect
            if (heroTri.centerX + heroTri.size > gameObstacles[i].x &&
                heroTri.centerX - heroTri.size < gameObstacles[i].x + gameObstacles[i].width &&
                heroTri.centerY >= gameObstacles[i].y - heroTri.size &&
                heroTri.centerY <= gameObstacles[i].y + gameObstacles[i].height * 0.25) {
                    
                    heroTri.centerY = gameObstacles[i].y - heroTri.size / 2
                    // Resets
                    heroTri.airBorn = false;
                    heroTri.shooting = false;
                    heroTri.shootMax = false;
                    heroTri.velocityY = 0;
                    heroTri.rotationDegrees = 270; //Resets rotation to be flush with floor (Delete once rotation formula is added)
                    heroTri.rotationSpeed = 0;
            }

            // Allow gravity again 
            else if (heroTri.centerX - heroTri.size > gameObstacles[i].x + gameObstacles[i].width && heroTri.centerY == gameObstacles[i].y - heroTri.size / 2) {
                heroTri.airBorn = true;
            }

            // 
            else {
                var closestX = Math.clamp(heroTri.centerX, gameObstacles[i].x, gameObstacles[i].x + gameObstacles[i].width);
                var closestY = Math.clamp(heroTri.centerY, gameObstacles[i].y, gameObstacles[i].y + gameObstacles[i].height);

            // Calculate the distance between the circle's center and this closest point
                var distanceX = heroTri.centerX - closestX;
                var distanceY = heroTri.centerY - closestY;

            // If the distance is less than the circle's radius, an intersection occurs
                var distanceSquared = Math.pow(distanceX, 2) + Math.pow(distanceY, 2);
                
                if (distanceSquared < Math.pow(heroTri.size,2)) {
                    heroTri.fillColor = 'red'; //Change to END GAME
                    heroTri.crash();
                }
            }
        }
    },
    // (End of Not all my own code)

    gravity() {
        // Check shoot functions isn't running first (Shoot defies gravity)
        if(heroTri.shooting == true) {
            heroTri.shoot();

        // Gravity
        } 
        
        else {
            if (heroTri.alive == true) {
                heroTri.centerY += heroTri.velocityY;
                heroTri.velocityY += obstacleHeight * 0.075;
                heroTri.velocityY *= 0.9;

                heroTri.rotateSpeed = 10; //Close to correct rotation (Add formula later for precise rotation)
                heroTri.rotationDegrees += heroTri.rotateSpeed;
            }

            else {
                heroTri.centerY += heroTri.velocityY / 5;
                heroTri.velocityY += obstacleHeight * 0.075;

                heroTri.rotateSpeed = 35; //Close to correct rotation (Add formula later for precise rotation)
                heroTri.rotationDegrees += heroTri.rotateSpeed;
            }
        }
    },

    onFloor: function() {
        for(i = 0; i < gameFloor.length; i++) {
            if(heroTri.centerY > fullHeight - gameFloor[i].height - gameFloor[i].strokeWidth / 2 - objectSize / 2 - 1 &&
                heroTri.centerX + heroTri.size / 2 > gameFloor[i].x &&
                heroTri.centerX - heroTri.size / 2 < gameFloor[i].x + gameFloor[i].width) { //
                heroTri.centerY = totalFloorHeight - objectSize / 2; // Stops hero falling through the floor

                // Resets
                heroTri.airBorn = false;
                heroTri.shooting = false;
                heroTri.shootMax = false;
                heroTri.velocityY = 0;

                // Rotation Resets
                heroTri.rotationDegrees = 270; //Resets rotation to be flush with floor (Delete once rotation formula is added)
                heroTri.rotationSpeed = 0;
            }
        }
    },

    jump: function() {
        heroTri.velocityY -= this.jumpHeight;
        heroTri.airBorn = true;

        // Jump Sound
        playJumpSoundSfx();
    },

    shoot: function() {
        heroTri.shooting = true;
        console.log('shoot');

        heroTri.rotateSpeed = 6; // Speed of shooting
        heroTri.velocityY = objectSize * 0.075; // Move the Hero up so the tip is on the floor

        // Pushes new laser into the array and it to be drawn by another function
        if(heroTri.rotationDegrees <= 220) {
            heroTri.shootMax = true;
            gameLaser.push(new Laser());

            // Shoot audio 
            playLaserSfx();
        }

        //Stops the Hero over rotating and reverses the rotation
        if(heroTri.shootMax == true) { 
            heroTri.rotationDegrees += heroTri.rotateSpeed;
            heroTri.centerY += heroTri.velocityY;

        } else {
            heroTri.rotationDegrees -= heroTri.rotateSpeed;
            heroTri.centerY -= heroTri.velocityY;
        }
    },

    crash: function() {
        heroTri.alive = false;

        // Hero Crash sound
        playHeroCrashSfx();
    }
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

// Floor
var gameFloor = [];

function Floor(y, x) {
    this.height = floorHeight;
    this.width = obstacleHeight;
    this.x = x;
    this.y = y;
    this.strokeWidth = strokeWidth;

    this.draw = function() {
        // Block
        gameCanvas.ctx.fillStyle = '#161616';
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);

        // Top Line 
        gameCanvas.ctx.strokeStyle = 'white';
        gameCanvas.ctx.lineWidth = this.strokeWidth;
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.moveTo(this.x, this.y);
        gameCanvas.ctx.lineTo(this.x + this.width, this.y);
        gameCanvas.ctx.stroke();
    };
}

// Creates the starting floor of the game
function initalFloorCreation() {
    if(gameFloor.length == 0) {
        for(var i = 0; i < gameCanvas.columns; i++) {
            gameFloor.push(new Floor(obsY));
            gameFloor[i].x += gameFloor[i].width * i;
        }
    }
}

// Creates new floor title ever time the floor doesn't cover the entire width of the canvas
function infinityFloor() {
    if(gameFloor[gameFloor.length - 1].x + gameFloor[gameFloor.length - 1].width <= fullWidth && gameFloor.length >= gameCanvas.columns) {
        gameFloor.push(new Floor());
        gameFloor[gameFloor.length - 1].x = fullWidth - moveSpeed; // Draws title as the one before it moves passed the full width of the canvas
    }
}

// Removes Floor title when they go off the canvas (left side)
function removeOldFloor() {
    if(gameFloor[i].x + gameFloor[i].width * 2.5 < 0) { // have set it so it has to been at least 2.5 times it width off or a flashing artefact occurs
        gameFloor.shift();
    }
}

// Obstacles
var gameObstacles = [];

function Obstacle(type, y, x) {

    this.type = type;

    // Rectangle
    this.height = objectSize * 1.5;
    this.width = this.height;
    this.x = x;
    this.y = y;
    
    // Circle
    this.radius = objectSize * 0.75;
    this.circleCenterX = fullWidth + this.radius + 3000;
    this.circleCenterY = totalFloorHeight - this.radius;
    this.alive = true;
    this.deathR1 = this.radius * 0.25;
    this.deathR2 = this.radius * 0.25;
    this.deathR3 = this.radius * 0.25;
    this.deathStroke = 4;

    // Triangle
    this.sides = 3;
    this.size = objectSize;
    this.triCenterX = fullWidth + objectSize + 1000;
    this.triCenterY = totalFloorHeight - this.size / 2;
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
