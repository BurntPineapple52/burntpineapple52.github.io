class Particle {
    constructor(x, y, lifeMs) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = getRandomFloat(EXPLOSION_PARTICLE_MIN_SPEED, EXPLOSION_PARTICLE_MAX_SPEED);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = lifeMs;
        this.initialLife = lifeMs;
        this.color = EXPLOSION_COLORS[getRandomInt(0, EXPLOSION_COLORS.length)];
        this.size = EXPLOSION_PARTICLE_SIZE;
    }

    update(deltaTime) {
        this.x += this.vx * (deltaTime / 16); // Adjust speed based on typical frame time
        this.y += this.vy * (deltaTime / 16);
        this.life -= deltaTime;

        // Optional: Fade out or shrink
        this.alpha = Math.max(0, this.life / this.initialLife); // Fade out
        // this.currentSize = this.size * this.alpha; // Shrink
    }

    draw(ctx) {
        if (this.life > 0) {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            // ctx.fillRect(this.x - this.currentSize / 2, this.y - this.currentSize / 2, this.currentSize, this.currentSize);
             ctx.beginPath();
             ctx.arc(this.x, this.y, this.size * this.alpha, 0, Math.PI * 2);
             ctx.fill();
            ctx.globalAlpha = 1.0; // Reset alpha
        }
    }

    isDead() {
        return this.life <= 0;
    }
}

class Explosion {
    constructor(x, y) {
        this.x = x; // Center X in pixels
        this.y = y; // Center Y in pixels
        this.particles = [];
        this.duration = EXPLOSION_DURATION_MS;
        this.isFinished = false;
        this.shakeState = { timer: 0 }; // Add shake state per explosion

        for (let i = 0; i < EXPLOSION_PARTICLE_COUNT; i++) {
            this.particles.push(new Particle(this.x, this.y, EXPLOSION_PARTICLE_LIFE_MS));
        }
    }

    update(deltaTime) {
        this.duration -= deltaTime;
        this.shakeState.timer -= deltaTime; // Decrease shake timer

        this.particles.forEach(p => p.update(deltaTime));
        this.particles = this.particles.filter(p => !p.isDead());

        if (this.duration <= 0 && this.particles.length === 0) {
            this.isFinished = true;
        }
    }

    draw(ctx) {
        // Apply screen shake specific to this explosion
        // Note: Multiple shakes might interfere. A global shake might be better.
        // For simplicity here, we'll let the main game loop handle a single global shake.
        // applyScreenShake(ctx, 5, 100, this.shakeState); // Example: 5px shake for 100ms

        this.particles.forEach(p => p.draw(ctx));

        // resetScreenShake(ctx, this.shakeState);
    }
}