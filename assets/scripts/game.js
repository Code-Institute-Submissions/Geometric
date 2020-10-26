//Variables
var fullWidth = $(window).width();
var fullHeight = $(window).height();
var strokeWidth = fullHeight * 0.02;
var objectSize = fullHeight * 0.06; //Triange, others are scaled based off it
var floorHeight = fullHeight * 0.1;
var totalFloorHeight = fullHeight - floorHeight - strokeWidth / 2;
var obstacleHeight = objectSize * 1.5;

//Start Game
$(document).ready(function() {
    gameCanvas.create();
    gameCanvas.loop();
});

//Game Canvas
var gameCanvas = {
    //Counters
    loopCounter : 0,
    canvas : document.createElement('canvas'),
    create : function() {  //Initial Creation
        
        //Full size of browser
        this.canvas.width  = fullWidth;
        this.canvas.height = fullHeight;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.ctx = this.canvas.getContext("2d");

        //Removes vertical side scroller
        $('body').css('height', this.canvas.height);
    },

    loop: function() {
        gameCanvas.clear(); //Calls Clear Canvas
        
        //Hero
        heroTri.draw();
        heroTri.gravity();
        heroTri.onFloorCheck();
        
        //Laser 
        //Laser Collisions
        laserCollisionCheck();

        //Creates Initial Floor Pushing them into the array
        initalFloorCreation();

        // Adds new floor tile to create continuous infinity floor 
        infinityFloor();

        //Draws Floor
        for(i = 0; i < gameFloor.length; i++) {
            gameFloor[i].draw();
            gameFloor[i].x -= 10; //Floor Speed
        };

        //Obstacles draw and type
        if(gameCanvas.loopCounter == 0) {
            gameObstacles.push(new Obstacle('tri'));
            gameObstacles.push(new Obstacle('circle'));
            gameObstacles.push(new Obstacle('rect'));
        };

        //Obstacle Movement
        obstacleMovement();
        
        //Calls loop again and counts how many time
        gameCanvas.loopCounter += 1;
        requestAnimationFrame(gameCanvas.loop); //Re calls the this fuction to complete the loop
    },

    clear: function() {
        gameCanvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Clears Canvas
    },
};

// Hero Character - Source https://stackoverflow.com/questions/38238282/how-to-rotate-a-triangle-without-rotating-the-entire-canvas ADAPTED TO MY NEEDS (Not all my own code)
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
    airBorn: true,
    shooting: false,
    shootMax: false,
    rotationSpeed: 0,
    jumpHeight: obstacleHeight * 1,
    
    draw: function() {
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

    gravity() {
        //Check shoot functions (Shoot defies gravity)
        if(heroTri.shooting == true) {
            heroTri.shoot();

        //Gravity
        } else {
            heroTri.centerY += heroTri.velocityY;
            heroTri.velocityY += obstacleHeight * 0.075;
            heroTri.velocityY *= 0.9;

            heroTri.rotateSpeed = 10; //Close to correct rotation (Add formula later for precise rotation)
            heroTri.rotationDegrees += heroTri.rotateSpeed;
        };
    },

    onFloorCheck: function() {
       if(heroTri.centerY > totalFloorHeight - objectSize / 2 - 1) { //
            heroTri.centerY = totalFloorHeight - objectSize / 2;
            //Resets
            heroTri.airBorn = false;
            heroTri.shooting = false;
            heroTri.shootMax = false;
            heroTri.velocityY = 0;
            //Rotation Resets
            heroTri.rotationDegrees = 270; //Resets rotation to be flush with floor (Delete once rotation formula is added)
            heroTri.rotationSpeed = 0
        };
    },

    jump: function() {
        heroTri.velocityY -= this.jumpHeight; //
        heroTri.airBorn = true;
    },

    shoot: function() {
        heroTri.shooting = true;
        console.log('shoot');

        heroTri.rotateSpeed = 6;
        heroTri.velocityY = objectSize * 0.075;

        if(heroTri.rotationDegrees <= 220) {
            heroTri.shootMax = true;
            gameLaser.push(new Laser());
        };

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

function laserCollisionCheck() {
    for (var i = 0; i < gameLaser.length; i++) {
        if (gameLaser[i].x > fullWidth || gameLaser[i].x + gameLaser[i].width < 0) {
            gameLaser.shift();
        }
        
        else if (gameObstacles.length > 0) {
            for (var j = 0; j < gameObstacles.length; j++) {
            
                if (
                gameObstacles[j].type == 'rect' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].x && 
                gameLaser[i].x < gameObstacles[j].x + gameObstacles[j].width && 
                gameLaser[i].y + gameLaser[i].height > gameObstacles[j].y) {
                    gameLaser.shift();
                    console.log('rect collision');
                } 
                
                else if (
                gameObstacles[j].type == 'tri' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].triCenterX && 
                gameLaser[i].x < gameObstacles[j].triCenterX + gameObstacles[j].width / 2 &&
                gameLaser[i].y + gameLaser[i].height > gameObstacles[j].y) {
                    gameLaser[i].speed = -gameLaser[i].speed;
                    gameLaser[i].color = 'red';
                    console.log('tri collision');
                    gameLaser[i].x += gameLaser[i].speed;
                    gameLaser[i].x -= 40; //Make a percentage of full width
                    gameLaser[i].draw();
                }

                else if (
                gameObstacles[j].type == 'circle' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].circleCenterX && 
                gameLaser[i].x < gameObstacles[j].circleCenterX + gameObstacles[j].radius) {
                    gameLaser[i].color = 'red';
                    console.log('circle collision');
                    //Laser Movement again as the laser wouldn't be drawn after if the circle was the only obstacle in the array
                    gameLaser[i].draw();
                    gameLaser[i].x += gameLaser[i].speed;
                }
                
                //Laser Movement
                else {
                    gameLaser[i].draw();
                    gameLaser[i].x += gameLaser[i].speed;
                }
            }
        }

        else {
            gameLaser[i].draw();
            gameLaser[i].x += gameLaser[i].speed;
            console.log('else run');
        }
    }
}

//Floor

var gameFloor = [];

function Floor() {
    this.height = floorHeight;
    this.width = fullWidth / 10;
    this.x = 0;
    this.y = fullHeight - this.height;
    this.strokeWidth = strokeWidth;

    this.draw = function() {
        gameCanvas.ctx.fillStyle = '#161616';
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);

        gameCanvas.ctx.strokeStyle = 'white';
        gameCanvas.ctx.lineWidth = this.strokeWidth;
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.moveTo(this.x, this.y);
        gameCanvas.ctx.lineTo(this.x + this.width, this.y);
        gameCanvas.ctx.stroke();
    };
};

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

function infinityFloor() {
    if(gameFloor[gameFloor.length - 1].x + gameFloor[gameFloor.length - 1].width <= fullWidth && gameFloor.length >= 10) {
        gameFloor.push(new Floor());
        gameFloor[gameFloor.length - 1].x = fullWidth - 10;
    };
}

//Obstacles
var gameObstacles = [];

function Obstacle(type) {

    this.type = type;

    //Triangle
    this.sides = 3;
    this.size = objectSize;
    this.triCenterX = fullWidth + objectSize;
    this.triCenterY = totalFloorHeight - this.size / 2;
    //this.strokeWidth = 0;
    //this.strokeColor = 'purple';
    this.rotationDegrees = 270;

    //Rectangle
    this.height = objectSize * 1.5;
    this.width = this.height;
    this.x = fullWidth;
    this.y = totalFloorHeight - this.height;

    //Circle
    this.radius = objectSize * 0.75;
    this.circleCenterX = fullWidth + this.radius;
    this.circleCenterY = totalFloorHeight - this.radius;

    this.draw = function() {
        if(this.type == 'tri') {
            this.drawObsTri()
        } else if(this.type == 'circle') {
            this.drawObsCircle()
        } else if(this.type == 'rect'){
            this.drawObsRect()
        }
    };

    this.drawObsRect = function() {
        gameCanvas.ctx.fillStyle = 'yellow';
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);
        
    };

    this.drawObsCircle = function() {
        gameCanvas.ctx.fillStyle = 'purple';
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.arc(this.circleCenterX, this.circleCenterY, this.radius, 0, 2 * Math.PI, true);
        gameCanvas.ctx.fill();
    };

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

function obstacleMovement() {
    for(i = 0; i < gameObstacles.length; i++) {
        gameObstacles[i].draw();
        gameObstacles[i].x -= 10;
        gameObstacles[i].triCenterX -= 10;
        gameObstacles[i].circleCenterX -= 10;
    };
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
