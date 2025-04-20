// snake.js

class Snake {
    constructor() {
        this.reset();
        // --- Binding fix from previous step ---
        this._boundChangeDirection = this._changeDirection.bind(this);
        this.changeDirection = debounce(this._boundChangeDirection, 50);
        // --- END Binding fix ---
    }

    reset() {
        const startX = Math.floor(GRID_SIZE / 2);
        const startY = Math.floor(GRID_SIZE / 2);
        this.segments = [{ x: startX, y: startY }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.growCounter = 0;
        this.canChangeDirection = true;
    }

    _changeDirection(dx, dy) {
        if (this.segments.length > 1 && dx === -this.direction.x && dy === -this.direction.y) {
            return;
        }
        if (!this.canChangeDirection) {
            return;
        }
        this.nextDirection = { x: dx, y: dy };
        this.canChangeDirection = false;
    }

    move() {
        this.direction = this.nextDirection;
        this.canChangeDirection = true;

        const head = this.segments[0];

        // --- CHANGE: Calculate next position without wrapping ---
        const nextX = head.x + this.direction.x;
        const nextY = head.y + this.direction.y;

        // --- CHANGE: Check for wall collisions ---
        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
            // Wall collision!
            // We need the snake's head position *before* the collision for the explosion
            // The game loop will call getHeadPixelPosition() after this returns true.
            return true; // Indicate collision
        }
        // --- END CHANGE ---

        // If no wall collision, create the new head object
        const newHead = { x: nextX, y: nextY };

        // Check for self-collision (using the refined logic)
        if (isPositionInSegments(newHead.x, newHead.y, this.segments)) {
             const tail = this.segments[this.segments.length - 1];
             // Allow moving into the tail's previous spot only if not growing
             if (!(this.growCounter === 0 && newHead.x === tail.x && newHead.y === tail.y)) {
                 // It's a real self-collision
                 return true; // Indicate collision
             }
             // If it was just the tail spot and we're not growing, continue normally
        }

        // No collision, proceed with movement
        this.segments.unshift(newHead); // Add new head

        if (this.growCounter > 0) {
            this.growCounter--;
        } else {
            this.segments.pop(); // Remove tail
        }

        return false; // No collision occurred this tick
    }

    grow(amount = 1) {
        this.growCounter += amount;
    }

    getHead() {
        // Ensure there's always at least one segment before accessing index 0
        return this.segments.length > 0 ? this.segments[0] : { x: -1, y: -1 }; // Return dummy if empty
    }


    getHeadPixelPosition() {
        const head = this.getHead();
         // Handle case where snake might be empty momentarily during reset/error
        if (head.x === -1) return { x: 0, y: 0 };
        return {
            x: head.x * TILE_SIZE + TILE_SIZE / 2,
            y: head.y * TILE_SIZE + TILE_SIZE / 2
        };
    }

    draw(ctx) {
        this.segments.forEach((segment, index) => {
            ctx.fillStyle = (index === 0) ? SNAKE_HEAD_COLOR : SNAKE_COLOR;
            ctx.fillRect(
                segment.x * TILE_SIZE,
                segment.y * TILE_SIZE,
                TILE_SIZE - 1,
                TILE_SIZE - 1
            );
             // Draw eyes (same as before)
            if (index === 0) {
                ctx.fillStyle = 'white';
                const eyeSize = TILE_SIZE / 5;
                const eyeOffset = TILE_SIZE / 4;
                if (this.direction.x === 1) { // Right
                    ctx.fillRect(segment.x * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize / 2, segment.y * TILE_SIZE + eyeOffset - eyeSize / 2, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize / 2, segment.y * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize / 2, eyeSize, eyeSize);
                } else if (this.direction.x === -1) { // Left
                    ctx.fillRect(segment.x * TILE_SIZE + eyeOffset - eyeSize / 2, segment.y * TILE_SIZE + eyeOffset - eyeSize / 2, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * TILE_SIZE + eyeOffset - eyeSize / 2, segment.y * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize / 2, eyeSize, eyeSize);
                } else if (this.direction.y === 1) { // Down
                     ctx.fillRect(segment.x * TILE_SIZE + eyeOffset - eyeSize / 2, segment.y * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize / 2, eyeSize, eyeSize);
                     ctx.fillRect(segment.x * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize / 2, segment.y * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize / 2, eyeSize, eyeSize);
                } else { // Up
                    ctx.fillRect(segment.x * TILE_SIZE + eyeOffset - eyeSize / 2, segment.y * TILE_SIZE + eyeOffset - eyeSize / 2, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize / 2, segment.y * TILE_SIZE + eyeOffset - eyeSize / 2, eyeSize, eyeSize);
                }
            }
        });
    }
} 