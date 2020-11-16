// Resumes game on button press by changing game state back to 1
function pauseGame() {
    gameState = 2; 
    $('#pauseMenu').addClass('display-toggle');
}

function resumeGame(){
    gameState = 1;
    console.log('resume');
    $('.menu').removeClass('display-toggle');
    gameCanvas.loop();
}

$('#resumeBtn').click(function() {
    resumeGame()
});