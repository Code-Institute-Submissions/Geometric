// Jump Key Selection
$('#jumpButton').click(function() {
    keyListenerStatas = 1;
    setTimeout(function(){toggleColor('jumpButton')}, 300);
    keyListener(jumpButton);
});

// Shoot Key Selection
$('#shootButton').click(function() {
    keyListenerStatas = 1;
    setTimeout(function(){toggleColor('shootButton')}, 300);
    keyListener(shootButton);
});

// Key Listener
function keyListener(button) {
    $(document).keypress(function keyMap(event) {
        if (keyListenerStatas == 1) {
            if (event.which == 112 || event.which == 109 || event.which == 13) {
                console.log('Sorry "P", "M"  and "Enter" are not mappable');
            }

            else if (button == jumpButton && event.which == shootKey) {
                console.log('Sorry that key is mapped to Shoot');
            }

            else if (button == shootButton && event.which == jumpKey) {
                console.log('Sorry that key is mapped to Jump');
            }

            else {
                if(button == jumpButton) {
                    jumpKey = event.which;
                    console.log(`new jump ${jumpKey}`);
                    stopFlash = true;
                    $(document).off('keypress', keyMap);
                    return
                }
                else if(button == shootButton) {
                    shootKey = event.which;
                    console.log(`new shoot ${shootKey}`);
                    stopFlash = true;
                    $(document).off('keypress', keyMap);
                    return
                }
            }
        }
        else {
            return
        }
    })
}


var buttonColor = 'red';

// Flashing Button
var stopFlash = false;

function toggleColor(button) {

    $('body').click(function() {
        stopFlash = true;
    });

    if (stopFlash == false) {
        if(buttonColor == 'red') {
        setTimeout(function(){
                if(button == 'jumpButton') {
                    $('#jumpButton').css("background-color", "blue");
                }
                if(button == 'shootButton') {
                    $('#shootButton').css("background-color", "blue");
                }
                buttonColor = 'blue'
                toggleColor(button);
            }, 300);
        }

        else {
            setTimeout(function(){
                if(button == 'jumpButton') {
                    $('#jumpButton').css("background-color", "red");
                }
                if(button == 'shootButton') {
                    $('#shootButton').css("background-color", "red");
                }
                
                buttonColor = 'red'
                toggleColor(button);
            }, 300);
        }
    }

    else {
        $('#jumpButton').css("background-color", "blue");
        $('#shootButton').css("background-color", "blue");
        $('body').off('click')
        stopFlash = false
        keyListenerStatas = 0;
        return
    }    
};