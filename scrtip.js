"use strict";

const canvasWidth = 1000
const canvasHeight = canvasWidth
const orbitingPoint = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    m: 1000
}
const g = 50
const points =[]
const nPoints = 1000
const maxSecondsOutside = 300

const minMaxRadius = [5,30]
const minMaxX = [0, canvasWidth]
const minMaxY = [0, 0]
const minMaxSpeedX = [6, 6]
const minMaxSpeedY = [0, 0]
const minMaxMass = [2000, 2000]

const minMaxHue = [0, 365]
const minMaxSaturation = [80, 80]
const minMaxLightness = [50, 50]

const inside = document.getElementById("inside")
const rendered = document.getElementById("rendered")

for(let i = 0; i < nPoints; i++){
    // const hue = Math.round(Math.random() * (minMaxHue[1] - minMaxHue[0]) + minMaxHue[0])
    const hue = 365 / nPoints * i
    const saturation = Math.round(Math.random() * (minMaxSaturation[1] - minMaxSaturation[0]) + minMaxSaturation[0])
    const lightness = Math.round(Math.random() * (minMaxLightness[1] - minMaxLightness[0]) + minMaxLightness[0])
    const hueString = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    points.push({
        // x: Math.random() * (minMaxX[1] - minMaxX[0]) + minMaxX[0],
        x: canvasWidth / nPoints * i - canvasWidth,
        // y: Math.random() * (minMaxY[1] - minMaxY[0]) + minMaxY[0],
        y: 0,
        // r: Math.floor(Math.random() * (minMaxRadius[1] - minMaxRadius[0]) + minMaxRadius[0]),
        r: 40 / nPoints * i + 1,
        // m: Math.random() * (minMaxMass[1] - minMaxMass[0]) + minMaxMass[0],
        m: 2000,
        // speedX: Math.random() * (minMaxSpeedX[1] - minMaxSpeedX[0]) + minMaxSpeedX[0],
        speedX: 6,
        // speedY: Math.random() * (minMaxSpeedY[1] - minMaxSpeedY[0]) + minMaxSpeedY[0],
        speedY: 0,
        framesOutside: 0,
        color: hueString
    })
}  

const canvas = document.getElementById("canvas")
canvas.width = canvasWidth
canvas.height = canvasHeight
const ctx = canvas.getContext("2d")
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

ctx.fillStyle="white"
    ctx.fillRect(orbitingPoint.x, orbitingPoint.y, 1, 1);


var fps = 60,
    start = Date.now(),
    frameDuration = 1000 / fps,
    lag = 0;
    const maxFramesOutside = fps * maxSecondsOutside

    gameLoop();

function gameLoop() {
    requestAnimationFrame(gameLoop, canvas);

    //Calcuate the time that has elapsed since the last frame
    var current = Date.now(),
        elapsed = current - start;
    start = current;
    //Add the elapsed time to the lag counter
    lag += elapsed;
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
    ctx.fillStyle="white"
    ctx.fillRect(orbitingPoint.x, orbitingPoint.y, 1, 1);
    for(const point of points){
        ctx.beginPath()
        ctx.fillStyle=point.color
        ctx.arc(point.x, point.y, point.r, 0, 360)
        ctx.fill();
        ctx.fillRect(point.x, point.y, 2, 2)
        ctx.closePath()
    }
    // sprites.forEach(function(sprite){
    //   ctx.save();
    //   //Call the sprite's `render` method and feed it the
    //   //canvas context and lagOffset
    //   sprite.render(ctx, lagOffset);
    //   ctx.restore();
    // });
}

function update(){
    const canvasContainer = document.getElementById("canvas-container")
    // subject.x++
    let pointsOnScreen = 0
    for(let i = 0; i < points.length; i++){
        const point = points[i]
        onewayGravitationalAcceleration(point)
        if(isOutside(point)){
            if(point.framesOutside > maxFramesOutside){
                points.splice(i, 1)
            }
        } else {
            pointsOnScreen++
        }
    }
    let collided = false
    // for(let i = 0; i < points.length-1; i++){
    //     for(let j = i+1; j < points.length; j++){
    //         const res = handleCollision(points[i], points[j])
    //         if(res) collided = true
    //     }
    // }
    rendered.innerHTML = points.length
    inside.innerHTML = pointsOnScreen
    
} 

function isOutside(point){
    const outside = point.x < 0 || point.x > canvasWidth || point.y < 0 || point.x > canvasHeight
    if(!outside) {
        point.framesOutside = 0
        return false
    }
    point.framesOutside++
    return true
}

function onewayGravitationalAcceleration(planet){
    const distance = Math.sqrt((planet.x - orbitingPoint.x)**2 + (planet.y - orbitingPoint.y)**2)
    const force = (planet.m * orbitingPoint.m) / (distance ** 2) * g
    const angle = Math.atan2( orbitingPoint.y - planet.y, orbitingPoint.x - planet.x )
    const acceleration = force / planet.m
    const accX = acceleration * Math.cos(angle)
    const accY = acceleration * Math.sin(angle)
    planet.speedX += accX
    planet.speedY += accY
    planet.x += planet.speedX
    planet.y += planet.speedY
    
}

function handleCollision(p1, p2){
    const distance = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2)
    const minDistance = p1.r + p2.r
    if(distance > p1.r + p2.r) return false
    const angle = Math.atan2( p1.y - p2.y, p1.x - p2.x )
    return true
}

