const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

class SnakeBody {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 7;
let tiles = 20;
let tileSize = canvas.width / tiles - 8;
let headX = 10;
let headY = 10;
const snakeBody = [];
let tailLength = 0;

let fruitX = 5;
let fruitY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const gulp = new Audio("./resources/gulp.mp3");
const gOvr = new Audio("./resources/gameover.mp3");

function drawGame() {
    changeSnakePosition();

    let result = isGameOver();
    if (result) {
        gOvr.play();
        return;
    }

    clearScreen();
    checkFruitCollision();
    drawFruit();
    drawSnake();
    drawScore();

    if (score > 20) speed = 9;
    else if (score > 40) speed = 11;
    else if (score > 60) speed = 15;
    else if (score > 100) speed = 17;

    setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
    let gameOver = false;
    if (yVelocity === 0 && xVelocity === 0) return false;

    if (headX < 0 || headY < 0) gameOver = true;
    if (headX === 30 || headY === 30) gameOver = true;

    for (let i = 0; i < snakeBody.length; i++) {
        let part = snakeBody[i];
        if (headX === part.x && headY === part.y) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";
        ctx.fillText("GAME OVER", canvas.width / 4, canvas.height / 2);
    }

    return gameOver;
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "15px Verdana";
    ctx.fillText("Score: " + score, canvas.width - 80, 15);
}

function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "green";
    for (let i = 0; i < snakeBody.length; i++) {
        let part = snakeBody[i];
        ctx.fillRect(part.x * tiles, part.y * tiles, tileSize, tileSize);
    }

    snakeBody.push(new SnakeBody(headX, headY));
    if (snakeBody.length > tailLength) {
        snakeBody.shift();
    }

    ctx.fillStyle = "yellow";
    ctx.fillRect(headX * tiles, headY * tiles, tileSize, tileSize);
}

function changeSnakePosition() {
    headX += xVelocity;
    headY += yVelocity;
}

function drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(fruitX * tiles, fruitY * tiles, tileSize, tileSize);
}

function checkFruitCollision() {
    if (fruitX === headX && fruitY === headY) {
        fruitX = Math.floor(Math.random() * tiles);
        fruitY = Math.floor(Math.random() * tiles);
        tailLength++;
        score++;
        gulp.play();
    }
}

document.body.addEventListener("keydown", keyDown);
function keyDown(event) {
    // UP
    if (event.keyCode === 38) {
        if (yVelocity === 1) return; // To avoid collapse
        yVelocity = -1;
        xVelocity = 0;
    }

    // DOWN
    if (event.keyCode === 40) {
        if (yVelocity === -1) return; // To avoid collapse
        yVelocity = 1;
        xVelocity = 0;
    }

    // LEFT
    if (event.keyCode === 37) {
        if (xVelocity === 1) return; // To avoid collapse
        yVelocity = 0;
        xVelocity = -1;
    }

    // RIGHT
    if (event.keyCode === 39) {
        if (xVelocity === -1) return; // To avoid collapse
        yVelocity = 0;
        xVelocity = 1;
    }
}

drawGame();
