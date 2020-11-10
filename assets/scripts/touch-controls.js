// Touch Zone Creactions
function createZone() {
    var d1 = document.getElementById('mainMenu');
    d1.insertAdjacentHTML('beforebegin', '<button id="touchLeft" class="touch touch--left"></button>');
    d1.insertAdjacentHTML('beforebegin', '<button id="touchRight" class="touch touch--right"></button>');

    $('#touchLeft').click(function() {
        heroTri.shoot();
        console.log('click right');
    });

    $('#touchRight').click(function() {
        heroTri.jump();
        console.log('click lift');
    });
}