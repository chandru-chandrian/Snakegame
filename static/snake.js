const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [];
let food = {};
let direction = null;
let nextDirection = null;
let score = 0;
let game;
let level = 'medium';
let speed = 150;
let frameColor = 'orange';

function startGame() {
  level = document.getElementById("level").value;
  if (level === 'slow') { speed = 250; frameColor = 'green'; }
  else if (level === 'medium') { speed = 150; frameColor = 'orange'; }
  else { speed = 100; frameColor = 'red'; }

  canvas.style.borderColor = frameColor;
  resetGame();
  game = setInterval(draw, speed);
}

function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  food = randomFood();
  direction = null;
  nextDirection = null;
  score = 0;
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("message").innerHTML = "";
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  };
}

function mobileDir(dir) {
  if (dir === "LEFT" && direction !== "RIGHT") nextDirection = "LEFT";
  else if (dir === "UP" && direction !== "DOWN") nextDirection = "UP";
  else if (dir === "RIGHT" && direction !== "LEFT") nextDirection = "RIGHT";
  else if (dir === "DOWN" && direction !== "UP") nextDirection = "DOWN";
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  direction = nextDirection;

  for (let i = 0; i < snake.length; i++) {
    let color = i === 0 ? "#00FFCC" : "#33FF66";
    ctx.beginPath();
    ctx.roundRect(snake[i].x, snake[i].y, box, box, 6);
    ctx.fillStyle = color;
    ctx.fill();
  }

  // Draw food
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, 2 * Math.PI);
  ctx.fillStyle = "#FF3366";
  ctx.fill();

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  const ateFood = headX === food.x && headY === food.y;
  if (ateFood) {
    food = randomFood();
    score++;
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  if (
    headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height ||
    snake.some(seg => seg.x === headX && seg.y === headY)
  ) {
    clearInterval(game);
    showEndMessage(false);
    return;
  }

  snake.unshift(newHead);

  if (score >= 20 && level === 'slow') {
    clearInterval(game);
    document.getElementById("level").value = "medium";
    setTimeout(() => {
      startGame();
    }, 500);
  }

  if (score >= 20 && level === 'medium') {
    clearInterval(game);
    document.getElementById("level").value = "hard";
    setTimeout(() => {
      startGame();
    }, 500);
  }

  if (score >= 20 && level === 'hard') {
    clearInterval(game);
    showEndMessage(true);
  }

  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function showEndMessage(win) {
  document.getElementById("restartBtn").style.display = "inline-block";
  document.getElementById("message").innerHTML = win
    ? "<span style='color: #4caf50;'>🎉 Congrats! You won! 🎉</span>"
    : "<span style='color: #f44336;'>😢 Better luck next time!</span>";
}

function restartGame() {
  clearInterval(game);
  startGame();
}

// Polyfill for roundRect in case older browsers
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
};
