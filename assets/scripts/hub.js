function hub(){
    var topChild = document.getElementById('touchLeft');
    topChild.insertAdjacentHTML('beforebegin', '<div id="pause"><p>P =</p><button id="pauseBtn" class="btn btn--hub">Pause</button></div>');

    $('#pauseBtn').click(function() {
        pauseGame();
        console.log('pause');
    });
}
