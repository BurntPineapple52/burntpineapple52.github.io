class Snake {
    constructor() {
        this.reset();
    }

    reset() {
        // Start near the center
        const startX = Math.floor(GRID_SIZE / 2);
        const startY = Math.floor(GRID_SIZE / 2);
        this.segments = [{ x: startX, y: startY }];
        this.direction = { x: 1, y: 0 }; // Start moving right
        this.nextDirection = { x: 1, y: 0 };
        this.growCounter = 0; // How many segments to add
        this.canChangeDirection = true; // Prevent multiple direction changes per tick
    }

    // Debounced direction change to prevent 180 degree turn issues
    _changeDirection(dx, dy) {
        // Prevent moving directly opposite
        if (this.segments.length > 1 && dx === -this.direction.x && dy === -this.direction.y) {
            return;
        }
         // Prevent changing direction multiple times before the next move
        if (!this.canChangeDirection) {
            return;
        }

        this.nextDirection = { x: dx, y: dy };
        this.canChangeDirection = false; // Lock direction change until next move update
    }
    // Expose debounced version
    changeDirection = debounce(this._changeDirection, 50); // 50ms debounce window


    move() {
        this.direction = this.nextDirection;
        this.canChangeDirection = true; // Allow changing direction again

        const head = this.segments[0];
        const newHead = {
            x: (head.x + this.direction.x + GRID_SIZE) % GRID_SIZE, // Wrap around horizontally
            y: (head.y + this.direction.y + GRID_SIZE) % GRID_SIZE  // Wrap around vertically
        };

        // Check for self-collision BEFORE adding the new head
        if (isPositionInSegments(newHead.x, newHead.y, this.segments)) {
            return true; // Collision detected
        }

        this.segments.unshift(newHead); // Add new head to the front

        if (this.growCounter > 0) {
            this.growCounter--; // Consume one growth segment
        } else {
            this.segments.pop(); // Remove tail if not growing
        }
        return false; // No collision
    }

    grow(amount = 1) {
        this.growCounter += amount;
    }

    getHead() {
        return this.segments[0];
    }

    getHeadPixelPosition() {
        const head = this.getHead();
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
                TILE_SIZE - 1, // -1 for slight grid effect
                TILE_SIZE - 1
            );
             // Optional: Add eyes or other details to the head
            if (index === 0) {
                ctx.fillStyle = 'white';
                const eyeSize = TILE_SIZE / 5;
                const eyeOffset = TILE_SIZE / 4;
                 // Simple eye placement based on direction
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