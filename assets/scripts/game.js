// Variables
var fullWidth = $(window).width();
var fullHeight = $(window).height();
var strokeWidth = fullHeight * 0.02;
var objectSize = fullHeight * 0.06; // Triange, others are scaled based off it
var floorHeight = fullHeight * 0.1;
var totalFloorHeight = fullHeight - floorHeight - strokeWidth / 2;
var obstacleHeight = objectSize * 1.5;
var moveSpeed = 15; // 15 is an ideal speed (turn into a percentage of full width)

// Functions
/* Clamp use to work out sections of the canvas for heroTri / Cirlce Obs Collisions
Limits the value a number between two others.
Source: https://gist.github.com/kujon/2781489 (NOT MY OWN CODE)
*/
(function(){
    Math.clamp = function(val, min, max){
        return Math.max(min, Math.min(max ,val));
    }
})();

// (End of NOT MY OWN CODE)

// Starts Game
$(document).ready(function() {
    gameCanvas.create();
    gameCanvas.loop();
});

// Game Canvas
var gameCanvas = {
    
    // Counters
    loopCounter : 0, // How many time the loop function runs
    score: 0, // Player Score
    // Cancus Creation
    canvas : document.createElement('canvas'),
    create : function() {  //Initial Creation
        
        // Full size of browser
        this.canvas.width  = fullWidth;
        this.canvas.height = fullHeight;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.ctx = this.canvas.getContext("2d");

        // Removes vertical side scroller
        $('body').css('height', this.canvas.height);
    },

    // Updates the game and self calls creating the loop
    loop: function() {
        //Clears last frame
        gameCanvas.clear();

        //Writes score
        score.draw();
        
        // Hero Physics
        heroTri.draw();
        heroTri.gravity();
        heroTri.onFloorCheck();

        // Hero Collisions
        heroTri.cirlceCrash()
        heroTri.rectCrash()

        // Laser Physics
        laserMovement();

        // Laser Collisions
        laserCollisionCheck();

        // Floor Physics 
        for(i = 0; i < gameFloor.length; i++) {
            gameFloor[i].draw();
            gameFloor[i].x -= moveSpeed; // Floor Speed
        };

        // Initial Floor pushed into the array
        initalFloorCreation();

        // Adds new floor tile to create continuous infinity floor 
        infinityFloor();

        // Test Obstacles pushed into the array (Replace with Level Design in Late Commit)
        if(gameCanvas.loopCounter == 0) {
            gameObstacles.push(new Obstacle('tri'));
            gameObstacles.push(new Obstacle('rect'));
            gameObstacles.push(new Obstacle('circle'));
        };

        // Obstacle Physics
        obstacleMovement();
        obstacleRemove();
        
        // Add 1 to the amount of time the loop has been run
        gameCanvas.loopCounter += 1;

        // Self Call to repeat the loop
        requestAnimationFrame(gameCanvas.loop); //Re calls the this fuction to complete the loop
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
    
    draw: function() {

        //Draw tri boundary circle 
        gameCanvas.ctx.fillStyle = 'purple'
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.arc(this.centerX, this.centerY, this.size, 0, 2 * Math.PI, true);
        gameCanvas.ctx.closePath();
        gameCanvas.ctx.fill();

        //Draw tri
        var radians = this.rotationDegrees*Math.PI/180;
        gameCanvas.ctx.translate(this.centerX, this.centerY);
        gameCanvas.ctx.rotate(radians);
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.moveTo (this.size * Math.cos(0), this.size * Math.sin(0));          
        for (var i = 1; i <= this.sides; i += 1) {
            gameCanvas.ctx.lineTo (this.size * Math.cos(i * 2 * Math.PI / this.sides), this.size * Math.sin(i * 2 * Math.PI / this.sides));
        };
        gameCanvas.ctx.closePath();
        gameCanvas.ctx.fillStyle = this.fillColor;
        //gameCanvas.ctx.strokeStyle = this.strokeColor;
        //gameCanvas.ctx.lineWidth = this.strokeWidth;
        //gameCanvas.ctx.stroke();
        gameCanvas.ctx.fill();
        gameCanvas.ctx.rotate(-radians);
        gameCanvas.ctx.translate(-this.centerX,-this.centerY);
    },
//(End of Not all my own code)

    // Hero Collision with Circle Obstacle (Pythagoras Therom)
    cirlceCrash: function() {
        for(i = 0; i < gameObstacles.length; i++) {
            // Works out the length of Opposite and Adjacent sides from the centers of the two circles
            var disX = heroTri.centerX - gameObstacles[i].circleCenterX;
            var disY = heroTri.centerY - gameObstacles[i].circleCenterY;
            // Pythagoras Therom to find the length Hypotenuse
            var disHyp = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));

            // If the size of the radii, added together, are smaller then the length of the Hypotenuse they must be overlapping
            if(disHyp < heroTri.size + gameObstacles[i].radius) {
                heroTri.fillColor = 'red' //Change to END GAME
            }
        }
    },

    // Hero Collision with Rectangle Obstacle Source: https://www.mmbyte.com/article/84023.html Adapted to my needs (Not all my own code)
    rectCrash: function() {
        for (i = 0; i < gameObstacles.length; i++) {
            var closestX = Math.clamp(heroTri.centerX, gameObstacles[i].x, gameObstacles[i].x + gameObstacles[i].width);
            var closestY = Math.clamp(heroTri.centerY, gameObstacles[i].y, gameObstacles[i].y + gameObstacles[i].height);

        // Calculate the distance between the circle's center and this closest point
            var distanceX = heroTri.centerX - closestX;
            var distanceY = heroTri.centerY - closestY;

        // If the distance is less than the circle's radius, an intersection occurs
            var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
            
            if (distanceSquared < (heroTri.size * heroTri.size)) {
                heroTri.fillColor = 'red' //Change to END GAME
            }
        }
    },
    // (End of Not all my own code)

    gravity() {
        // Check shoot functions isn't running first (Shoot defies gravity)
        if(heroTri.shooting == true) {
            heroTri.shoot();

        // Gravity
        } else {
            heroTri.centerY += heroTri.velocityY;
            heroTri.velocityY += obstacleHeight * 0.075;
            heroTri.velocityY *= 0.9;

            heroTri.rotateSpeed = 10; //Close to correct rotation (Add formula later for precise rotation)
            heroTri.rotationDegrees += heroTri.rotateSpeed;
        };
    },

    onFloorCheck: function() {
        for(i = 0; i < gameFloor.length; i++) {
            if(heroTri.centerY > fullHeight - gameFloor[i].height - gameFloor[i].strokeWidth / 2 - objectSize / 2 - 1) { //
                heroTri.centerY = totalFloorHeight - objectSize / 2; // Stops hero falling through the floor

                // Resets
                heroTri.airBorn = false;
                heroTri.shooting = false;
                heroTri.shootMax = false;
                heroTri.velocityY = 0;

                // Rotation Resets
                heroTri.rotationDegrees = 270; //Resets rotation to be flush with floor (Delete once rotation formula is added)
                heroTri.rotationSpeed = 0
            };
        }
    },

    jump: function() {
        heroTri.velocityY -= this.jumpHeight;
        heroTri.airBorn = true;
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
        };

        //Stops the Hero over rotating and reverses the rotation
        if(heroTri.shootMax == true) { 
            heroTri.rotationDegrees += heroTri.rotateSpeed;
            heroTri.centerY += heroTri.velocityY;

        } else {
            heroTri.rotationDegrees -= heroTri.rotateSpeed;
            heroTri.centerY -= heroTri.velocityY;
        };
    }
};

//Laser
var gameLaser = [];

function Laser() {
    this.width = objectSize * 0.66;
    this.height = objectSize * 0.1;
    this.speed = fullWidth * 0.015;
    this.y = totalFloorHeight - objectSize / 2 - this.height * 2;
    this.x = heroTri.centerX + heroTri.size;
    this.color = 'skyblue';

    this.draw = function() {
        gameCanvas.ctx.fillStyle = this.color;
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
};

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
            console.log('hero collision')
        }
        
        else if (gameObstacles.length > 0) {
            for (var j = 0; j < gameObstacles.length; j++) {
                
                //Laser vs Rect
                if (
                gameObstacles[j].type == 'rect' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].x && 
                gameLaser[i].x < gameObstacles[j].x + gameObstacles[j].width && 
                gameLaser[i].y + gameLaser[i].height > gameObstacles[j].y) {
                    gameLaser[i].x = fullWidth;
                    console.log('rect collision');
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
                }
                
                // Laser vs Circle
                else if (
                gameObstacles[j].type == 'circle' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].circleCenterX && 
                gameLaser[i].x < gameObstacles[j].circleCenterX + gameObstacles[j].radius) {
                    gameLaser[i].color = 'red';
                    console.log('circle collision');
                }
            }
        }
    }
}

// Floor
var gameFloor = [];

function Floor() {
    this.height = floorHeight;
    this.width = fullWidth / 10;
    this.x = 0;
    this.y = fullHeight - this.height;
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
};

// Creates the starting floor of the game
function initalFloorCreation() {
    if(gameFloor.length == 0) {
        for(var i = 0; i < 10; i++) {
            gameFloor.push(new Floor())
        };

        if(i = 1) {
            gameFloor[i].x += gameFloor[i].width * i;
        };

        if(i = 2) {
            gameFloor[i].x += gameFloor[i].width * i;
        };

        if(i = 3) {
            gameFloor[i].x += gameFloor[i].width * i;
        };

        if(i = 4) {
            gameFloor[i].x += gameFloor[i].width * i;
        };

        if(i = 5) {
            gameFloor[i].x += gameFloor[i].width * i;
        };

        if(i = 6) {
            gameFloor[i].x += gameFloor[i].width * i ;
        };

        if(i = 7) {
            gameFloor[i].x += gameFloor[i].width * i;
        };

        if(i = 8) {
            gameFloor[i].x += gameFloor[i].width * i;
        };

        if(i = 9) {
            gameFloor[i].x += gameFloor[i].width * i;
        };
    };
}

// Creates new floor title ever time the floor doesn't cover the entire width of the canvas
function infinityFloor() {
    if(gameFloor[gameFloor.length - 1].x + gameFloor[gameFloor.length - 1].width <= fullWidth && gameFloor.length >= 10) {
        gameFloor.push(new Floor());
        gameFloor[gameFloor.length - 1].x = fullWidth - moveSpeed; // Draws title as the one before it moves passed the full width of the canvas
    };
}

// Obstacles
var gameObstacles = [];

function Obstacle(type) {

    this.type = type;

    // Triangle
    this.sides = 3;
    this.size = objectSize;
    this.triCenterX = fullWidth + objectSize + 1000;
    this.triCenterY = totalFloorHeight - this.size / 2;
    //this.strokeWidth = 0;
    //this.strokeColor = 'purple';
    this.rotationDegrees = 270;

    // Rectangle
    this.height = objectSize * 1.5;
    this.width = this.height;
    this.x = fullWidth + 2000;
    this.y = totalFloorHeight - this.height
    // Circle
    this.radius = objectSize * 0.75;
    this.circleCenterX = fullWidth + this.radius + 3000;
    this.circleCenterY = totalFloorHeight - this.radius;

    // Demeterines which obstacle to draw based on type
    this.draw = function() {
        if(this.type == 'tri') {
            this.drawObsTri();
        } else if(this.type == 'circle') {
            this.drawObsCircle();
        } else if(this.type == 'rect'){
            this.drawObsRect();
        }
    };

    // Draw Rectangle Obstacles
    this.drawObsRect = function() {
        gameCanvas.ctx.fillStyle = 'yellow';
        gameCanvas.ctx.beginPath()
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);
        gameCanvas.ctx.closePath()
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
        gameCanvas.ctx.moveTo (this.size * Math.cos(0), this.size * Math.sin(0));          
        for (var i = 1; i <= this.sides; i += 1) {
            gameCanvas.ctx.lineTo (this.size * Math.cos(i * 2 * Math.PI / this.sides), this.size * Math.sin(i * 2 * Math.PI / this.sides));
        };
        gameCanvas.ctx.closePath();
        gameCanvas.ctx.fillStyle = 'pink';
        //gameCanvas.ctx.strokeStyle = this.strokeColor;
        //gameCanvas.ctx.lineWidth = this.strokeWidth;
        //gameCanvas.ctx.stroke();
        gameCanvas.ctx.rotate(-radiansObs);
        gameCanvas.ctx.translate(-this.triCenterX,-this.triCenterY);
        gameCanvas.ctx.fill();
    };
};

// Moves the obstacles
function obstacleMovement() {
     for(i = 0; i < gameObstacles.length; i++) {
        console.log(gameObstacles.length);
        gameObstacles[i].draw();
        gameObstacles[i].x -= moveSpeed;
        gameObstacles[i].triCenterX -= moveSpeed;
        gameObstacles[i].circleCenterX -= moveSpeed;
     }
}

// Removes obstacles outside the canvas
function obstacleRemove(){
    for(i = 0; i < gameObstacles.length; i++) {
        if (gameObstacles[i].x + gameObstacles[i].width < 0 && gameObstacles[i].type == 'rect' || 
            gameObstacles[i].triCenterX + gameObstacles[i].size < 0 && gameObstacles[i].type == 'tri'|| 
            gameObstacles[i].circleCenterX + gameObstacles[i].size < 0 && gameObstacles[i].type == 'circle') {
            gameObstacles.shift();
            gameCanvas.score += 1;
        }
    }
}

//Controller
document.addEventListener('keydown', function (event) {
    if (event.key === ' ' && heroTri.airBorn == false && heroTri.shooting == false) {
        heroTri.jump();
    };

    if (event.key === 's' && heroTri.airBorn == false) {
        heroTri.shoot();
    };
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
