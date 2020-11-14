gameBg = []

function bgTitle (titleNo) {
    this.titleNo = titleNo;
    this.x = 0;
    this.y = 0;
    this.width = fullWidth * 1.05;
    this.height = fullHeight;
    this.speed = 0.4;
    this.title1 = document.getElementById('bgTitle1');
    this.title2 = document.getElementById('bgTitle2');
    this.title3 = document.getElementById('bgTitle3');

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

    this.movement = function() {
        gameBg[i].x -= gameBg[i].speed;
    }
}

function bgCreation() {
    if (gameBg.length == 0){
        gameBg.push(new bgTitle(0));
    }

    else if(gameBg[gameBg.length - 1].x + gameBg[gameBg.length - 1].width <= fullWidth) {
        if((gameBg[gameBg.length - 1].titleNo + 2) % 3 == 0 || gameBg[gameBg.length - 1].titleNo == 0 && (gameBg[gameBg.length - 1].titleNo + 3) % 3 == 0) {
            gameBg.push(new bgTitle(2));
        }

        else if((gameBg[gameBg.length - 1].titleNo + 1) % 3 == 0) {
            gameBg.push(new bgTitle(3));
        }
        
        else if((gameBg[gameBg.length - 1].titleNo + 3) % 3 == 0) {
            gameBg.push(new bgTitle(1));
        }
        gameBg[gameBg.length - 1].x = fullWidth - gameBg[i].speed; // Draws title as the one before it moves passed the full width of the canvas
    }
}
