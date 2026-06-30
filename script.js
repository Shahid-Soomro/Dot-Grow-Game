/* ==========================================
   DOT HUNTER GAME
   SCRIPT.JS - PART 1
   Game Setup + Variables
========================================== */

// ==========================
// Canvas
// ==========================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ==========================
// UI Elements
// ==========================

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const restartBtn = document.getElementById("restartBtn");

const gameOverBox = document.getElementById("gameOverBox");
const finalScore = document.getElementById("finalScore");
const playAgainBtn = document.getElementById("playAgainBtn");

// ==========================
// Canvas Size
// ==========================

const GAME_SIZE = 600;

canvas.width = GAME_SIZE;
canvas.height = GAME_SIZE;

// ==========================
// Game Variables
// ==========================

let score = 0;

let highScore =
Number(localStorage.getItem("dotHunterHighScore")) || 0;

highScoreEl.textContent = highScore;

let gameRunning = true;

let animationId = null;

// ==========================
// Player
// ==========================

const player = {

    x: GAME_SIZE / 2,

    y: GAME_SIZE / 2,

    radius: 12,

    color: "#00E5FF",

    speed: 4,

    dx: 0,

    dy: 0

};

// ==========================
// Food
// ==========================

const food = {

    x: 0,

    y: 0,

    radius: 8,

    color: "#FF2D55"

};

// ==========================
// Touch Variables
// ==========================

let touchStartX = 0;
let touchStartY = 0;

let touchEndX = 0;
let touchEndY = 0;

// ==========================
// Random Number
// ==========================

function random(min, max){

    return Math.floor(Math.random() * (max - min)) + min;

}

// ==========================
// Distance
// ==========================

function getDistance(x1,y1,x2,y2){

    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);

}

// ==========================
// Food Spawn
// ==========================

function createFood(){

    let validPosition = false;

    while(!validPosition){

        food.x = random(30, GAME_SIZE - 30);

        food.y = random(30, GAME_SIZE - 30);

        const distance = getDistance(

            player.x,
            player.y,

            food.x,
            food.y

        );

        if(distance > player.radius + 60){

            validPosition = true;

        }

    }

}

// ==========================
// Update Score
// ==========================

function updateScore(){

    scoreEl.textContent = score;

    highScoreEl.textContent = highScore;

}

// ==========================
// Initial Setup
// ==========================

createFood();

updateScore();
/* ==========================================
   DOT HUNTER GAME
   SCRIPT.JS - PART 2
   Drawing & Render Engine
========================================== */

// ==========================
// Draw Background
// ==========================

function drawBackground(){

    ctx.clearRect(0,0,GAME_SIZE,GAME_SIZE);

    ctx.fillStyle="#05070F";

    ctx.fillRect(0,0,GAME_SIZE,GAME_SIZE);

}

// ==========================
// Draw Food
// ==========================

function drawFood(){

    ctx.save();

    ctx.beginPath();

    ctx.shadowBlur=0;
    ctx.shadowColor="transparent";

    ctx.fillStyle=food.color;

    ctx.arc(

        food.x,

        food.y,

        food.radius,

        0,

        Math.PI*2

    );

    ctx.fill();

    ctx.closePath();

    ctx.restore();

}

// ==========================
// Draw Player
// ==========================

function drawPlayer(){

    ctx.save();

    ctx.beginPath();

    /* Shadow Removed */

    ctx.shadowBlur=0;

    ctx.shadowColor="transparent";

    ctx.fillStyle=player.color;

    ctx.arc(

        player.x,

        player.y,

        player.radius,

        0,

        Math.PI*2

    );

    ctx.fill();

    ctx.closePath();

    ctx.restore();

}

// ==========================
// Render Game
// ==========================

function renderGame(){

    drawBackground();

    drawFood();

    drawPlayer();

    updateScore();

}

// ==========================
// Initial Render
// ==========================

renderGame();
/* ==========================================
   DOT HUNTER GAME
   SCRIPT.JS - PART 3
   Keyboard + Touch Controls + Game Loop
========================================== */

// ==========================
// Keyboard Controls
// ==========================

document.addEventListener("keydown",(e)=>{

    switch(e.key.toLowerCase()){

        case "arrowup":
        case "w":

            player.dx=0;
            player.dy=-player.speed;

        break;

        case "arrowdown":
        case "s":

            player.dx=0;
            player.dy=player.speed;

        break;

        case "arrowleft":
        case "a":

            player.dx=-player.speed;
            player.dy=0;

        break;

        case "arrowright":
        case "d":

            player.dx=player.speed;
            player.dy=0;

        break;

    }

});

// ==========================
// Mobile Touch Controls
// ==========================

canvas.addEventListener("touchstart",(e)=>{

    touchStartX=e.touches[0].clientX;
    touchStartY=e.touches[0].clientY;

},{passive:true});

canvas.addEventListener("touchend",(e)=>{

    touchEndX=e.changedTouches[0].clientX;
    touchEndY=e.changedTouches[0].clientY;

    const dx=touchEndX-touchStartX;
    const dy=touchEndY-touchStartY;

    if(Math.abs(dx)>Math.abs(dy)){

        if(dx>0){

            player.dx=player.speed;
            player.dy=0;

        }else{

            player.dx=-player.speed;
            player.dy=0;

        }

    }else{

        if(dy>0){

            player.dx=0;
            player.dy=player.speed;

        }else{

            player.dx=0;
            player.dy=-player.speed;

        }

    }

},{passive:true});

// ==========================
// Move Player
// ==========================

function movePlayer(){

    player.x+=player.dx;
    player.y+=player.dy;

}

// ==========================
// Main Game Loop
// ==========================

function gameLoop(){

    if(!gameRunning){

        cancelAnimationFrame(animationId);

        return;

    }

    movePlayer();

    checkFoodCollision();

    checkBorderCollision();

    renderGame();

    animationId=requestAnimationFrame(gameLoop);

}

// ==========================
// Start Game
// ==========================

gameLoop();
/* ==========================================
   DOT HUNTER GAME
   SCRIPT.JS - PART 4
   Collision + Game Over + Restart
========================================== */

// ==========================
// Food Collision
// ==========================

function checkFoodCollision() {

    const distance = getDistance(
        player.x,
        player.y,
        food.x,
        food.y
    );

    if (distance <= player.radius + food.radius) {

        score++;

        player.radius += 0.6;

        if (player.speed < 10) {
            player.speed += 0.05;
        }

        createFood();

    }

}

// ==========================
// Border Collision
// ==========================

function checkBorderCollision() {

    if (

        player.x - player.radius <= 0 ||
        player.x + player.radius >= GAME_SIZE ||
        player.y - player.radius <= 0 ||
        player.y + player.radius >= GAME_SIZE

    ) {

        gameOver();

    }

}

// ==========================
// Game Over
// ==========================

function gameOver() {

    if (!gameRunning) return;

    gameRunning = false;

    cancelAnimationFrame(animationId);

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "dotHunterHighScore",
            highScore
        );

    }

    updateScore();

    finalScore.textContent = score;

    gameOverBox.style.display = "flex";

}

// ==========================
// Restart Game
// ==========================

function restartGame() {

    gameOverBox.style.display = "none";

    score = 0;

    player.x = GAME_SIZE / 2;
    player.y = GAME_SIZE / 2;

    player.radius = 12;

    player.speed = 4;

    player.dx = 0;
    player.dy = 0;

    gameRunning = true;

    createFood();

    updateScore();

    renderGame();

    gameLoop();

}

// ==========================
// Restart Buttons
// ==========================

restartBtn.addEventListener("click", restartGame);

playAgainBtn.addEventListener("click", restartGame);