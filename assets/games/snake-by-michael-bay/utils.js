/**
 * Generates a random integer between min (inclusive) and max (exclusive).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer.
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Generates a random float between min (inclusive) and max (exclusive).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random float.
 */
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Checks if a position (x, y) is within an array of segments.
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {Array<object>} segments - Array of objects with x, y properties.
 * @param {boolean} [ignoreHead=false] - Whether to ignore the first segment (head).
 * @returns {boolean} True if the position overlaps with a segment.
 */
function isPositionInSegments(x, y, segments, ignoreHead = false) {
    const startIndex = ignoreHead ? 1 : 0;
    for (let i = startIndex; i < segments.length; i++) {
        if (segments[i].x === x && segments[i].y === y) {
            return true;
        }
    }
    return false;
}

/**
 * Simple screen shake effect by translating the canvas context.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} intensity - Max pixel offset for the shake.
 * @param {number} durationMs - How long the shake should last.
 * @param {object} shakeState - An object to store shake timer { timer: 0 }.
 */
function applyScreenShake(ctx, intensity, durationMs, shakeState) {
    if (shakeState.timer <= 0) {
        shakeState.timer = durationMs; // Start shake
    }

    if (shakeState.timer > 0) {
        const remainingRatio = shakeState.timer / durationMs;
        const currentIntensity = intensity * remainingRatio; // Decrease intensity over time
        const offsetX = getRandomFloat(-currentIntensity, currentIntensity);
        const offsetY = getRandomFloat(-currentIntensity, currentIntensity);
        ctx.translate(offsetX, offsetY);
        // We'll need to track the elapsed time in the main loop to decrease shakeState.timer
    }
}

/**
 * Resets the canvas translation after screen shake.
 * Needs to be called after drawing everything affected by shake.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {object} shakeState - The shake state object.
 */
function resetScreenShake(ctx, shakeState) {
     if (shakeState.timer > 0) {
        // Find the translation applied in applyScreenShake and reverse it
        // This requires knowing the offsetX, offsetY applied.
        // A simpler approach for this game: save/restore context state.
        // The main loop will handle this with ctx.save() and ctx.restore().
     }
}

// Debounce function to prevent rapid direction changes causing self-collision
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};