import CONFIG from './config.js';
import InputHandler from './input-handler.js';
import ScoreManager from './score-manager.js';
import ExplosionManager from './explosion-manager.js';
import { ParticleSystem } from './particle-system.js';

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.inputHandler = new InputHandler();
        this.scoreManager = new ScoreManager();
        this.particleSystem = new ParticleSystem();
        this.explosionManager = new ExplosionManager(this, this.particleSystem);
        this.slowdownFactor = 1; // Temporary slowdown multiplier
        this.gameState = {
            snake: [],
            direction: 'RIGHT',
            food: null,
            gameOver: false,
            paused: false
        };
        this.lastUpdateTime = 0;
        this.animationFrameId = null;

        this.initCanvas();
        this.resetGame();
        this.startGameLoop();
    }

    initCanvas() {
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
    }

    resetGame() {
        this.gameState = {
            snake: this.createInitialSnake(),
            direction: 'RIGHT',
            food: this.generateFood(),
            gameOver: false,
            paused: false
        };
        this.scoreManager.reset();
        this.inputHandler.reset();
    }

    createInitialSnake() {
        const snake = [];
        const startX = Math.floor(CONFIG.GRID_WIDTH / 3);
        const startY = Math.floor(CONFIG.GRID_HEIGHT / 2);

        for (let i = 0; i < CONFIG.INITIAL_SNAKE_LENGTH; i++) {
            snake.push({ x: startX - i, y: startY });
        }

        return snake;
    }

    generateFood() {
        const food = {
            x: Math.floor(Math.random() * CONFIG.GRID_WIDTH),
            y: Math.floor(Math.random() * CONFIG.GRID_HEIGHT)
        };

        // Ensure food doesn't spawn on snake
        const isOnSnake = this.gameState.snake.some(segment => 
            segment.x === food.x && segment.y === food.y
        );

        return isOnSnake ? this.generateFood() : food;
    }

    startGameLoop() {
        const FPS = CONFIG.TIME_SETTINGS.BASE_FPS || 60;
        const FRAME_TIME = 1000 / FPS;
        let lastTime = performance.now();
        let accumulator = 0;
        this.callbackCount = 0;
        this.movementCounter = 0;

        const gameLoop = (currentTime) => {
            this.callbackCount++;
            if (this.callbackCount % 60 === 0) {
                console.log(`Animation frame callbacks: ${this.callbackCount}`);
            }

            if (this.gameState.gameOver || this.gameState.paused) {
                return;
            }

            // Calculate deltaTime since last frame, capped at 100ms to prevent spiral of death
            let deltaTime = Math.min(currentTime - lastTime, 100);
            lastTime = currentTime;
            accumulator += deltaTime;

            // Fixed timestep updates
            while (accumulator >= FRAME_TIME) {
                this.movementCounter++;
                if (this.movementCounter >= CONFIG.TIME_SETTINGS.SYSTEMS.MOVEMENT_DELAY) {
                    this.update(FRAME_TIME * CONFIG.TIME_SETTINGS.SYSTEMS.MOVEMENT_DELAY);
                    this.movementCounter = 0;
                }
                accumulator -= FRAME_TIME;
            }

            this.render();
            this.animationFrameId = requestAnimationFrame(gameLoop);
        };

        this.animationFrameId = requestAnimationFrame(gameLoop);
        console.log('Game loop started - initial callback registered');
    }

    update(deltaTime) {
        console.log(`Game update called with deltaTime: ${deltaTime}`);
        // Update explosion effects with raw deltaTime (particle system handles its own timing)
        this.explosionManager.update(deltaTime);
        // Update particle system (including floating text)
        this.particleSystem.update(deltaTime);
        const newDirection = this.inputHandler.getDirection();
        if (newDirection) {
            this.gameState.direction = newDirection;
        }

        const head = {...this.gameState.snake[0]};

        // Move head based on direction
        switch (this.gameState.direction) {
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
        }

        // Check collisions
        if (this.checkCollision(head)) {
            this.gameState.gameOver = true;
            this.scoreManager.saveHighScore();
            // Trigger explosion at snake head position
            const head = this.gameState.snake[0];
            this.explosionManager.triggerExplosion(
                { x: head.x * CONFIG.CELL_SIZE, y: head.y * CONFIG.CELL_SIZE },
                'default'
            );
            return;
        }

        // Add new head
        this.gameState.snake.unshift(head);

        // Check food collision
        if (head.x === this.gameState.food.x && head.y === this.gameState.food.y) {
            this.scoreManager.addPoints(CONFIG.SCORE_PER_FOOD);
            // Trigger food explosion and score text effect
            const foodPos = {
                x: (this.gameState.food.x + 0.5) * CONFIG.CELL_SIZE,
                y: (this.gameState.food.y + 0.5) * CONFIG.CELL_SIZE
            };
            
            // Create explosion
            this.explosionManager.triggerExplosion(foodPos, 'food');
            
            // Create floating score text
            const scoreValue = `+${CONFIG.SCORE_PER_FOOD}`;
            const textConfig = CONFIG.SCORE_PER_FOOD >= 100
                ? CONFIG.FLOATING_TEXT.highValue
                : CONFIG.FLOATING_TEXT.lowValue;
            this.particleSystem.createTextEffect(
                foodPos.x,
                foodPos.y,
                scoreValue,
                textConfig
            );
            
            // Generate new food
            this.gameState.food = this.generateFood();
        } else {
            // Remove tail if no food eaten
            this.gameState.snake.pop();
        }
    }

    checkCollision(head) {
        // Wall collision
        if (head.x < 0 || head.x >= CONFIG.GRID_WIDTH || 
            head.y < 0 || head.y >= CONFIG.GRID_HEIGHT) {
            return true;
        }

        // Self collision
        return this.gameState.snake.some((segment, index) => 
            index > 0 && segment.x === head.x && segment.y === head.y
        );
    }

    render() {
        // Apply screen shake offset
        const shakeOffset = this.explosionManager.getShakeOffset();
        this.ctx.save();
        this.ctx.translate(shakeOffset.x, shakeOffset.y);

        // Clear canvas
        this.ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(
            -Math.abs(shakeOffset.x),
            -Math.abs(shakeOffset.y),
            this.canvas.width + Math.abs(shakeOffset.x) * 2,
            this.canvas.height + Math.abs(shakeOffset.y) * 2
        );

        // Draw grid
        this.ctx.strokeStyle = CONFIG.COLORS.GRID_LINES;
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * CONFIG.CELL_SIZE, 0);
            this.ctx.lineTo(x * CONFIG.CELL_SIZE, CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE);
            this.ctx.stroke();
        }
        for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * CONFIG.CELL_SIZE);
            this.ctx.lineTo(CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE, y * CONFIG.CELL_SIZE);
            this.ctx.stroke();
        }

        // Render particle effects
        this.particleSystem.render(this.ctx);

        // Draw snake
        this.gameState.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? CONFIG.COLORS.SNAKE_HEAD : CONFIG.COLORS.SNAKE;
            this.ctx.fillRect(
                segment.x * CONFIG.CELL_SIZE,
                segment.y * CONFIG.CELL_SIZE,
                CONFIG.CELL_SIZE,
                CONFIG.CELL_SIZE
            );
        });

        // Draw food
        this.ctx.fillStyle = CONFIG.COLORS.FOOD;
        this.ctx.beginPath();
        this.ctx.arc(
            (this.gameState.food.x + 0.5) * CONFIG.CELL_SIZE,
            (this.gameState.food.y + 0.5) * CONFIG.CELL_SIZE,
            CONFIG.CELL_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Game over overlay handled by HTML/CSS now
        this.ctx.restore();

        // Render explosions
        this.explosionManager.activeExplosions.forEach(explosion => {
            explosion.particles.forEach(particle => {
                if (particle.life > 0) {
                    this.ctx.fillStyle = particle.color;
                    this.ctx.globalAlpha = particle.life / 1000;
                    this.ctx.fillRect(
                        particle.x - particle.size / 2,
                        particle.y - particle.size / 2,
                        particle.size,
                        particle.size
                    );
                    this.ctx.globalAlpha = 1;
                }
            });
        });

        if (this.gameState.gameOver) {
            const overlay = document.getElementById('game-over-overlay');
            overlay.classList.remove('hidden');
            document.getElementById('final-score').textContent = this.scoreManager.currentScore;
            document.getElementById('final-high-score').textContent = this.scoreManager.highScore;
        }
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeGame();
    
    // Handle retry button click
    document.getElementById('retry-button').addEventListener('click', () => {
        document.getElementById('game-over-overlay').classList.add('hidden');
        // Cancel existing game loop
        if (game.animationFrameId) {
            cancelAnimationFrame(game.animationFrameId);
        }
        // Reset game state
        game.resetGame();
        // Restart game loop
        game.startGameLoop();
    });

    // Add slowdown method to SnakeGame class
    SnakeGame.prototype.slowdownGame = function() {
        this.slowdownFactor = 0.3;
        setTimeout(() => {
            this.slowdownFactor = 1;
        }, 500);
    };
});