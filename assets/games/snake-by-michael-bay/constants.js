// Grid and Tile Settings
const GRID_SIZE = 20; // Number of cells across/down
const TILE_SIZE = 25; // Pixel size of each grid cell
const CANVAS_WIDTH = GRID_SIZE * TILE_SIZE;
const CANVAS_HEIGHT = GRID_SIZE * TILE_SIZE;

// Game Speed
const BASE_SPEED_MS = 120; // Milliseconds per game tick (lower is faster)
const SPEED_INCREMENT_FACTOR = 0.98; // Multiplier to decrease interval per food
const MIN_SPEED_MS = 50; // Fastest allowed speed

// Colors
const BACKGROUND_COLOR = '#111';
const SNAKE_COLOR = '#00FF00'; // Bright green
const SNAKE_HEAD_COLOR = '#00AA00'; // Darker green for head
const FOOD_COLOR = '#FF0000'; // Bright red
const EXPLOSION_COLORS = ['#FFA500', '#FF8C00', '#FF4500', '#FF6347', '#FFFF00', '#FFFFFF'];
const TEXT_COLOR = '#FFFFFF';
const SCORE_COLOR = '#FFFF00';
const HIGH_SCORE_COLOR = '#FFA500';
const GAME_OVER_TEXT_COLOR = '#FF0000';

// Explosion Settings
const EXPLOSION_PARTICLE_COUNT = 50;
const EXPLOSION_DURATION_MS = 1500; // Total duration of explosion effect
const EXPLOSION_PARTICLE_LIFE_MS = 1000;
const EXPLOSION_PARTICLE_MAX_SPEED = 5;
const EXPLOSION_PARTICLE_MIN_SPEED = 1;
const EXPLOSION_PARTICLE_SIZE = 4;

// Slow Motion Settings
const SLOW_MOTION_DURATION_MS = 1000; // How long slow-mo lasts after trigger
const SLOW_MOTION_FACTOR = 3; // How much slower game runs (e.g., 3x slower)

// Local Storage Key
const HIGH_SCORE_KEY = 'michaelBaySnakeHighScore';