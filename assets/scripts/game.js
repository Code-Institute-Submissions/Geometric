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
    centerX: fullWith * 0.1,
    centerY: 600,
    //strokeWidth: 0,
    strokeColor: 'purple',
    fillColor: 'limegreen',
    rotationDegrees: 270,
    velocityY: 0,
    
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
       if(heroTri.centerY >= $(window).height() - heroTri.size/2) {
            heroTri.centerY = $(window).height() - heroTri.size/2;
        };
    },

}
