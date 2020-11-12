function hub(){
    var headsUp = document.getElementById('headsUp');
    headsUp.insertAdjacentHTML('afterbegin', '<div id="pause" class="hub_item hub_item--left"><p>P =</p><button id="pauseBtn" class="btn btn--hub">Pause</button></div>');
    
    $('#pauseBtn').click(function() {
        pauseGame();
        console.log('pause');
    });
}
