const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let direction = {x: 0, y: 0};
let score = 0;
let gameSpeed = 100;
let gameTimeout;

const speedInput = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');

function updateSpeed(newSpeed) {
  newSpeed = Math.max(50, Math.min(300, newSpeed)); // 确保在50-300范围内
  gameSpeed = newSpeed;
  speedInput.value = gameSpeed;
  speedValue.textContent = `${gameSpeed}ms`;
  clearTimeout(gameTimeout);
  gameLoop();
}

speedInput.addEventListener('input', () => {
  updateSpeed(Number(speedInput.value));
});

document.getElementById('speedUp').addEventListener('click', () => {
  updateSpeed(gameSpeed - 10);
});

document.getElementById('speedDown').addEventListener('click', () => {
  updateSpeed(gameSpeed + 10);
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    updateSpeed(gameSpeed - 10);
  } else if (e.key === 'ArrowLeft') {
    updateSpeed(gameSpeed + 10);
  }
});

function gameLoop() {
  update();
  draw();
  gameTimeout = setTimeout(gameLoop, gameSpeed);
}

function update() {
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

  // 检查碰撞
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
      snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    resetGame();
    return;
  }

  snake.unshift(head);

  // 检查是否吃到食物
  if (head.x === food.x && head.y === food.y) {
    score++;
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  // 清空画布
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 画蛇
  ctx.fillStyle = '#4CAF50';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // 画食物
  ctx.fillStyle = '#FF5252';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // 显示分数
  ctx.fillStyle = '#333';
  ctx.font = '20px Arial';
  ctx.fillText(`分数: ${score}`, 10, 30);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };

  // 确保食物不会生成在蛇身上
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  }
}

function resetGame() {
  snake = [{x: 10, y: 10}];
  direction = {x: 0, y: 0};
  score = 0;
  placeFood();
}

function handleKeyDown(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = {x: 0, y: -1};
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = {x: 0, y: 1};
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = {x: -1, y: 0};
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = {x: 1, y: 0};
      break;
  }
}

window.addEventListener('keydown', handleKeyDown);

// 添加按钮事件监听
document.getElementById('upBtn').addEventListener('click', () => {
  if (direction.y === 0) direction = {x: 0, y: -1};
});

document.getElementById('downBtn').addEventListener('click', () => {
  if (direction.y === 0) direction = {x: 0, y: 1};
});

document.getElementById('leftBtn').addEventListener('click', () => {
  if (direction.x === 0) direction = {x: -1, y: 0};
});

document.getElementById('rightBtn').addEventListener('click', () => {
  if (direction.x === 0) direction = {x: 1, y: 0};
});

placeFood();
gameLoop();
