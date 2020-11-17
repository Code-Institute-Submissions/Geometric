// Variables, values are all percentage or multipler of the browser height or width to allow the game to be responsive.
var fullWidth = $(window).width();
var fullHeight = $(window).height();
var strokeWidth = fullHeight * 0.02;
var objectSize = fullHeight * 0.0605; // Triange, others are scaled based off it
var floorHeight = fullHeight * 0.1;
var totalFloorHeight = fullHeight - floorHeight - strokeWidth / 2;
var obstacleHeight = fullHeight * 0.09;
var moveSpeed = fullHeight / 56;

// Resizes all the variables so the browser size can be cahnged without breaking the game (only while the game isn't running see ReadMe doc under Testing for more info);
window.addEventListener('resize', resizeWindow);
function resizeWindow() {
    fullWidth = $(window).width();
    fullHeight = $(window).height();
    strokeWidth = fullHeight * 0.02;
    objectSize = fullHeight * 0.0605;
    floorHeight = fullHeight * 0.1;
    totalFloorHeight = fullHeight - floorHeight - strokeWidth / 2;
    obstacleHeight = fullHeight * 0.09;
    moveSpeed = fullHeight / 56;
    score.x = fullWidth / 2 - fullWidth * 0.0125;
    score.y = fullHeight * 0.1;
    heroTri.size = objectSize * 0.95;
    heroTri.jumpHeight = obstacleHeight * 1;
    bgTitle.width = fullWidth * 1.05;
    bgTitle.height = fullHeight;

    // Toggles the rotation instructions on the main menu
    if(fullHeight > fullWidth) {
        $('#rotationInstruction').addClass('display-toggle')
    }

    else (fullWidth < fullWidth) {
        $('#rotationInstruction').removeClass('display-toggle')
    }
}

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


/* 
Hero Character
Code relating to the drawing of the 'tri' objects is based off the code from the source below but not the code used to control it's behaviour.
Source https://stackoverflow.com/questions/38238282/how-to-rotate-a-triangle-without-rotating-the-entire-canvas ADAPTED TO MY NEEDS (Not all my own code)
*/
var heroTri = {
    sides: 3,
    size: objectSize * 0.95,
    centerX: fullWidth * 0.15,
    centerY: fullHeight * 0.5,
    fillColor: 'limegreen',
    rotationDegrees: 270, // Pointing Up
    velocityY: 0,
    airBorn: true, // true = Hero is off the floor
    shooting: false,
    shootMax: false,
    rotationSpeed: 0,
    jumpHeight: obstacleHeight * 1,
    alive: true,

    // Death Triangle X values and size
    deathSize: objectSize * 0.3,
    deathX1: fullWidth * 0.13,
    deathX2: fullWidth * 0.15,
    deathX3: fullWidth * 0.16,
    
    // Draws Hero Triangle on Canvas
    draw: function() {
        if (this.alive == true) {
            var radians = this.rotationDegrees*Math.PI/180; // Convert degrees into radians
            gameCanvas.ctx.translate(this.centerX, this.centerY);
            gameCanvas.ctx.rotate(radians);

            // Works out the points of the triangle
            gameCanvas.ctx.beginPath();
            gameCanvas.ctx.moveTo (this.size * Math.cos(0), this.deathSize * Math.sin(0));        
            for (var i = 1; i <= this.sides; i += 1) {
                gameCanvas.ctx.lineTo (this.size * Math.cos(i * 2 * Math.PI / this.sides), this.size * Math.sin(i * 2 * Math.PI / this.sides));
            }
            gameCanvas.ctx.closePath();

            // Styles Triangle
            gameCanvas.ctx.fillStyle = this.fillColor;
            gameCanvas.ctx.fill();
            
            gameCanvas.ctx.rotate(-radians);
            gameCanvas.ctx.translate(-this.centerX,-this.centerY);
        }

        // Draws 3 little Triangle on Canvas for the death animation
        else {
            // Death Tri 1
            var radians = this.rotationDegrees * Math.PI/180;
            gameCanvas.ctx.translate(this.deathX1, this.centerY * 0.85);
            gameCanvas.ctx.rotate(radians);
            gameCanvas.ctx.beginPath();
            gameCanvas.ctx.moveTo (this.deathSize * Math.cos(0), this.deathSize * Math.sin(0));          
            for (var i = 1; i <= this.sides; i += 1) {
                gameCanvas.ctx.lineTo (this.deathSize * Math.cos(i * 2 * Math.PI / this.sides), this.deathSize * Math.sin(i * 2 * Math.PI / this.sides));
            }
            gameCanvas.ctx.closePath();
            gameCanvas.ctx.fillStyle = this.fillColor;
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
            gameCanvas.ctx.fill();
            gameCanvas.ctx.rotate(-radians);
            gameCanvas.ctx.translate(-this.deathX3, -this.centerY * 0.9);
        }    
    },
//(End of Not all my own code)

    /*
    HERO COLLISION PHYSICS
    (Hero vs Triangle is a very long function and has it own script file called triangle-collision.js due to this.)
    */
    // Hero vs Circle Obstacle (Pythagoras Therom) 
    cirlceCrash: function() {
        for(i = 0; i < gameObstacles.length; i++) {
            if (gameObstacles[i].alive == true && gameObstacles[i].type == 'circle') {
                // Use Pythagoras Therom to work out the distance from Hero Center to Obstacle Center
                var disHyp = pythagoras(heroTri.centerX ,heroTri.centerY , gameObstacles[i].circleCenterX, gameObstacles[i].circleCenterY);
                

                // If the length of the hypotenuse is smaller than the size of the two radii add together they must be overlapping
                if(disHyp < heroTri.size + gameObstacles[i].radius) {
                    heroTri.crash(); // Crash Animation
                }
            }
        }
    },

    rectCrash: function() {
        for (i = 0; i < gameObstacles.length; i++) {
            // Landing on top of rect Collision
            if (heroTri.centerX + heroTri.size > gameObstacles[i].x &&
            heroTri.centerX - heroTri.size < gameObstacles[i].x + gameObstacles[i].width &&
            heroTri.centerY >= gameObstacles[i].y - heroTri.size &&
            heroTri.centerY <= gameObstacles[i].y &&
            gameObstacles[i].type == 'rect') {
                // Resets Values
                heroTri.airBorn = false;
                if (heroTri.shooting == false) {
                    heroTri.rotationDegrees = 270; //Resets rotation to be flush with floor (Delete once rotation formula is added)
                    heroTri.velocityY = 0;
                    heroTri.centerY = gameObstacles[i].y - heroTri.size / 2;
                }
            }

            // Hero vs Rectangle Obstacle Source: https://www.mmbyte.com/article/84023.html Adapted to my needs (Not all my own code)
            // Sections off the cavans in relation to the rectangle and Hero
            else {
                var closestX = Math.clamp(heroTri.centerX, gameObstacles[i].x, gameObstacles[i].x + gameObstacles[i].width);
                var closestY = Math.clamp(heroTri.centerY, gameObstacles[i].y, gameObstacles[i].y + gameObstacles[i].height);

            // Calculate the distance between the circle's center and this closest point
                var distanceX = heroTri.centerX - closestX;
                var distanceY = heroTri.centerY - closestY;

            // If the distance is less than the circle's radius, an intersection occurs
                var distanceSquared = Math.pow(distanceX, 2) + Math.pow(distanceY, 2);
                
                if (distanceSquared < Math.pow(heroTri.size,2) && gameObstacles[i].type == 'rect') {
                    heroTri.crash(); // Crash Animation
                }
            }
        }
    },
    // (End of Not all my own code)

    floorCrash: function() {
        if (heroTri.centerY > fullHeight) {
            heroTri.crash();
        }
    },

    gravity: function() {
        // Check shoot functions isn't running first (Shoot defies gravity)
        if(heroTri.shooting == true) {
            heroTri.shoot();
            heroTri.airBorn = true;
        } 
        
        // Gravity
        else {
            if (heroTri.alive == true) {
                heroTri.centerY += heroTri.velocityY;
                heroTri.velocityY += obstacleHeight * 0.075;
                heroTri.velocityY *= 0.9; // Friction

                heroTri.rotateSpeed = 10;
                heroTri.rotationDegrees += heroTri.rotateSpeed;
                heroTri.airBorn = true; // Reduces the chance of being able to shoot whilst in the air
            }
            
            // Crash animation gravity
            else {
                heroTri.centerY += heroTri.velocityY / 5;
                heroTri.velocityY += obstacleHeight * 0.075;
                // Spins little triangle
                heroTri.rotateSpeed = 35;
                heroTri.rotationDegrees += heroTri.rotateSpeed;
            }
        }
    },

    onFloor: function() {
        for(i = 0; i < gameFloor.length; i++) {
            if(heroTri.centerY > fullHeight - gameFloor[i].height - gameFloor[i].strokeWidth / 2 - objectSize / 2 - 1 &&
            heroTri.centerX + heroTri.size / 2 > gameFloor[i].x &&
            heroTri.centerX - heroTri.size / 2 < gameFloor[i].x + gameFloor[i].width) { //
                
                // Resets Hero to be on top of the floor 
                heroTri.centerY = totalFloorHeight - objectSize / 2.2; // Stops hero falling through the floor

                // Resets
                heroTri.airBorn = false; // no longer in the air
                heroTri.shooting = false; // allow shooting again
                heroTri.shootMax = false; // stop shooting rotation
                heroTri.velocityY = 0; // stops hero gaining momentum (perviously if user kept jumping the hero would jump higher)

                // Rotation Resets
                heroTri.rotationDegrees = 270; //Resets rotation to be flush with floor (Delete once rotation formula is added)
                heroTri.rotationSpeed = 0; // Stops Hero rotating constantly whilst on the floor
            }
        }
    },

    jump: function() {
        heroTri.velocityY -= this.jumpHeight; // A quick boost of velocity pops the Hero up the canvas (Hero Gravity Function will make it fall)
        heroTri.airBorn = true; // Hero in air

        // Jump Sound
        playJumpSoundSfx();
    },

    shoot: function() {
        heroTri.shooting = true;

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

        } 
        
        else {
            heroTri.rotationDegrees -= heroTri.rotateSpeed;
            heroTri.centerY -= heroTri.velocityY;
        }

    },

    crash: function() {
        heroTri.alive = false;
        // Hero Crash sound
        playHeroCrashSfx();

        setTimeout(function() {gameCanvas.endGame()}, 750); // Delay allows death animation to complete before showing Game Over Screen
        return;
    }
};