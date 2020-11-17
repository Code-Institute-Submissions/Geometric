// When Page Ready Swap Loading Bar to Play Button
$(document).ready(function() {
    $('#loadingIcon').remove();
    $('#playButton').addClass('display-toggle');
});

// Creates Pause Button when game starts
function addPause(){
    var headsUp = document.getElementById('headsUp');
    headsUp.insertAdjacentHTML('afterbegin', '<div id="pause" class="hub_item hub_item--left"><p class="hub_text">P =</p><button id="pauseBtn" class="btn btn--hub">Pause</button></div>');
    
    $('#pauseBtn').click(function() {
        pauseGame();
    });
}

// Menu Toggler
$('.btn--menu').click(function() {
    $('.menu').removeClass('display-toggle')
    var menuId =  `#${this.value}`;
    $(menuId).addClass('display-toggle');
});

// Hero Colour Toggler
$('.tri-color').click(function() {
    $('.tri-color').removeClass('color-active')
    $(this).addClass('color-active');
    heroTri.fillColor = this.value;
});

// Lasar Colour Toggler
$('.laser-color').click(function() {
    $('.laser-color').removeClass('laser-active')
    $(this).addClass('laser-active');
    laserColor = this.value;
});