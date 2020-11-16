// Laser
var gameLaser = []; // Laser array 
var laserColor = 'skyblue'; // Laser colour variable changed by user input 

// Laser Constructor function
function Laser() {
    this.width = objectSize * 0.66;
    this.height = objectSize * 0.1;
    this.speed = fullWidth * 0.015;
    this.y = heroTri.centerY + heroTri.size / 2 - this.height / 2;
    this.x = heroTri.centerX + heroTri.size;
    this.color = laserColor;

    // Draws the laser
    this.draw = function() {
        gameCanvas.ctx.fillStyle = this.color;
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

// Laser Movement
function laserMovement() {
    for (var i = 0; i < gameLaser.length; i++) {
        gameLaser[i].draw();
        gameLaser[i].x += gameLaser[i].speed; // Moves the laser reducing the X value each loop of the game
    }
}

// Laser Collisions
function laserCollisionCheck() {
    for (var i = 0; i < gameLaser.length; i++) {

        // Remove off canvas lasers
        if (gameLaser[i].x >= fullWidth || gameLaser[i].x + gameLaser[i].width < 0) {
            gameLaser.shift();
        }

        // Laser vs Hero (Work out if the laser have hit the hero by comparing X, Y, Height, Width)
        else if (
        gameLaser[i].x + gameLaser[i].width > heroTri.centerX && 
        gameLaser[i].x < heroTri.centerX + heroTri.size / 2 &&
        gameLaser[i].y < heroTri.centerY &&
        gameLaser[i].y + gameLaser[i].width > heroTri.centerY 
        ) {
            heroTri.crash();
        }
        else if (gameObstacles.length > 0) { // Checks if obstacle are in their array
            // Cycles through both the obstacle array and the laser array
            for (var j = 0; j < gameObstacles.length; j++) {
                
                // Laser vs Rect (Work out if the laser have hit the hero by comparing X, Y, Height, Width)
                if (
                gameObstacles[j].type == 'rect' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].x && 
                gameLaser[i].x < gameObstacles[j].x + gameObstacles[j].width && 
                gameLaser[i].y + gameLaser[i].height > gameObstacles[j].y &&
                gameLaser[i].y < gameObstacles[j].y + gameObstacles[j].height
                ) {
                    gameLaser[i].x = fullWidth; // Pushes the laser off screen where it is shifted out of the array

                    // Laser Absorb audio 
                    playLaserAbsorbSfx();
                } 
                
                // Laser vs Triangle (Work out if the laser have hit the hero by comparing X, Y, Size, Width)
                else if (
                gameObstacles[j].type == 'tri' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].triCenterX && 
                gameLaser[i].x < gameObstacles[j].triCenterX + gameObstacles[j].width / 2 &&
                gameLaser[i].y < gameObstacles[j].triCenterY &&
                gameLaser[i].y + gameLaser[i].width > gameObstacles[j].triCenterY
                ) {
                    gameLaser[i].speed =- gameLaser[i].speed; // Resvers the laser back at the hero
                    gameLaser[i].color = 'red';
                    gameLaser[i].x -= obstacleHeight; // A bump of speed so it doesnt get caught repeatly hitting the triangle as they both move in the same direction

                    // Laser Bounce Sound
                    playLaserBounceSfx();
                }
                
                // Laser vs Circle (Work out if the laser have hit the hero by comparing X, Y, Radius, Width)
                else if (
                gameObstacles[j].type == 'circle' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].circleCenterX && 
                gameLaser[i].x < gameObstacles[j].circleCenterX + gameObstacles[j].radius &&
                gameLaser[i].y + gameLaser[i].height > gameObstacles[j].circleCenterY &&
                gameLaser[i].y < gameObstacles[j].circleCenterY + gameObstacles[j].radius &&
                gameObstacles[j].alive == true
                ) {
                    gameLaser[i].color = 'red';
                    gameObstacles[j].alive = false; // If the circle is dead the Hero can no longer crash into it also cause them to explode

                    // Cirlce Explosion Sound
                    playCircleExplosionSfx();
                }
            }
        }
    }
}