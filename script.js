const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const bestScoreText = document.getElementById("bestScore");
const finalScore = document.getElementById("finalScore");
const gameOver = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

let bestScore = localStorage.getItem("bestScore") || 0;
bestScoreText.innerText = bestScore;

let player = {
    x: 350,
    y: 250,
    radius: 12,
    speed: 4,
    dx: 0,
    dy: 0
};

let food = randomFood();

let score = 0;
let running = true;

function randomFood() {
    return {
        x: Math.random() * (canvas.width - 40) + 20,
        y: Math.random() * (canvas.height - 40) + 20,
        radius: 8
    };
}

document.addEventListener("keydown", (e) => {

    if (e.key === "ArrowUp") {
        player.dx = 0;
        player.dy = -player.speed;
    }

    if (e.key === "ArrowDown") {
        player.dx = 0;
        player.dy = player.speed;
    }

    if (e.key === "ArrowLeft") {
        player.dx = -player.speed;
        player.dy = 0;
    }

    if (e.key === "ArrowRight") {
        player.dx = player.speed;
        player.dy = 0;
    }

}); 


function drawFood() {

    ctx.beginPath();
    ctx.fillStyle = "yellow";

    // Shadow remove
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
    ctx.fill();

}
function drawPlayer() {

    ctx.beginPath();
    ctx.fillStyle = "#4fdcff";

    // Shadow remove
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

}
function update() {

    if (!running) return;

    player.x += player.dx;
    player.y += player.dy;

    if (
        player.x < player.radius ||
        player.x > canvas.width - player.radius ||
        player.y < player.radius ||
        player.y > canvas.height - player.radius
    ) {

        running = false;

        finalScore.innerText = score;
        gameOver.classList.remove("hide");

        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("bestScore", bestScore);
            bestScoreText.innerText = bestScore;
        }

    }

    let dx = player.x - food.x;
    let dy = player.y - food.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.radius + food.radius) {

        score++;
        scoreText.innerText = score;

        player.radius += 1;

        food = randomFood();

    }

}

function drawGrid() {

    ctx.strokeStyle = "#16253a";

    for (let i = 0; i < canvas.width; i += 25) {

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

    }

    for (let i = 0; i < canvas.height; i += 25) {

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();

    }

}

function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    update();

    drawFood();

    drawPlayer();

    requestAnimationFrame(gameLoop);

}

gameLoop();

restartBtn.onclick = function () {

    score = 0;
    scoreText.innerText = 0;

    player.x = 350;
    player.y = 250;
    player.radius = 12;
    player.dx = 0;
    player.dy = 0;

    food = randomFood();

    running = true;

    gameOver.classList.add("hide");

};
// ===== Mobile Swipe Controls =====
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, false);

document.addEventListener("touchend", function (e) {

    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30 && direction !== "left") {
            direction = "right";
        } else if (dx < -30 && direction !== "right") {
            direction = "left";
        }
    } else {
        if (dy > 30 && direction !== "up") {
            direction = "down";
        } else if (dy < -30 && direction !== "down") {
            direction = "up";
        }
    }

}, false);