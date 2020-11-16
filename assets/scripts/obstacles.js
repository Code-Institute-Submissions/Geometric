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