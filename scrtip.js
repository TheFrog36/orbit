"use strict";

const canvasWidth = 1000
const canvasHeight = canvasWidth
const orbitingPoint1 = {
    x: canvasWidth * 1/4,
    y: canvasHeight / 2,
    m: 1
}
const orbitingPoint2 = {
    x: canvasWidth * 3/4,
    y: canvasHeight / 2,
    m: 1
}


const orbitingPoints = [orbitingPoint1, orbitingPoint2]

const g = 5000
const points =[]
const nPoints = 100
const maxSecondsOutside = 10
const minStabilitySeconds = 30
let stable = 0
const minMaxRadius = [5,30]
const minMaxX = [0, canvasWidth]
const minMaxY = [0, canvasHeight]
const minMaxSpeedX = [-4, 4]
const minMaxSpeedY = [-4, 4]
const minMaxMass = [1, 1]
const minMaxG = [500, 2000]

const minMaxHue = [230, 250]
const minMaxSaturation = [70, 100]
const minMaxLightness = [40, 60]

const inside = document.getElementById("inside")
const rendered = document.getElementById("rendered")
const stability = document.getElementById("stability")
const stableOnScreen = document.getElementById('stable-on-screen')
const mostStable = document.getElementById("most-stable")

let countMostStable = 0

for(let i = 0; i < nPoints; i++){
    points.push(generateRandomPoint())

    // const hue = 180 + 100 / nPoints * i
    // const hue = 0
    // const saturation = 0
    // const lightness = 100 / nPoints * i
    // const hueString = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    // points.push({
    //     x: canvasWidth / nPoints * i,
    //     y: 0 ,
    //     // r: 30 / nPoints * i,
    //     r: 10,
    //     m: 1 ,
    //     speedX: 2,
    //     speedY: 0,
    //     framesOutside: 0,
    //     color: hueString,
    //     g: 2000
    // })
}  

function generateRandomPoint(){
    const hue = Math.round(Math.random() * (minMaxHue[1] - minMaxHue[0]) + minMaxHue[0])
    const saturation = Math.round(Math.random() * (minMaxSaturation[1] - minMaxSaturation[0]) + minMaxSaturation[0])
    const lightness = Math.round(Math.random() * (minMaxLightness[1] - minMaxLightness[0]) + minMaxLightness[0])
    const hueString = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    const xOrY = Math.random() > 0.5? true : false
    let x, y
    if(xOrY){
        x = Math.random() > 0.5 ? - 60 : canvasWidth + 60
        y = Math.random() * (minMaxY[1] - minMaxY[0]) + minMaxY[0]
    } else {
        x = Math.random() * (minMaxX[1] - minMaxX[0]) + minMaxX[0]
        y = Math.random() > 0.5 ? - 60 : canvasHeight + 60
    }
    return {
        x,
        y,
        r: Math.floor(Math.random() * (minMaxRadius[1] - minMaxRadius[0]) + minMaxRadius[0]),
        m: Math.random() * (minMaxMass[1] - minMaxMass[0]) + minMaxMass[0],
        speedX: Math.random() * (minMaxSpeedX[1] - minMaxSpeedX[0]) + minMaxSpeedX[0],
        speedY: Math.random() * (minMaxSpeedY[1] - minMaxSpeedY[0]) + minMaxSpeedY[0],
        framesOutside: 0,
        color: hueString,
        g: Math.random() * (minMaxG[1] - minMaxG[0]) + minMaxG[0],
        stability: 0,
        isStable: false
    }
}


const canvas = document.getElementById("canvas")
canvas.width = canvasWidth
canvas.height = canvasHeight
const ctx = canvas.getContext("2d")
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

ctx.fillStyle="white"
// ctx.fillRect(orbitingPoint.x, orbitingPoint.y, 1, 1);
    for(const orbP of orbitingPoints){
        ctx.fillRect(orbP.x, orbP.y, 3, 3);
    }

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
    // ctx.fillStyle="black"
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle="white"
    for(const orbP of orbitingPoints){
        ctx.fillRect(orbP.x, orbP.y, 1, 1);
    }

    for(let i = 0; i < points.length; i++){
        const point = points[points.length - 1 - i]
        
        if(point.isStable && point.stability != countMostStable){
            ctx.beginPath()
            ctx.fillStyle = "red"
            ctx.arc(point.x, point.y, point.r + 2, 0, 360)
            ctx.fill();
            ctx.closePath()
        }
        ctx.beginPath()

        ctx.fillStyle= point.stability == countMostStable && point.isStable ? "cyan" : point.color
        ctx.arc(point.x, point.y, point.r, 0, 360)
        ctx.fill();
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
    let countMostStableTemp = 0
    let countStableOnScreen = 0
    for(let i = 0; i < points.length; i++){
        const point = points[i]
        point.stability++
        if(point.stability > countMostStableTemp) {
            countMostStableTemp = point.stability
        }
        if(!point.isStable && point.stability > minStabilitySeconds * fps) {
            stable++
            point.isStable = true
        }
        for(const orbP of orbitingPoints){
            onewayGravitationalAcceleration(point, orbP)
        }
        if(isOutside(point)){
            if(point.framesOutside > maxFramesOutside){
                points.splice(i, 1)
                if(point.isStable)
                    stable--
            }
        } else {
            pointsOnScreen++
            if(point.isStable) countStableOnScreen++
        }
    }
    for(let i = 0; i < nPoints - points.length; i++){
        points.push(generateRandomPoint())
        pointsOnScreen++
    }
    let collided = false
    // for(let i = 0; i < points.length-1; i++){
    //     for(let j = i+1; j < points.length; j++){
    //         const res = handleCollision(points[i], points[j])
    //         if(res) collided = true
    //     }
    // }
    mostStable.innerHTML = countMostStableTemp
    stableOnScreen.innerHTML = countStableOnScreen
    stability.innerHTML = stable
    rendered.innerHTML = points.length
    inside.innerHTML = pointsOnScreen
    countMostStable = countMostStableTemp
} 

function isOutside(point){
    const outside = point.x < 0 || point.x > canvasWidth || point.y < 0 || point.y > canvasHeight
    if(!outside) {
        point.framesOutside = 0
        return false
    }
    point.framesOutside++
    return true
}

function onewayGravitationalAcceleration(planet, orbitingPoint){
    const distance = Math.sqrt((planet.x - orbitingPoint.x)**2 + (planet.y - orbitingPoint.y)**2)
    const force = planet.g * ((planet.m * orbitingPoint.m) / (distance ** 2))
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

