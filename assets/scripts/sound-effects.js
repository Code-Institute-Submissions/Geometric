// Sound Effects
var soundOn = true;

function muteOff() {
    console.log('i sound')
    $('#muteIcon').removeClass('fa-volume-up');
    $('#muteIcon').addClass('fa-volume-mute');
    soundOn = false;
}

function muteOn() {
    console.log('i no sound')
    $('#muteIcon').removeClass('fa-volume-mute');
    $('#muteIcon').addClass('fa-volume-up');
    soundOn = true;
}

function playLaserSfx() {
    if(soundOn == true) {
        var laserSfx = document.getElementById('laserSound');
        laserSfx.currentTime = 0; //Reset sound clip to start
        laserSfx.play();
    }
};

function playLaserBounceSfx() {
    if(soundOn == true) {
        var laserBounceSfx = document.getElementById('laserBounce');
        laserBounceSfx.currentTime = 0; //Reset sound clip to start
        laserBounceSfx.play();
    }
};

function playLaserAbsorbSfx() {
    if(soundOn == true) {
        var laserAbsorbSfx = document.getElementById('laserAbsorb');
        laserAbsorbSfx.currentTime = 0; //Reset sound clip to start
        laserAbsorbSfx.play();
    }
};

function playCircleExplosionSfx() {
    if(soundOn == true) {
        var circleExplosionSfx = document.getElementById('circleExplosion');
        circleExplosionSfx.currentTime = 0; //Reset sound clip to start
        circleExplosionSfx.play();
    }
};

function playJumpSoundSfx() {
    if(soundOn == true) {
        var jumpSoundSfx = document.getElementById('jumpSound');
        jumpSoundSfx.currentTime = 0; //Reset sound clip to start
        jumpSoundSfx.play();
    }
};

function playHeroCrashSfx() {
    if(soundOn == true) {
        var heroCrashSfx = document.getElementById('heroCrash');
        heroCrashSfx.play();
    }
};