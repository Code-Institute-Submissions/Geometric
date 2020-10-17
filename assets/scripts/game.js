var fullWith = $(window).width();
var fullHeight = $(window).height();

$(document).ready(function() {
    gameCanvas.create();
});

//Game Canvas
var gameCanvas = {
    canvas : document.createElement('canvas'),
    create : function() {  //Initial Creation
        //Full size of browser
        this.canvas.width  = fullWith;
        this.canvas.height = fullHeight;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        
        this.context = this.canvas.getContext("2d");

        //Removes vertical side scroller
        $('body').css('height', this.canvas.height);
    },
}