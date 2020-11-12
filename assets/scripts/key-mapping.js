// Jump Key Selection
$('#jumpButton').click(function() {
    keyListenerStatas = 1;
    setTimeout(function(){toggleColor('jumpButton')}, 300);
    keyListener(jumpButton);
    $('#controlsInstructions').html('<h3>Press a key</h3>');
    $('#jumpButton').blur();
});

// Shoot Key Selection
$('#shootButton').click(function() {
    keyListenerStatas = 1;
    setTimeout(function(){toggleColor('shootButton')}, 300);
    keyListener(shootButton);
    $('#controlsInstructions').html('<h3>Press a key</h3>')
    $('#shootButton').blur();
});

// Key Listener
function keyListener(button) {
    $(document).keypress(function keyMap(event) {
        if (keyListenerStatas == 1) {
            if (event.which == 112 || event.which == 109 || event.which == 13) {
                
                console.log('Sorry "P", "M"  and "Enter" are not mappable');
            }

            else if (button == jumpButton && event.which == shootKey) {
                $('#controlsInstructions').html('<h3>Key already mapped to Jump</h3>');
                console.log('Sorry that key is mapped to Shoot');
            }

            else if (button == shootButton && event.which == jumpKey) {
               $('#controlsInstructions').html('<h3>Key already mapped to Shoot</h3>');
                console.log('Sorry that key is mapped to Jump');
            }

            else {
                if(button == jumpButton) {
                    jumpKey = event.which;
                    jumpChar = String.fromCharCode(event.which)
                    console.log(`new jump ${jumpKey}`);
                    stopFlash = true;
                    $(document).off('keypress', keyMap);
                    $("#jumpButton").html(`${jumpChar}`)
                    $('#controlsInstructions').html('<h3>New Jump Key Set</h3>');
                    
                }
                else if(button == shootButton) {
                    shootKey = event.which;
                    shootChar = String.fromCharCode(event.which)
                    console.log(`new shoot ${shootKey}`);
                    stopFlash = true;
                    $(document).off('keypress', keyMap);
                    $("#shootButton").html(`${shootChar}`)
                    $('#controlsInstructions').html('<h3>New Shoot Key Set</h3>');
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