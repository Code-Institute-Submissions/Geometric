// Floor

// Floor Array
var gameFloor = [];

// Floor Constructor Function
function Floor(x, y) {
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

// Removes Floor title when they go off the canvas (left side)
function removeOldFloor() {
    if(gameFloor[i].x + gameFloor[i].width * 2.5 < 0) { // have set it so it has to been at least 2.5 times it width off or a flashing artefact occurs
        gameFloor.shift();
    }
}