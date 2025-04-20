// --- DOM Elements ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const newHighScoreMsg = document.getElementById('newHighScoreMsg');
const restartButton = document.getElementById('restartButton');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameContainer = document.querySelector('.game-container'); // For shake

// --- Canvas Setup ---
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// --- Game State ---
let snake;
let food;
let score;
let highScore;
let currentSpeedMs;
let gameLoopTimeout;
let lastTickTime;
let accumulatedTime;
let explosions = [];
let gameState = 'start'; // 'start', 'playing', 'slowMo', 'gameOver'
let slowMoTimer = 0;
let globalShakeState = { timer: 0, intensity: 0 }; // Global shake control

// --- Initialization ---
function loadHighScore() {
    const savedScore = localStorage.getItem(HIGH_SCORE_KEY);
    highScore = savedScore ? parseInt(savedScore, 10) : 0;
    highScoreElement.textContent = highScore;
}

function saveHighScore() {
    localStorage.setItem(HIGH_SCORE_KEY, highScore.toString());
}

function resetGame() {
    if (gameLoopTimeout) clearTimeout(gameLoopTimeout);

    snake = new Snake();
    food = new Food();
    food.randomizePosition(snake.segments); // Initial food placement
    score = 0;
    currentSpeedMs = BASE_SPEED_MS;
    explosions = [];
    accumulatedTime = 0;
    lastTickTime = performance.now();
    slowMoTimer = 0;
    globalShakeState = { timer: 0, intensity: 0 };

    scoreElement.textContent = score;
    gameOverScreen.classList.add('hidden');
    newHighScoreMsg.classList.add('hidden');
    startScreen.classList.add('hidden');
    canvas.style.filter = 'none'; // Remove any filters like blur
    gameContainer.style.transform = 'none'; // Reset container transform
}

function startGame() {
    resetGame();
    gameState = 'playing';
    requestAnimationFrame(gameLoop); // Use rAF for smoother animations
}

function triggerSlowMotion(duration = SLOW_MOTION_DURATION_MS) {
    if (gameState !== 'gameOver') { // Don't enter slowmo if already game over
       // gameState = 'slowMo'; // We handle slowmo timing directly now
       slowMoTimer = duration;
    }
}

function triggerExplosion(x, y, isBig = false) {
    explosions.push(new Explosion(x, y));
    // Trigger screen shake
    globalShakeState.timer = isBig ? 300 : 150; // Longer shake for bigger explosions
    globalShakeState.intensity = isBig ? 8 : 4;
}

// --- Game Loop ---
function gameLoop(currentTime) {
    if (gameState === 'start') {
         drawStartScreen(); // Keep drawing start screen until button press
         requestAnimationFrame(gameLoop);
         return;
    }
     if (gameState === 'gameOver') {
        // Continue drawing explosions and game over screen
        const deltaTime = currentTime - lastTickTime;
        lastTickTime = currentTime;

        updateExplosions(deltaTime);
        drawGameOver(); // Includes drawing background and explosions
        requestAnimationFrame(gameLoop); // Keep animating explosions
        return;
    }


    const deltaTime = currentTime - lastTickTime;
    lastTickTime = currentTime;
    accumulatedTime += deltaTime;

    // --- Slow Motion Handling ---
    let effectiveSpeed = currentSpeedMs;
    if (slowMoTimer > 0) {
        slowMoTimer -= deltaTime;
        effectiveSpeed *= SLOW_MOTION_FACTOR; // Make the *required* time longer
        if (slowMoTimer <= 0) {
            slowMoTimer = 0;
            // gameState = 'playing'; // Revert state if needed (handled implicitly now)
        }
    }

     // --- Global Shake Update ---
    if (globalShakeState.timer > 0) {
        globalShakeState.timer -= deltaTime;
    }

    // --- Game Logic Update (runs at intervals based on speed) ---
    if (accumulatedTime >= effectiveSpeed) {
        accumulatedTime -= effectiveSpeed; // Consume the time for this tick

        if (gameState === 'playing' || gameState === 'slowMo') { // Only move if playing
             const collision = snake.move();

            if (collision) {
                handleGameOver(true); // Player caused game over
            } else {
                // Check for food collision
                const head = snake.getHead();
                if (head.x === food.x && head.y === food.y) {
                    handleFoodEaten();
                }
            }
        }
    }

    // --- Drawing (runs every frame) ---
    drawGame(deltaTime);

    // --- Loop ---
    requestAnimationFrame(gameLoop);
}

function handleFoodEaten() {
    score++;
    scoreElement.textContent = score;
    snake.grow();
    const foodPos = food.getPixelPosition();
    food.randomizePosition(snake.segments);

    // Speed up
    currentSpeedMs = Math.max(MIN_SPEED_MS, currentSpeedMs * SPEED_INCREMENT_FACTOR);

    // Michael Bay effect!
    triggerExplosion(foodPos.x, foodPos.y);
    triggerSlowMotion();
}

function handleGameOver(playerDied) {
    gameState = 'gameOver';
    const headPos = snake.getHeadPixelPosition();

    // Big explosion on death
    triggerExplosion(headPos.x, headPos.y, true); // 'true' for big explosion/shake
    triggerSlowMotion(EXPLOSION_DURATION_MS); // Slow-mo during death explosion

    finalScoreElement.textContent = score;
    let isNewHighScore = false;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        saveHighScore();
        newHighScoreMsg.classList.remove('hidden');
        isNewHighScore = true;
        // Optional: Trigger another, perhaps different, explosion for high score
        // setTimeout(() => triggerExplosion(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, true), 500); // Delayed center explosion
    }

    gameOverScreen.classList.remove('hidden');
     // Optional: Add a blur effect to the canvas behind the game over screen
    // canvas.style.filter = 'blur(5px)';
}


function updateExplosions(deltaTime) {
     let effectiveDeltaTime = deltaTime;
     // Explosions also run slower during general slow-mo
     if (slowMoTimer > 0) {
         effectiveDeltaTime /= SLOW_MOTION_FACTOR;
     }

    explosions.forEach(exp => exp.update(effectiveDeltaTime));
    explosions = explosions.filter(exp => !exp.isFinished);
}

// --- Drawing Functions ---
function drawGame(deltaTime) {
    ctx.save(); // Save context state before potential shake translation

    // Apply Screen Shake
    if (globalShakeState.timer > 0) {
        const intensity = globalShakeState.intensity * (globalShakeState.timer / (globalShakeState.intensity === 8 ? 300 : 150)); // Fade shake
        const offsetX = getRandomFloat(-intensity, intensity);
        const offsetY = getRandomFloat(-intensity, intensity);
        ctx.translate(offsetX, offsetY);
        // Also apply to container for UI elements if desired
        gameContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    } else {
         gameContainer.style.transform = 'none'; // Ensure reset when shake ends
    }


    // Clear canvas
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Food
    food.draw(ctx);

    // Draw Snake
    snake.draw(ctx);

    // Update and Draw Explosions
    updateExplosions(deltaTime); // Update based on frame time
    explosions.forEach(exp => exp.draw(ctx));

    ctx.restore(); // Restore context state, removing shake translation
}

function drawGameOver() {
     ctx.save(); // Save context state

     // Apply ongoing shake if any
     if (globalShakeState.timer > 0) {
        const intensity = globalShakeState.intensity * (globalShakeState.timer / (globalShakeState.intensity === 8 ? 300 : 150));
        const offsetX = getRandomFloat(-intensity, intensity);
        const offsetY = getRandomFloat(-intensity, intensity);
        ctx.translate(offsetX, offsetY);
        gameContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
     } else {
         gameContainer.style.transform = 'none';
     }

    // Draw semi-transparent background overlay if not using the HTML overlay
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    // ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

     // Draw background elements (like a static snake/food if desired)
     ctx.fillStyle = BACKGROUND_COLOR;
     ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
     if(snake) snake.draw(ctx); // Draw final snake position
     if(food) food.draw(ctx);   // Draw final food position


    // Draw remaining explosions
    explosions.forEach(exp => exp.draw(ctx));

    ctx.restore(); // Restore context state

    // The HTML overlay (#gameOverScreen) is displayed separately
}

function drawStartScreen() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Optionally draw some static elements like a title on the canvas itself
    // ctx.fillStyle = TEXT_COLOR;
    // ctx.font = '30px Arial';
    // ctx.textAlign = 'center';
    // ctx.fillText('Michael Bay Snake', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);
}


// --- Event Listeners ---
function handleKeyDown(e) {
    if (gameState !== 'playing' && gameState !== 'slowMo') return; // Only allow input during play/slowmo

    switch (e.key) {
        case 'ArrowUp':
            if (snake.direction.y === 0) snake.changeDirection(0, -1);
            break;
        case 'ArrowDown':
            if (snake.direction.y === 0) snake.changeDirection(0, 1);
            break;
        case 'ArrowLeft':
            if (snake.direction.x === 0) snake.changeDirection(-1, 0);
            break;
        case 'ArrowRight':
            if (snake.direction.x === 0) snake.changeDirection(1, 0);
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);
restartButton.addEventListener('click', startGame);
startButton.addEventListener('click', startGame);

// --- Initial Load ---
loadHighScore();
// Don't start game loop immediately, wait for start button
gameState = 'start';
requestAnimationFrame(gameLoop); // Start the loop to show the start screen