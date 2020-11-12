// Touch Zone Creactions
function createZone() {
    var d1 = document.getElementById('mainMenu');
    d1.insertAdjacentHTML('beforebegin', '<button id="touchLeft" class="touch touch--left"></button>');
    d1.insertAdjacentHTML('beforebegin', '<button id="touchRight" class="touch touch--right"></button>');

    $('#touchLeft').click(function() {
        if (heroTri.airBorn == false) {
            heroTri.shoot();
            console.log('click right');
            $('#touchLeft').blur();
        }
    });

    $('#touchRight').click(function() {
        if (heroTri.airBorn == false) {
            heroTri.jump();
            console.log('click lift');
            $('#touchRight').blur();
        }
    });
}