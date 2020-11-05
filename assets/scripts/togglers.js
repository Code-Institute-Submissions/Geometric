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