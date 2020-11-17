// Controller
var jumpKey = 87; // W
var shootKey = 68; // D

$(document).keydown(function (event) {

    // Jump Control
    if (event.which === jumpKey && heroTri.airBorn == false && heroTri.shooting == false) { // Can't Jump while airborn or shooting 
        heroTri.jump();
    }

    // Shoot Control
    if (event.which === shootKey && heroTri.airBorn == false) { // Can't shoot wilst in the air
        heroTri.shoot();
        heroTri.shooting = true;
    }

    // Pause Game Control
    if (event.which === 80) { // P to Pause 
        if (gameState == 2) { // Toggles what P does depending on the game state. Game only loops in game state 1
            resumeGame();
        }
        else {
            pauseGame();
        }
    }
});

// Touch Zone Creactions
function createZone() {
    var d1 = document.getElementById('mainMenu');
    d1.insertAdjacentHTML('beforebegin', '<button id="touchLeft" class="touch touch--left"></button>');
    d1.insertAdjacentHTML('beforebegin', '<button id="touchRight" class="touch touch--right"></button>');

    // Creates when the leftside div is clicked = shoot
    $('#touchLeft').click(function() {
        if (heroTri.airBorn == false) {
            heroTri.shoot();
            $('#touchLeft').blur();
        }
    });

    // Creates when the leftside div is clicked = jump
    $('#touchRight').click(function() {
        if (heroTri.airBorn == false) {
            heroTri.jump();
            $('#touchRight').blur();
        }
    });
}