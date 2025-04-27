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
let changingDirection = false;

// High Score variables
const highScoreKey = 'snakeHighScore';
let highScore = localStorage.getItem(highScoreKey) || 0;

// Explosion effect variables
let explosion = { active: false, x: 0, y: 0, radius: 0, maxRadius: 30, step: 3 };
let explosionTimer;

// Display high score initially
updateHighScoreDisplay();

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
        drawSnake();
        moveSnake(); // Move after drawing to avoid seeing the popped tail initially
        updateExplosion(); // Update explosion state
        drawExplosion(); // Draw explosion if active
        main();
    }, 100); // Game speed (lower is faster)
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvasSize / 2, canvasSize / 2 - 40);
    ctx.fillText('Your Score: ' + score, canvasSize / 2, canvasSize / 2);

    // Update high score if necessary
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(highScoreKey, highScore);
        updateHighScoreDisplay();
        ctx.fillText('New High Score!', canvasSize / 2, canvasSize / 2 + 40);
    } else {
        ctx.fillText('High Score: ' + highScore, canvasSize / 2, canvasSize / 2 + 40);
    }

    ctx.font = '20px Arial';
    ctx.fillText('Press Enter to Restart', canvasSize / 2, canvasSize / 2 + 80);


    gameStarted = false;

    // Add event listener for restart
    document.addEventListener('keydown', restartGame);
}

// Restart the game
function restartGame(event) {
    if (event.key === 'Enter' && !gameStarted) {
        document.removeEventListener('keydown', restartGame);
        resetGame();
        startGame(); // Start the game loop again
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
    explosion.active = false; // Ensure explosion is not active on reset
    gameStarted = true; // Set gameStarted to true before starting the loop
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

    // Check for collision with food BEFORE moving the head fully
    const didEatFood = head.x === food.x && head.y === food.y;

    // Unshift the new head to the beginning of the snake array
    snake.unshift(head);

    if (didEatFood) {
        score += 10;
        scoreDisplay.textContent = 'Score: ' + score;
        startExplosion(food.x + gridSize / 2, food.y + gridSize / 2); // Start explosion at food center
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
        startGame(); // Start the game loop
    }
}

// Update the high score display on the screen
function updateHighScoreDisplay() {
    const highScoreElement = document.getElementById('highScore');
    if (highScoreElement) {
        highScoreElement.textContent = 'High Score: ' + highScore; // Update existing
    } else {
        const newHighScoreElement = document.createElement('div');
        newHighScoreElement.id = 'highScore'; // Give it an ID for potential styling
        newHighScoreElement.textContent = 'High Score: ' + highScore;

        // Find the element where the score is displayed and insert the high score before it
        const scoreContainer = scoreDisplay.parentElement;
        scoreContainer.insertBefore(newHighScoreElement, scoreDisplay); // Add new

        // Add some basic styling
        newHighScoreElement.style.textAlign = 'center';
        newHighScoreElement.style.marginBottom = '10px';
        newHighScoreElement.style.fontSize = '1.2em';
    }
}

// --- Explosion Effect Functions ---

// Start the explosion effect
function startExplosion(x, y) {
    explosion.active = true;
    explosion.x = x;
    explosion.y = y;
    explosion.radius = 0; // Start with no radius

    // Reset timer and start a new one to control the explosion duration
    clearTimeout(explosionTimer);
    explosionTimer = setTimeout(() => {
        explosion.active = false; // Deactivate explosion after a duration
    }, 300); // Adjust duration (in milliseconds) as needed
}

// Update the state of the explosion
function updateExplosion() {
    if (explosion.active) {
        explosion.radius += explosion.step;
        if (explosion.radius >= explosion.maxRadius) {
            explosion.active = false; // Explosion is finished
        }
    }
}

// Draw the explosion effect
function drawExplosion() {
    if (explosion.active) {
        // You can draw multiple rings or a single expanding shape
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 165, 0, ' + (1 - explosion.radius / explosion.maxRadius) + ')'; // Orange with decreasing opacity
        ctx.fill();

        // You could add more rings or different colors
        if (explosion.radius > explosion.step * 2) {
             ctx.beginPath();
             ctx.arc(explosion.x, explosion.y, explosion.radius - explosion.step * 2, 0, Math.PI * 2);
             ctx.fillStyle = 'rgba(255, 255, 0, ' + (1 - explosion.radius / explosion.maxRadius) + ')'; // Yellow
             ctx.fill();
        }
    }
}

// --- End Explosion Effect Functions ---


// Add event listener for key presses
document.addEventListener('keydown', changeDirection);

// Display initial instructions and high score
function displayInitialScreen() {
    clearCanvas();
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Snake Game', canvasSize / 2, canvasSize / 2 - 60);
    ctx.font = '20px Arial';
    ctx.fillText('Use Arrow Keys to Play', canvasSize / 2, canvasSize / 2 - 20);
    ctx.fillText('Press any Arrow Key to Start', canvasSize / 2, canvasSize / 2 + 20);
    ctx.fillText('High Score: ' + highScore, canvasSize / 2, canvasSize / 2 + 60);
}

// Call displayInitialScreen when the script loads
displayInitialScreen();
