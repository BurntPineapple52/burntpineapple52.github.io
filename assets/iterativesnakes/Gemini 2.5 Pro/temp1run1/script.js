const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

// --- Game Constants ---
const GRID_SIZE = 20; // Size of each square in the grid
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const TILE_COUNT_X = CANVAS_WIDTH / GRID_SIZE;
const TILE_COUNT_Y = CANVAS_HEIGHT / GRID_SIZE;

// --- Game State Variables ---
let snake = [];         // Array of {x, y} objects representing snake segments
let dx = GRID_SIZE;     // Horizontal velocity (pixels per frame)
let dy = 0;             // Vertical velocity (pixels per frame)
let food = { x: 0, y: 0 }; // Food position {x, y}
let score = 0;
let changingDirection = false; // Prevent multiple direction changes per frame
let gameRunning = true;
let gameInterval;       // To store the interval ID

// --- Initialization ---
function initializeGame() {
    // Reset game state
    snake = [
        { x: GRID_SIZE * 7, y: GRID_SIZE * 10 }, // Start position
        { x: GRID_SIZE * 6, y: GRID_SIZE * 10 },
        { x: GRID_SIZE * 5, y: GRID_SIZE * 10 }
    ];
    dx = GRID_SIZE; // Start moving right
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    changingDirection = false;
    gameRunning = true;
    restartButton.style.display = 'none'; // Hide button on start

    // Create initial food
    createFood();

    // Start game loop if it's not already running or was cleared
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(main, 100); // Adjust speed (lower number = faster)

    // Re-add event listener if it was removed
    document.removeEventListener('keydown', changeDirection); // Ensure no duplicates
    document.addEventListener('keydown', changeDirection);
}

// --- Main Game Loop ---
function main() {
    if (!gameRunning) {
        gameOver();
        return; // Stop the loop if game over
    }

    changingDirection = false; // Allow direction change for the next frame
    clearCanvas();
    drawFood();
    moveSnake();
    checkCollision(); // Check collision *after* potential move
    drawSnake();
}

// --- Drawing Functions ---
function clearCanvas() {
    ctx.fillStyle = '#9cda7b'; // Background color (match CSS)
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = '#006400'; // Dark green for snake
    ctx.strokeStyle = '#004d00'; // Darker border
    ctx.fillRect(snakePart.x, snakePart.y, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(snakePart.x, snakePart.y, GRID_SIZE, GRID_SIZE);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    ctx.fillStyle = '#DC143C'; // Crimson red for food
    ctx.strokeStyle = '#8B0000'; // Darker red border
    ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
}

// --- Movement Logic ---
function moveSnake() {
    // Create the new head's position based on current velocity
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Add the new head to the beginning of the snake array
    snake.unshift(head);

    // Check if snake ate food
    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        score += 10;
        scoreElement.textContent = score;
        createFood(); // Generate new food
    } else {
        // Remove the tail segment if no food was eaten
        snake.pop();
    }
}

// --- Collision Detection ---
function checkCollision() {
    const head = snake[0];

    // Check collision with walls
    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= CANVAS_WIDTH;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= CANVAS_HEIGHT;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        gameRunning = false;
        return;
    }

    // Check collision with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameRunning = false;
            return;
        }
    }
}

// --- Food Logic ---
function randomPosition(min, max, step) {
     // Generate a random multiple of GRID_SIZE within the canvas bounds
    return Math.floor(Math.random() * (max - min) / step) * step + min;
}

function createFood() {
    let newFoodX, newFoodY;
    let foodOnSnake;

    do {
         foodOnSnake = false;
         newFoodX = randomPosition(0, CANVAS_WIDTH - GRID_SIZE, GRID_SIZE);
         newFoodY = randomPosition(0, CANVAS_HEIGHT - GRID_SIZE, GRID_SIZE);

        // Check if the new food position is on the snake
         for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === newFoodX && snake[i].y === newFoodY) {
                foodOnSnake = true;
                break; // No need to check further if found on snake
            }
        }
    } while (foodOnSnake); // Keep trying until food is *not* on the snake

    food = { x: newFoodX, y: newFoodY };
}


// --- Input Handling ---
function changeDirection(event) {
    if (changingDirection) return; // Prevent rapid back-and-forth

    changingDirection = true;

    const keyPressed = event.key; // Use 'key' for modern browsers

    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingRight = dx === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;

    // Change direction based on key press, preventing 180-degree turns
    if ((keyPressed === 'ArrowLeft' || keyPressed === 'a') && !goingRight) {
        dx = -GRID_SIZE;
        dy = 0;
    } else if ((keyPressed === 'ArrowUp' || keyPressed === 'w') && !goingDown) {
        dx = 0;
        dy = -GRID_SIZE;
    } else if ((keyPressed === 'ArrowRight' || keyPressed === 'd') && !goingLeft) {
        dx = GRID_SIZE;
        dy = 0;
    } else if ((keyPressed === 'ArrowDown' || keyPressed === 's') && !goingUp) {
        dx = 0;
        dy = GRID_SIZE;
    } else {
        // If an invalid key or a 180 turn was attempted, allow changing direction again in the next frame
        changingDirection = false;
    }
}

// --- Game Over ---
function gameOver() {
    clearInterval(gameInterval); // Stop the game loop
    gameRunning = false; // Explicitly set state

    // Display Game Over message on canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.font = '40px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);

    // Show restart button
    restartButton.style.display = 'block';
    // Remove the keydown listener to prevent movement after game over
    document.removeEventListener('keydown', changeDirection);
}

// --- Event Listeners ---
restartButton.addEventListener('click', initializeGame); // Restart when button clicked

// --- Start the Game ---
initializeGame(); // Initial call to start the game
