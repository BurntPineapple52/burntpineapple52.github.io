const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const gridSize = 20;
const canvasSize = 400;
const tileCount = canvasSize / gridSize;

let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];

let food = {};
let dx = gridSize; // Horizontal velocity
let dy = 0;        // Vertical velocity
let score = 0;
let gameStarted = false;
let gameInterval;
let changingDirection = false;

// Create initial food
createFood();

// Main game loop
function main() {
    if (isGameOver()) {
        endGame();
        return;
    }

    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100); // Game speed (lower is faster)
}

// Start the game
function startGame() {
    main();
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvasSize / 2, canvasSize / 2 - 20);
    ctx.fillText('Press Enter to Restart', canvasSize / 2, canvasSize / 2 + 20);
    gameStarted = false;

    // Add event listener for restart
    document.addEventListener('keydown', restartGame);
}

// Restart the game
function restartGame(event) {
    if (event.key === 'Enter' && !gameStarted) {
        document.removeEventListener('keydown', restartGame);
        resetGame();
        startGame();
    }
}

// Reset game state
function resetGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];
    dx = gridSize;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    createFood();
    gameStarted = true;
}


// Clear the canvas
function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
}

// Draw the snake
function drawSnake() {
    snake.forEach(drawSnakePart);
}

// Draw a single snake part
function drawSnakePart(part) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(part.x, part.y, gridSize, gridSize);
    ctx.strokeRect(part.x, part.y, gridSize, gridSize);
}

// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Unshift the new head to the beginning of the snake array
    snake.unshift(head);

    // Check for collision with food
    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        score += 10;
        scoreDisplay.textContent = 'Score: ' + score;
        createFood();
    } else {
        // Remove the last part of the snake
        snake.pop();
    }
}

// Generate random food position
function randomFoodPosition(min, max) {
    return Math.round((Math.random() * (max - min) + min) / gridSize) * gridSize;
}

// Create food
function createFood() {
    food = {
        x: randomFoodPosition(0, canvasSize - gridSize),
        y: randomFoodPosition(0, canvasSize - gridSize)
    };

    // If the new food location is on the snake, generate a new location
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsoOnSnake = part.x === food.x && part.y === food.y;
        if (foodIsoOnSnake) {
            createFood();
        }
    });
}

// Draw the food
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
}

// Check if the game is over
function isGameOver() {
    // Check for collision with itself
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // Check for collision with walls
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvasSize - gridSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvasSize - gridSize;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// Handle direction changes
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = gridSize;
    }

    // Start the game on the first key press if it hasn't started
    if (!gameStarted) {
        gameStarted = true;
        startGame();
    }
}

// Add event listener for key presses
document.addEventListener('keydown', changeDirection);
