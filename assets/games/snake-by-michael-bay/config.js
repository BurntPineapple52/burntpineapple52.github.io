export const CONFIG = {
    // Game grid dimensions (cells)
    GRID_WIDTH: 20,
    GRID_HEIGHT: 20,
    
    // Cell size in pixels
    CELL_SIZE: 20,
    
    // Time and speed configuration
    TIME_SETTINGS: {
        BASE_GAME_SPEED: 260, // ms per update
        GLOBAL_SPEED: 1.0,    // Global time scale (normal speed)
        SYSTEMS: {
            PLAYER: 1,        // Reset to normal speed
            MOVEMENT_DELAY: 4, // Number of frames to wait between movements
            PARTICLES: 1.0,   // Particle animation speed
            EFFECTS: 1.0      // Visual effects speed
        }
    },

    // Particle system configuration (now uses TIME_SETTINGS)
    PARTICLE_SYSTEM: {
        // Base speed multiplier for particles (independent of game speed)
        speedMultiplier: 1.0,
        // Update rate (1.0 = realtime, 0.5 = half speed, 2.0 = double speed)
        updateRate: 1.0
    },
    
    // Colors
    COLORS: {
        SNAKE: '#4CAF50',
        SNAKE_HEAD: '#2E7D32',
        FOOD: '#F44336',
        BACKGROUND: '#111',
        GRID_LINES: '#333'
    },
    
    // Initial snake length
    INITIAL_SNAKE_LENGTH: 3,
    
    // Score multipliers
    SCORE_PER_FOOD: 10,
    SCORE_PER_LEVEL: 50,

    // Explosion configurations
    EXPLOSION_TYPES: {
        default: {
            duration: 1000,
            shakeIntensity: 10,
            shakeDuration: 500,
            sound: 'assets/sounds/explosion.wav',
            volume: 0.7,
            slowdown: true,
            preslowDuration: 200,
            particlePattern: {
                count: 30,
                speed: 3,
                minSize: 2,
                maxSize: 5,
                colors: ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B'],
                lifetime: 1000,
                decayRate: 2,
                types: ['CORE_BURST', 'SPARKS', 'DEBRIS']
            }
        },
        small: {
            duration: 500,
            shakeIntensity: 5,
            shakeDuration: 300,
            sound: 'assets/sounds/small-explosion.wav',
            volume: 0.5,
            slowdown: false,
            preslowDuration: 100,
            particlePattern: {
                count: 15,
                speed: 2,
                minSize: 1,
                maxSize: 3,
                colors: ['#FF9800', '#FFC107'],
                lifetime: 500,
                decayRate: 1.5,
                types: ['SPARKS']
            }
        },
        food: {
            duration: 800,
            shakeIntensity: 8,
            shakeDuration: 400,
            sound: 'assets/sounds/small-explosion.wav',
            volume: 0.6,
            slowdown: true,
            preslowDuration: 150,
            particlePattern: {
                count: 50,
                speed: 4,
                minSize: 3,
                maxSize: 8,
                colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7'],
                lifetime: 800,
                decayRate: 1.8,
                types: ['CORE_BURST', 'SPARKS', 'DEBRIS', 'GLOW']
            }
        }
    },

    // Floating text effects configuration
    FLOATING_TEXT: {
        highValue: {
            duration: 300,
            floatDistance: 60,
            startColor: [255, 215, 0], // Gold
            endColor: [255, 165, 0],   // Orange
            font: 'bold 20px Arial',
            shadowColor: 'rgba(0,0,0,0.5)',
            shadowBlur: 5,
            glowColor: 'rgba(255,215,0,0.7)'
        },
        lowValue: {
            duration: 300,
            floatDistance: 60,
            startColor: [50, 205, 50], // Lime
            endColor: [144, 238, 144], // Light green
            font: 'bold 20px Arial',
            shadowColor: 'rgba(0,0,0,0.5)',
            shadowBlur: 5,
            glowColor: 'rgba(50,205,50,0.7)'
        }
    }
};

// Calculate derived values
CONFIG.CANVAS_WIDTH = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
CONFIG.CANVAS_HEIGHT = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE;

export default CONFIG;