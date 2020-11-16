// Starts Game when play button clicked
$('#playButton').click(function() {
    gameCanvas.create(); // Creates Canvas
    $('.menu').removeClass('display-toggle'); // Hide menu
    createZone(); // Adds Touch Controls
    hub(); // Adds Heads Up
});