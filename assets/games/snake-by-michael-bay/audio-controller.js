class AudioController {
    constructor() {
        this.sounds = new Map();
        this.listenerPosition = { x: 0, y: 0 };
        this.maxDistance = Math.sqrt(
            CONFIG.CANVAS_WIDTH * CONFIG.CANVAS_WIDTH + 
            CONFIG.CANVAS_HEIGHT * CONFIG.CANVAS_HEIGHT
        ) / 2;
    }

    async preload() {
        try {
            // Preload all explosion sounds from config
            for (const [type, config] of Object.entries(CONFIG.EXPLOSION_TYPES)) {
                if (config.sound) {
                    const sound = new Audio(config.sound);
                    sound.load();
                    this.sounds.set(type, {
                        audio: sound,
                        baseVolume: config.volume || 0.7
                    });
                }
            }
            console.log('Audio preloaded successfully');
        } catch (error) {
            console.error('Error preloading audio:', error);
        }
    }

    playSound(type, position) {
        if (!this.sounds.has(type)) {
            console.warn(`Sound type "${type}" not found`);
            return;
        }

        const { audio, baseVolume } = this.sounds.get(type);
        
        // Calculate distance-based volume
        const distance = Math.sqrt(
            Math.pow(position.x - this.listenerPosition.x, 2) + 
            Math.pow(position.y - this.listenerPosition.y, 2)
        );
        
        // Normalize distance (0-1) and invert (closer = louder)
        const normalizedDistance = Math.min(distance / this.maxDistance, 1);
        const volume = baseVolume * (1 - normalizedDistance);
        
        // Play sound with adjusted volume
        audio.volume = Math.max(0, Math.min(volume, 1));
        audio.currentTime = 0; // Rewind if already playing
        audio.play().catch(e => console.error('Error playing sound:', e));
    }

    setListenerPosition(x, y) {
        this.listenerPosition = { x, y };
    }
}

export default AudioController;