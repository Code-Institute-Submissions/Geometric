var fullWith = $(window).width();
var fullHeight = $(window).height();

$( document ).ready(function() {
    gameCanvas.create();
});

//Game Canvas
var gameCanvas = {  //Initial Creation
    canvas : document.createElement('canvas'),
    create : function() {  //Initial Creation
        this.canvas.width  = fullWith;
        this.canvas.height = fullHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
};