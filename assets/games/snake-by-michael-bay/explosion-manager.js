import CONFIG from './config.js';

export default class ExplosionManager {
    constructor(game, particleSystem) {
        this.game = game;
        this.particleSystem = particleSystem;
        this.activeExplosions = [];
        this.particles = [];
        this.screenShake = {
            intensity: 0,
            duration: 0,
            elapsed: 0
        };
        this.animationFrameId = null;
    }

    handlePreEffects(position, type) {
        // Apply any pre-explosion effects like warnings, sounds, etc
        if (CONFIG.EXPLOSION_TYPES[type]?.preEffect) {
            this.game.physics.addWarningZone(position,
                CONFIG.EXPLOSION_TYPES[type].radius,
                CONFIG.EXPLOSION_TYPES[type].preEffect.duration);
            
            if (CONFIG.EXPLOSION_TYPES[type].preEffect.sound) {
                try {
                    const audio = new Audio(CONFIG.EXPLOSION_TYPES[type].preEffect.sound);
                    audio.volume = 0.3;
                    audio.play().catch(() => {});
                } catch (e) {}
            }
        }
    }

    triggerExplosion(position, type = 'default') {
        performance.mark('explosion-start');
        this.handlePreEffects(position, type);
        
        const explosion = {
            position: {...position},
            type,
            particles: this.createParticles(position, type),
            elapsed: 0,
            duration: CONFIG.EXPLOSION_TYPES[type].duration
        };
        this.activeExplosions.push(explosion);
        
        this.screenShake = {
            intensity: CONFIG.EXPLOSION_TYPES[type].shakeIntensity,
            duration: CONFIG.EXPLOSION_TYPES[type].shakeDuration,
            elapsed: 0
        };

        if (CONFIG.EXPLOSION_TYPES[type].sound) {
            try {
                const audio = new Audio(CONFIG.EXPLOSION_TYPES[type].sound);
                audio.volume = CONFIG.EXPLOSION_TYPES[type].volume || 0.5;
                audio.play().catch(() => {});
            } catch (e) {}
        }

        if (CONFIG.EXPLOSION_TYPES[type].slowdown) {
            this.game.slowdownGame();
        }
        
        performance.mark('explosion-end');
        performance.measure('explosion-duration', 'explosion-start', 'explosion-end');
    }

    createParticles(position, type) {
        const pattern = CONFIG.EXPLOSION_TYPES[type].particlePattern;
        const particles = [];
        
        for (let i = 0; i < pattern.count; i++) {
            particles.push({
                x: position.x,
                y: position.y,
                vx: (Math.random() - 0.5) * pattern.speed * CONFIG.PARTICLE_SYSTEM.speedMultiplier,
                vy: (Math.random() - 0.5) * pattern.speed * CONFIG.PARTICLE_SYSTEM.speedMultiplier,
                size: pattern.minSize + Math.random() * (pattern.maxSize - pattern.minSize),
                color: pattern.colors[Math.floor(Math.random() * pattern.colors.length)],
                life: pattern.lifetime,
                decay: pattern.decayRate
            });
        }
        
        return particles;
    }

    update(deltaTime) {
        // Apply effects time scaling
        const effectsTimeScale = CONFIG.TIME_SETTINGS.SYSTEMS.EFFECTS;
        const scaledDeltaTime = deltaTime * effectsTimeScale;
        
        // Update active explosions
        this.activeExplosions = this.activeExplosions.filter(explosion => {
            explosion.elapsed += scaledDeltaTime;
            
            // Update particles with scaled timing
            explosion.particles.forEach(particle => {
                particle.x += particle.vx * effectsTimeScale;
                particle.y += particle.vy * effectsTimeScale;
                particle.life -= particle.decay * effectsTimeScale;
            });
            
            const isComplete = explosion.elapsed >= explosion.duration;
            // Removed incorrect cancelAnimationFrame logic here
            return !isComplete;
        });

        // Update screen shake
        if (this.screenShake.elapsed < this.screenShake.duration) {
            this.screenShake.elapsed += deltaTime;
        } else {
            this.screenShake.intensity = 0;
        }
    }

    getShakeOffset() {
        if (this.screenShake.intensity > 0) {
            const progress = this.screenShake.elapsed / this.screenShake.duration;
            const currentIntensity = this.screenShake.intensity * (1 - progress);
            return {
                x: (Math.random() - 0.5) * currentIntensity,
                y: (Math.random() - 0.5) * currentIntensity
            };
        }
        return { x: 0, y: 0 };
    }
}