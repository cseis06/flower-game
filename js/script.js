var time = new Date();
var deltaTime = 0;
var groundX = 0;
var speedGround = 1280 / 3; 
var groundWidth = 920 * 2; 
var stopped = false;


if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);
} else {
    document.addEventListener("DOMContentLoaded", Init);
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    if (stopped) return;

    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    
    Update();
    requestAnimationFrame(Loop);
}


var groundY = 22;
var speedY = 0;
var impulse = 900;
var gravity = 2500;

var flowerPosX = 42;
var flowerPosY = groundY;
var speedGround = 1280/3;
var gameSpeed = 1;
var score = 0;

var stand = false;
var jump = false;

var timeToObstacle = 2;
var timeObstacleMin = 0.7;
var timeObstacleMax = 1.8;  
var obstaclePosX = 16;
var obstacles = [];

var container;
var flower;
var txtScore; 
var ground;
var gameOver;

var clouds = [];
var timeToCloud = 4;
var timeCloudMin = 2; 
var timeCloudMax = 5;

function createCloud() {
    var cloud = document.createElement('div');
    container.appendChild(cloud);
    cloud.classList.add("cloud");

    cloud.style.top = Math.floor(Math.random() * (container.clientHeight / 2)) + "px";

    cloud.posX = container.clientWidth;
    cloud.style.left = cloud.posX + "px";

    clouds.push(cloud);
    timeToCloud = timeCloudMin + Math.random() * (timeCloudMax - timeCloudMin);
}

function moveCloud() {
    for (var i = clouds.length - 1; i >= 0; i--) {
        if (clouds[i].posX < -clouds[i].clientWidth) {
            clouds[i].parentNode.removeChild(clouds[i]);
            clouds.splice(i, 1);
        } else {
            clouds[i].posX -= calculeDisplacement() / 2; 
            clouds[i].style.left = clouds[i].posX + "px";
        }
    }
}

function chooseCreateCloud() {
    timeToCloud -= deltaTime;
    if (timeToCloud <= 0) {
        createCloud();
    }
}


function Start() {
    gameOver = document.querySelector(".game-over");
    ground = document.querySelector(".ground");
    container = document.querySelector(".container");
    flower = document.querySelector(".flower");
    txtScore = document.querySelector(".score");

    document.addEventListener("keydown", HandleKeyDown);
}

function HandleKeyDown(ev) {
    if (ev.keyCode == 32) { 
        Jump();
    }
}

function Jump() {
    if (flowerPosY === groundY) { 
        jump = true;
        speedY = impulse;

        flower.classList.remove("flower-walk");
        flower.classList.add("flower-jump");
    }
}

function Update() {
    if (stopped) return;

    moveGround();
    moveFlower();
    moveObstacle();
    chooseCreateObstacle();
    detectCollision(); 
    speedY -= gravity * deltaTime;
}


function moveGround() {
    groundX -= calculeDisplacement(); 
    if (groundX <= -container.clientWidth) { 
        groundX = 0; 
    }
    ground.style.left = groundX + "px"; 
}

function calculeDisplacement() {
    return speedGround * deltaTime; 
}

function moveFlower() {
    flowerPosY += speedY * deltaTime;
    if (flowerPosY < groundY) {
        TouchGround();
    }

    flower.style.bottom = flowerPosY + "px";
}

function TouchGround() {
    flowerPosY = groundY;
    speedY = 0;

    if (jump) {
        flower.classList.remove("flower-jump");
        flower.classList.add("flower-walk");
    }
    jump = false;
}

function chooseCreateObstacle() {
    timeToObstacle -= deltaTime;
    if (timeToObstacle <= 0) {
        createObstacle();
    }
}

function createObstacle() {
    var obstacle = document.createElement('div');
    container.appendChild(obstacle);
    obstacle.classList.add("cactus");
    obstacle.posX = container.clientWidth;
    obstacle.style.left = obstacle.posX + "px";

    obstacles.push(obstacle);
    timeToObstacle = timeObstacleMin + Math.random() * (timeObstacleMax - timeObstacleMin) / gameSpeed;
}


function moveObstacle() {
    for (var i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].posX < -obstacles[i].clientWidth) {
            obstacles[i].parentNode.removeChild(obstacles[i]);
            obstacles.splice(i, 1);
            winPoints();
        } else {
            obstacles[i].posX -=calculeDisplacement();
            obstacles[i].style.left = obstacles[i].posX + "px";
        }
    }
}

function winPoints() {
    score++;
    txtScore.innerText = score;
}

function detectCollision() {
    for (var i = 0; i < obstacles.length; i++) {
        if (obstacles[i].posX < flowerPosX + flower.clientWidth) { 
            if (IsCollision(flower, obstacles[i])) {
                GameOver();
                break; 
            }
        }
    }
}


function IsCollision(a, b, paddingTop = 0, paddingRight = 0, paddingBottom = 0, paddingLeft = 0) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        (aRect.bottom - paddingBottom < bRect.top) || 
        (aRect.top + paddingTop > bRect.bottom) || 
        (aRect.right - paddingRight < bRect.left) || 
        (aRect.left + paddingLeft > bRect.right) 
    );
}


function GameOver() {
    Colide();
    gameOver.style.display = "block";  
    flower.classList.remove("flower-walk", "flower-jump");  
    flower.classList.add("flower-stop"); 
    stopped = true; 
}




function Colide() {
    flower.classList.remove("flower-walk");
    flower.classList.add("flower-stop");
    stopped = true;
}

function restartGame() {
    score = 0;
    flowerPosY = groundY;
    speedY = 0;
    obstacles = [];
    stopped = false;

    let cactusElements = document.querySelectorAll(".cactus");
    cactusElements.forEach(function(cactus) {
        cactus.parentNode.removeChild(cactus);
    });

    gameOver.style.display = "none";

    flower.classList.remove("flower-stop");
    flower.classList.add("flower-walk");

    groundX = 0;

    txtScore.innerText = score;

    time = new Date(); 
    Loop();
}
