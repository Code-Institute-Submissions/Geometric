// Sound Effects
var soundOn = true;

// Mute Toggler
$('#muteBtn').click(function() {
    if (soundOn == true){
        muteOff();
        $('#muteBtn').blur();
        return;
    }

    if (soundOn == false){
        muteOn();
        $('#muteBtn').blur();
        return;
    }
    return;
});

// Always Listening for the M button press to Mute the sound effects
$(document).keydown(function (event) {
    if (event.which === 77) {
        if (soundOn == true){
            muteOff();
            return;
        }

         if (soundOn == false){
            muteOn();
            return;
        }
    }
});

// Turns game sound off
function muteOff() {
    $('#muteIcon').removeClass('fa-volume-up');
    $('#muteIcon').addClass('fa-volume-mute');
    soundOn = false;
}

// Turns game sound on
function muteOn() {
    $('#muteIcon').removeClass('fa-volume-mute');
    $('#muteIcon').addClass('fa-volume-up');
    soundOn = true;
}

/*
All the functions below are control if the sound effect plays or not based on the soundOn variable
*/
function playLaserSfx() {
    if(soundOn == true) {
        var laserSfx = document.getElementById('laserSound');
        laserSfx.currentTime = 0; //Reset sound clip to start
        laserSfx.play();
    }
}

function playLaserBounceSfx() {
    if(soundOn == true) {
        var laserBounceSfx = document.getElementById('laserBounce');
        laserBounceSfx.currentTime = 0; //Reset sound clip to start
        laserBounceSfx.play();
    }
}

function playLaserAbsorbSfx() {
    if(soundOn == true) {
        var laserAbsorbSfx = document.getElementById('laserAbsorb');
        laserAbsorbSfx.currentTime = 0; //Reset sound clip to start
        laserAbsorbSfx.play();
    }
}

function playCircleExplosionSfx() {
    if(soundOn == true) {
        var circleExplosionSfx = document.getElementById('circleExplosion');
        circleExplosionSfx.currentTime = 0; //Reset sound clip to start
        circleExplosionSfx.play();
    }
}

function playJumpSoundSfx() {
    if(soundOn == true) {
        var jumpSoundSfx = document.getElementById('jumpSound');
        jumpSoundSfx.currentTime = 0; //Reset sound clip to start
        jumpSoundSfx.play();
    }
}

function playHeroCrashSfx() {
    if(soundOn == true) {
        var heroCrashSfx = document.getElementById('heroCrash');
        heroCrashSfx.play();
    }
}