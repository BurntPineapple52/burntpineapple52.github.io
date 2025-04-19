import CONFIG from './config.js';

class Particle {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        this.currentColor = this.color.slice(); // Initialize with copy of color
        this.lifetime = config.lifetime;
        this.maxLifetime = config.lifetime;
        this.decayRate = config.decayRate;
        
        // Random velocity based on speed config
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * config.speed;
        this.vy = Math.sin(angle) * config.speed;
        
        this.type = config.types[Math.floor(Math.random() * config.types.length)];
        this.gravity = this.type === 'DEBRIS' ? 0.1 : 0;
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy + this.gravity;
        this.lifetime -= this.decayRate * deltaTime;
        this.alpha = this.lifetime / this.maxLifetime;
    }

    isExpired() {
        return this.lifetime <= 0;
    }
}

class FloatingText {
    constructor(x, y, text, config) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.lifetime = config.duration;
        this.maxLifetime = config.duration;
        this.startY = y;
        this.targetY = y - config.floatDistance;
        this.startTime = performance.now();
        this.color = config.startColor;
        this.endColor = config.endColor;
        this.font = config.font;
        this.shadowColor = config.shadowColor;
        this.shadowBlur = config.shadowBlur;
        this.glowColor = config.glowColor;
    }

    update(deltaTime) {
        const elapsed = performance.now() - this.startTime;
        const progress = Math.min(elapsed / this.maxLifetime, 1);
        
        // Bounce easing for float up
        const bounceProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        this.y = this.startY + (this.targetY - this.startY) * bounceProgress;
        
        // Color interpolation
        const colorProgress = Math.min(elapsed / (this.maxLifetime * 0.6), 1);
        this.currentColor = this.interpolateColor(this.color, this.endColor, colorProgress);
        
        // Fade and scale in last 20% of lifetime
        if (progress > 0.8) {
            this.alpha = 1 - (progress - 0.8) * 5;
            this.scale = 1 - (progress - 0.8) * 1;
        } else {
            this.alpha = 1;
            this.scale = 1;
        }
        
        this.lifetime -= deltaTime;
    }

    interpolateColor(color1, color2, factor) {
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
        }
        return result;
    }

    isExpired() {
        return this.lifetime <= 0;
    }

    render(ctx) {
        ctx.save();
        ctx.font = this.font;
        ctx.fillStyle = this.currentColor ? `rgba(${this.currentColor.join(',')}, ${this.alpha})` : 'rgba(255,255,255,1)';
        
        // Apply glow effect
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 10 * this.alpha;
        
        // Apply drop shadow
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = this.shadowColor;
        
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
    }

    createBurst(x, y, config) {
        const pattern = config.particlePattern;
        for (let i = 0; i < pattern.count; i++) {
            this.particles.push(new Particle(x, y, pattern));
        }
    }


    createTextEffect(x, y, text, config) {
        this.floatingTexts.push(new FloatingText(x, y, text, config));
    }

    update(deltaTime) {
        // Update particles (existing code)
        const startTime = performance.now();
        const initialCount = this.particles.length;
        const particleTimeScale = CONFIG.TIME_SETTINGS.SYSTEMS.PARTICLES;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime * particleTimeScale);
            
            if (particle.isExpired()) {
                this.particles.splice(i, 1);
            }
        }
        
        // Update floating texts with same time scaling as particles
        console.log(`Updating ${this.floatingTexts.length} floating texts with deltaTime:`, deltaTime * particleTimeScale);
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const text = this.floatingTexts[i];
            const prevLifetime = text.lifetime;
            text.update(deltaTime * particleTimeScale);
            console.log(`Text "${text.text}" lifetime: ${prevLifetime} -> ${text.lifetime}`);
            if (text.isExpired()) {
                console.log(`Removing expired text: "${text.text}"`);
                this.floatingTexts.splice(i, 1);
            }
        }

        const duration = performance.now() - startTime;
        if (initialCount > 0 || this.particles.length > 0) {
            console.log(`ParticleSystem: ${this.particles.length} particles, ${this.floatingTexts.length} texts | Update: ${duration.toFixed(2)}ms`);
        }
    }

    render(ctx) {
        // Render particles first
        ctx.save();
        for (const particle of this.particles) {
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Render floating texts on top
        for (const text of this.floatingTexts) {
            text.render(ctx);
        }
    }

    clear() {
        this.particles = [];
    }
}