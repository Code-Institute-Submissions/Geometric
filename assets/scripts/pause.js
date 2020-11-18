// Resumes game on button press by changing game state back to 1
function pauseGame() {
    gameState = 2; 
    $('#pauseMenu').addClass('display-toggle');
}

function resumeGame(){
    gameState = 1;
    $('.menu').removeClass('display-toggle');
    gameCanvas.loop();
}

// Contiunes Game where the user left off
$('#resumeBtn').click(function() {
    resumeGame();
});

// Quit the game
$('#quit').click(function() {
    $('#pauseMenu').removeClass('display-toggle');
    gameCanvas.endGame();
});