"use strict";

const canvasWidth = 600
const canvasHeight = canvasWidth
const orbitingPoint = {
    x: canvasWidth / 2,
    y: canvasWidth / 2,
    m: 10000
}

const subject = {
    x: 10, 
    y: 10,
    speedX: 10,
    speedY: 0,
    m: 10
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
        update();
        //Reduce the lag counter by the frame duration
        lag -= frameDuration;
    }
    //Calculate the lag offset and use it to render the sprites
    var lagOffset = lag / frameDuration;
    render(lagOffset);
}

function render(lagOffset) {
    ctx.fillStyle="black"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle="red"
    ctx.fillRect(subject.x, subject.y, 2, 2)
    // sprites.forEach(function(sprite){
    //   ctx.save();
    //   //Call the sprite's `render` method and feed it the
    //   //canvas context and lagOffset
    //   sprite.render(ctx, lagOffset);
    //   ctx.restore();
    // });
}

function update(){
    subject.x++
} 

// F = G * ( m1 * m2 / r**2)

/*

https://thepythoncodingbook.com/2021/09/29/simulating-orbiting-planets-in-a-solar-system-using-python-orbiting-planets-series-1/

def accelerate_due_to_gravity(
    first: SolarSystemBody,
    second: SolarSystemBody,
    ):
        force = first.mass * second.mass / first.distance(second) ** 2
        angle = first.towards(second)
        reverse = 1
        for body in first, second:
            acceleration = force / body.mass
            acc_x = acceleration * math.cos(math.radians(angle))
            acc_y = acceleration * math.sin(math.radians(angle))
            body.velocity = (
                body.velocity[0] + (reverse * acc_x),
                body.velocity[1] + (reverse * acc_y),
            )
            reverse = -1
*/