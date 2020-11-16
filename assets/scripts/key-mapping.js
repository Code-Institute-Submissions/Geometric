// Jump Key Selection
$('#jumpButton').click(function() {
    keyListenerStatas = 1; // Sets when the listener should be listening 0 = off 1 = On
    setTimeout(function(){toggleColor('jumpButton')}, 300); // Prevents double clicking
    keyListener(jumpButton);
    $('#controlsInstructions').html('<h3>Press a letter key A-Z</h3>'); // Add instructions
    $('#jumpButton').blur(); // Unfocuses the button to stop it being click again by spacebar
});

// Shoot Key Selection
$('#shootButton').click(function() {
    keyListenerStatas = 1; // Sets when the listener should be listening 0 = off 1 = On
    setTimeout(function(){toggleColor('shootButton')}, 300); // Prevents double clicking
    keyListener(shootButton); // Add instructions
    $('#controlsInstructions').html('<h3>Press a letter key A-Z</h3>')
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
                    jumpChar = String.fromCharCode(event.which) // Converts Code to Character
                    $("#jumpButton").html(`${jumpChar}`) // Shows it in the Button
                    $('#controlsInstructions').html('<h3>New Jump Key Set</h3>');  // Shows instruction

                }
                else if(button == shootButton) {
                    shootKey = event.which; // Sets new key
                    shootChar = String.fromCharCode(event.which) // Converts Code to Character
                    $("#shootButton").html(`${shootChar}`) // Shows it in the Button
                    $('#controlsInstructions').html('<h3>New Shoot Key Set</h3>'); // Shows instruction
                }

                stopFlash = true; // Turns off key listener indicator
                $(document).off('keydown', keyMap); // Removes this listener
                return
            }
        }
        else {
            return
        }
    })
}

// Default colour to get the flash started
var buttonColor = 'yellow';

// Flashing Button
var stopFlash = false;
function toggleColor(button) { // Take the button the user clicks
    $('body').click(function() { // Ends flash when the user clicks off the button
        stopFlash = true;
    });
    if (stopFlash == false) {

        if(buttonColor == 'yellow') {
        setTimeout(function(){
                if(button == 'jumpButton') {
                    $('#jumpButton').css("background-color", "white");
                }
                if(button == 'shootButton') {
                    $('#shootButton').css("background-color", "white");
                }
                buttonColor = 'yellow'
                toggleColor(button); // Self call
            }, 300); // How long the function is delayed
        }

        else {
            setTimeout(function(){
                if(button == 'jumpButton') {
                    $('#jumpButton').css("background-color", "yellow");
                }
                if(button == 'shootButton') {
                    $('#shootButton').css("background-color", "yellow");
                }
                
                buttonColor = 'white'
                toggleColor(button); // Self call
            }, 300); // How long the function is delayed
        }
    }
    else {
        $('#jumpButton').css("background-color", "white");
        $('#shootButton').css("background-color", "white");
        $('body').off('click') // removes listener
        stopFlash = false // Turns off flash
        keyListenerStatas = 0; // Turns off listener
        return
    }    
};