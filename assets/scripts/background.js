// Background

// Background Array
gameBg = []

// Background Constructor Function
function bgTitle (titleNo) {
    this.titleNo = titleNo;
    this.x = 0;
    this.y = 0;
    this.width = fullWidth * 1.05;
    this.height = fullHeight;
    this.speed = 0.4;
    this.title1 = document.getElementById('bgTitle1'); // Jquery didn't work
    this.title2 = document.getElementById('bgTitle2'); // Jquery didn't work
    this.title3 = document.getElementById('bgTitle3'); // Jquery didn't work

    // Draws background to canvas
    this.draw = function() {
        if (this.titleNo == 0) {
            gameCanvas.ctx.drawImage(this.title1, this.x, this.y, this.width, this.height)
        }

        if (this.titleNo == 1) {
            gameCanvas.ctx.drawImage(this.title1, this.x, this.y, this.width, this.height)
        }

        if (this.titleNo == 2) {
            gameCanvas.ctx.drawImage(this.title2, this.x, this.y, this.width, this.height)
        }

        else if (this.titleNo == 3) {
            gameCanvas.ctx.drawImage(this.title3, this.x, this.y, this.width, this.height)
        }
    }

    // Moves the background by decreasing the X value
    this.movement = function() {
        gameBg[i].x -= 15;
    }
}

// Pushes new background image into array
function bgCreation() {

    // Pushes first one
    if (gameBg.length == 0){
        gameBg.push(new bgTitle(0));
    }

    // If the last one no longer fills the canvas, push the next in
    else if(gameBg[gameBg.length - 1].x + gameBg[gameBg.length - 1].width <= fullWidth) {

        // If the last title No. pushed into the array +1 is divisible by 3 push background image 2 or if its the 2nd title
        if((gameBg[gameBg.length - 1].titleNo + 2) % 3 == 0 || gameBg[gameBg.length - 1].titleNo == 0 && (gameBg[gameBg.length - 1].titleNo + 3) % 3 == 0) {
            gameBg.push(new bgTitle(2));
        }

        // If the last title No. pushed into the array +2 is divisible by 3 push background image 3
        else if((gameBg[gameBg.length - 1].titleNo + 1) % 3 == 0) {
            gameBg.push(new bgTitle(3));
        }

        // If the last title No. pushed into the array +3 is divisible by 3 push background image 3
        else if((gameBg[gameBg.length - 1].titleNo + 3) % 3 == 0) {
            gameBg.push(new bgTitle(1));
        }

        gameBg[gameBg.length - 1].x = fullWidth - gameBg[i].speed; // Moves titles to catch up with the prevous one to stop gaps
    }
}

// Remove off canvas background title when they off to the left
function bgReomveOld() {
    for(var i = 0; i < gameBg.length; i++)
    if (gameBg[i].x + gameBg[i].width < 0) {
        gameBg.shift()
    }
}
