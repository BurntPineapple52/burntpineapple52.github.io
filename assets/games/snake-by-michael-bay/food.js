class Food {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.pixelX = 0;
        this.pixelY = 0;
        // Initial placement will be done by randomizePosition
    }

    randomizePosition(snakeSegments) {
        let newX, newY;
        do {
            newX = getRandomInt(0, GRID_SIZE);
            newY = getRandomInt(0, GRID_SIZE);
        } while (isPositionInSegments(newX, newY, snakeSegments)); // Ensure food doesn't spawn on the snake

        this.x = newX;
        this.y = newY;
        this.pixelX = this.x * TILE_SIZE + TILE_SIZE / 2;
        this.pixelY = this.y * TILE_SIZE + TILE_SIZE / 2;
    }

    getPixelPosition() {
        return { x: this.pixelX, y: this.pixelY };
    }

    draw(ctx) {
        ctx.fillStyle = FOOD_COLOR;
        ctx.shadowColor = 'rgba(255, 0, 0, 0.7)'; // Red glow
        ctx.shadowBlur = 10;

        // Draw as a slightly smaller square or circle
        const padding = TILE_SIZE * 0.15;
        ctx.fillRect(
            this.x * TILE_SIZE + padding,
            this.y * TILE_SIZE + padding,
            TILE_SIZE - padding * 2,
            TILE_SIZE - padding * 2
        );

        // Reset shadow for other elements
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
}