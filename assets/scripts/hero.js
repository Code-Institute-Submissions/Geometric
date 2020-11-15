// Variables
var fullWidth = $(window).width();
var fullHeight = $(window).height();
var strokeWidth = fullHeight * 0.02;
var objectSize = fullHeight * 0.0605; // Triange, others are scaled based off it
var floorHeight = fullHeight * 0.1;
var totalFloorHeight = fullHeight - floorHeight - strokeWidth / 2;
var obstacleHeight = fullHeight * 0.09;
var moveSpeed = 15;

// Hero Character
// Source https://stackoverflow.com/questions/38238282/how-to-rotate-a-triangle-without-rotating-the-entire-canvas ADAPTED TO MY NEEDS (Not all my own code)
var heroTri = {
    sides: 3,
    size: objectSize * 0.90,
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
            if (gameObstacles[i].alive == true && gameObstacles[i].type == 'circle') {
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
                heroTri.centerY <= gameObstacles[i].y + gameObstacles[i].height * 0.25 &&
                gameObstacles[i].type == 'rect') {
                    // Resets
                    heroTri.airBorn = false;
                    if (heroTri.shooting == false) {
                        heroTri.rotationDegrees = 270; //Resets rotation to be flush with floor (Delete once rotation formula is added)
                        heroTri.velocityY = 0;
                        heroTri.centerY = gameObstacles[i].y - heroTri.size / 2;
                    }
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
                
                if (distanceSquared < Math.pow(heroTri.size,2) && gameObstacles[i].type == 'rect') {
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

            if (heroTri.rotationDegrees >= 270) {
                heroTri.rotationDegrees = 270;
                heroTri.shooting = false;
                heroTri.shootMax = false;
                heroTri.airBorn = true;
                
            }

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