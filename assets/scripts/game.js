var fullWith = $(window).width();
var fullHeight = $(window).height();

$( document ).ready(function() {
    createCanvas();
});

//Game Area / Start
function createCanvas() {  //Initial Creation
    document.body.insertBefore(document.createElement('canvas'), document.body.childNodes[0]);  
};