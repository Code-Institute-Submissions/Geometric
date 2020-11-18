// Jump Key Selection
$('#jumpButton').click(function() {
    keyListenerStatas = 1; // Sets when the listener should be listening 0 = off 1 = On
    setTimeout(function(){toggleColor('jumpButton');}, 300); // Prevents double clicking
    keyListener(jumpButton);
    $('#controlsInstructions').html('<h3>Press a letter key A-Z</h3>'); // Add instructions
    $('#jumpButton').blur(); // Unfocuses the button to stop it being click again by spacebar
});

// Shoot Key Selection
$('#shootButton').click(function() {
    keyListenerStatas = 1; // Sets when the listener should be listening 0 = off 1 = On
    setTimeout(function(){toggleColor('shootButton');}, 300); // Prevents double clicking
    keyListener(shootButton); // Add instructions
    $('#controlsInstructions').html('<h3>Press a letter key A-Z</h3>');
    $('#shootButton').blur(); // Unfocuses the button to stop it being click again by spacebar
});

// Key Listener
function keyListener(button) {
    $(document).keydown(function keyMap(event) {
        if (keyListenerStatas == 1) { // Key Listener On
            if (event.which == 80 || event.which == 77) { // P AND M
                $('#controlsInstructions').html('<h3>Sorry "P" & "M" are not mappable</h3>'); // Error Indicator
            }

            // Checks the button isnt already mapped the shoot key
            else if (button == jumpButton && event.which == shootKey) {
                $('#controlsInstructions').html('<h3>Key already mapped to Jump</h3>'); // Error Indicator
            }

            // Checks the button isnt already mapped the jump key
            else if (button == shootButton && event.which == jumpKey) {
               $('#controlsInstructions').html('<h3>Key already mapped to Shoot</h3>'); // Error Indicator
            }

            // Eliminates all characters not letters
            else if (event.which <= 65 || event.which >= 90) {
               $('#controlsInstructions').html('<h3>Key not mappable</h3>'); // Error Indicator
            }

            else {
                if(button == jumpButton) {
                    jumpKey = event.which; // Sets new key
                    jumpChar = String.fromCharCode(event.which); // Converts Code to Character
                    $("#jumpButton").html(`${jumpChar}`); // Shows it in the Button
                    $('#controlsInstructions').html('<h3>New Jump Key Set</h3>');  // Shows instruction

                }
                else if(button == shootButton) {
                    shootKey = event.which; // Sets new key
                    shootChar = String.fromCharCode(event.which); // Converts Code to Character
                    $("#shootButton").html(`${shootChar}`); // Shows it in the Button
                    $('#controlsInstructions').html('<h3>New Shoot Key Set</h3>'); // Shows instruction
                }

                stopFlash = true; // Turns off key listener indicator
                $(document).off('keydown', keyMap); // Removes this listener
                return;
            }
        }
      
        else {
            return;
        }
    });
}

// Flashing Button
// Default colour to get the flash started
var buttonColor = 'red';
var stopFlash = false; // Stops the flash when true

function toggleColor(button) { // Take the button that is press so one function can be used for mulipte buttons
    $('body').click(function() {
        stopFlash = true;
    });
    if (stopFlash == false) {
        if(buttonColor == 'red') {
        setTimeout(function(){
                if(button == 'jumpButton') {
                    $('#jumpButton').css("background-color", "teal");
                }
                if(button == 'shootButton') {
                    $('#shootButton').css("background-color", "teal");
                }
                buttonColor = 'teal'; // Set value to the opposite to run the opposite if statement 
                toggleColor(button); // Self Calling
            }, 300); // Dely Between Flashs
        }

        else {
            setTimeout(function(){
                if(button == 'jumpButton') {
                    $('#jumpButton').css("background-color", "red");
                }
                if(button == 'shootButton') {
                    $('#shootButton').css("background-color", "red");
                }
                
                buttonColor = 'red'; // Set value to the opposite to run the opposite if statement 
                toggleColor(button); // Self Calling
            }, 300); // Dely Between Flashs
        }
    }
    else {
        $('#jumpButton').css("background-color", "teal");
        $('#shootButton').css("background-color", "teal");
        $('body').off('click');
        stopFlash = false;
        keyListenerStatas = 0;
        return;
    }    
}
