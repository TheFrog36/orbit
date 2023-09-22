"use strict";

const canvasWidth = 600
const canvasHeight = canvasWidth
const orbitingPoint = {
    x: canvasWidth / 2,
    y: canvasWidth / 2
}

const subject = {
    x: 10, 
    y: 10,
    speedX: 10,
    speedY: 0       
}

const canvas = document.getElementById("canvas")
canvas.width = canvasWidth
canvas.height = canvasHeight
const ctx = canvas.getContext("2d")
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasWidth, canvasHeight);


var fps = 60,
    //Get the start time
    start = Date.now(),
    //Set the frame duration in milliseconds
    frameDuration = 1000 / fps,
    //Initialize the lag offset
    lag = 0;

    gameLoop();

function gameLoop() {
    requestAnimationFrame(gameLoop, canvas);

    //Calcuate the time that has elapsed since the last frame
    var current = Date.now(),
        elapsed = current - start;
    start = current;
    //Add the elapsed time to the lag counter
    lag += elapsed;

    //Update the frame if the lag counter is greater than or
    //equal to the frame duration
    while (lag >= frameDuration){  
        //Update the logic
        // update();
        //Reduce the lag counter by the frame duration
        lag -= frameDuration;
    }
    //Calculate the lag offset and use it to render the sprites
    var lagOffset = lag / frameDuration;
    render(lagOffset);
}

function render(lagOffset) {
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    // sprites.forEach(function(sprite){
    //   ctx.save();
    //   //Call the sprite's `render` method and feed it the
    //   //canvas context and lagOffset
    //   sprite.render(ctx, lagOffset);
    //   ctx.restore();
    // });
  }