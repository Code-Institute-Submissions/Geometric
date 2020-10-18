//Variables
var fullWith = $(window).width();
var fullHeight = $(window).height();

//Start Game
$(document).ready(function() {
    gameCanvas.create();
    gameCanvas.loop();
});

//Game Canvas
var gameCanvas = {
    canvas : document.createElement('canvas'),
    create : function() {  //Initial Creation
        //Full size of browser
        this.canvas.width  = fullWith;
        this.canvas.height = fullHeight;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.ctx = this.canvas.getContext("2d");

        //Removes vertical side scroller
        $('body').css('height', this.canvas.height);
    },

    loop: function() {
        gameCanvas.clear(); //Calls Clear Canvas
        
        heroTri.draw();
        heroTri.gravity();
        heroTri.onFloorCheck();

        //Creates Initial Floor Pushing them into the array
        if(gameFloor.length == 0) {
            for(var i = 0; i < 10; i++) {
                gameFloor.push(new Floor())
                console.log(gameFloor.length);
            }

            if(i = 1) {
                gameFloor[i].x += gameFloor[i].width;
            }

            if(i = 2) {
                gameFloor[i].x += gameFloor[i].width * i;
            }

            if(i = 3) {
                gameFloor[i].x += gameFloor[i].width * i;
            }

            if(i = 4) {
                gameFloor[i].x += gameFloor[i].width * i;
            }

            if(i = 5) {
                gameFloor[i].x += gameFloor[i].width * i;
            }

            if(i = 6) {
                gameFloor[i].x += gameFloor[i].width * i;
            }

            if(i = 7) {
                gameFloor[i].x += gameFloor[i].width * i;
            }

            if(i = 8) {
                gameFloor[i].x += gameFloor[i].width * i;
            }

            if(i = 9) {
                gameFloor[i].x += gameFloor[i].width * i;
            }
        }

        //Draws Floor
        for (i = 0; i < gameFloor.length; i++) {
            gameFloor[i].draw();
        }
        
        requestAnimationFrame(gameCanvas.loop); //Re calls the this fuction to complete the loop
    },

    clear: function() {
        gameCanvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Clears Canvas
    },
};

// Hero Character - Source https://stackoverflow.com/questions/38238282/how-to-rotate-a-triangle-without-rotating-the-entire-canvas ADAPTED TO MY NEEDS (Not all my own code)
var heroTri = {
    sides: 3,
    size: 40,
    centerX: fullWith * 0.15,
    centerY: fullHeight - fullHeight * 0.1 - 5 - 40/2,
    //strokeWidth: 0,
    strokeColor: 'purple',
    fillColor: 'limegreen',
    rotationDegrees: 270,
    velocityY: 0,
    airBorn: true,
    rotationSpeed: 0,
    
    draw: function() {
        var radians = this.rotationDegrees*Math.PI/180;
        gameCanvas.ctx.translate(this.centerX, this.centerY);
        gameCanvas.ctx.rotate(radians);
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.moveTo (this.size * Math.cos(0), this.size * Math.sin(0));          
        for (var i = 1; i <= this.sides; i += 1) {
            gameCanvas.ctx.lineTo (this.size * Math.cos(i * 2 * Math.PI / this.sides), this.size * Math.sin(i * 2 * Math.PI / this.sides));
        }
        gameCanvas.ctx.closePath();
        gameCanvas.ctx.fillStyle = this.fillColor;
        gameCanvas.ctx.strokeStyle = this.strokeColor;
        gameCanvas.ctx.lineWidth = this.strokeWidth;
        //gameCanvas.ctx.stroke();
        gameCanvas.ctx.fill();
        gameCanvas.ctx.rotate(-radians);
        gameCanvas.ctx.translate(-this.centerX,-this.centerY);
    },
//(End of Not all my own code)

    gravity() {
        heroTri.centerY += heroTri.velocityY;
        heroTri.velocityY += 2;
        heroTri.velocityY *= 0.9;
    },

    onFloorCheck: function() {
       if(heroTri.centerY >= fullHeight - fullHeight * 0.1 - 5 - 40/2) {
            heroTri.centerY = fullHeight - fullHeight * 0.1 - 5 - 40/2;
            heroTri.airBorn = false;
            //Rotation
            heroTri.rotationDegrees = 270; //Resets rotation to be flush with floor (Delete once rotation formula is added) 
        } else {
            heroTri.rotateSpeed = 3.41; //Close to correct rotation (Add formula later for precise rotation)
            heroTri.rotationDegrees += heroTri.rotateSpeed;  
        };
    },

    jump: function() {
        heroTri.velocityY -= 65;
        console.log('spacebar pressed');
        heroTri.airBorn = true;
    },
};

//Floor

var gameFloor = [];

function Floor() {
    this.height = fullHeight * 0.1;
    this.width = fullWith / 9;
    this.x = 0;
    this.y = fullHeight - this.height;
    this.strokeWidth = 10;

    this.draw = function() {
        gameCanvas.ctx.fillStyle = '#161616';
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);

        gameCanvas.ctx.strokeStyle = 'white';
        gameCanvas.ctx.lineWidth = this.strokeWidth;
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.moveTo(this.x, this.y);
        gameCanvas.ctx.lineTo(this.width, this.y);
        gameCanvas.ctx.stroke();
    }
}

//Controller
document.addEventListener('keydown', function (event) {
    if (event.key === ' ' && heroTri.airBorn == false) {
        heroTri.jump();
    }
});
