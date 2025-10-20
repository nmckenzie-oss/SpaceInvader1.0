// --- Game Constants and Initial State ---
const GAME_WIDTH = 600;
const GAME_HEIGHT = 800;
const LANDSCAPE_HEIGHT = 50;
const PLAYER_SIZE = 50;
const ALIEN_SIZE = 40;
const BULLET_SPEED = 13;
let ALIEN_SPEED = 0.4; // Slow vertical descent
let FIRE_RATE_BASE = 0.75; // shots/sec (base rate)
const QUIZ_DURATION = 15; // 15 seconds (medium difficulty)
const SHOP_DURATION = 30; // 30 seconds for the shop timer
const BOSS_LIVES = 10;     // Boss alien requires 10 hits (will be adjusted later)
const BOSS_HORIZONTAL_SPEED = 0.75; // Speed for side-to-side movement
const BOSS_VERTICAL_MAX = 100;    // Max vertical distance boss descends
const PIXEL_SIZE = 4; // Adjust this value to scale your pixel art
const ALIEN_ANIMATION_SPEED = 50; // Change frame every 15 game loop iterations (~0.25 seconds at 60 FPS)
const COLOR_MAP = {
    '#': '#004272ff', // Grey/Hull
    'M': '#4a4598ff', // Dark Blue/Missiles
    'C': '#66fcf1', // Cyan/Cockpit
    'E': '#ff0000', // Red/Engine Thrust
    'A': '#ff5500ff', // Orange
    'B': '#0000ff', // Blue
    'F': '#006affff', // Blue other
    'P': '#cc00ccff', // Purple
    'G': '#00ff00', // Green
    'L': '#e4c200ff', // Gold/Yellow
    'Y': '#838282ff', // Grey
    'U': '#930193ff', // Dark Purple
    'D': '#e6fb04ff', // Yellow
    'W': '#ffffffff', // Brown
    'X': '#1dc200ff', // Green
    'H': '#414141ff', // Dark Grey
    ' ': null       // Transparent/Background
    // Define colors for aliens here too
}
// Define boss alien data
const ALIEN_BOSS_DATA = {
    'boss-alien': { score: 500, name: 'Boss Alien', lives: BOSS_LIVES }
};


// --- Player Drawing Function ---
// --- Bullet Sprite Pattern ---
const BULLET_PATTERN = [
    'L', // Orange (Top)
    'L', // Red (Middle)
    'L', 
    'A',
    'E', // Orange (Bottom)
];
const BULLET_SPRITE_WIDTH = BULLET_PATTERN[0].length * PIXEL_SIZE; // 1 * 4 = 4
const BULLET_SPRITE_HEIGHT = BULLET_PATTERN.length * PIXEL_SIZE; // 5 * 4 = 20
// --- Ship Sprite Pattern ---
const SHIP_PATTERN = [
    '         #         ',
    '        #F#         ',
    '       #FFF#       ',
    '      #FFFFF#      ',
    '      #FBBBF#      ',
    '     #FBBBBBF#     ',
    '    #FFFFFFFFF#    ',
    '    #FFFFFFFFF#    ',
    '    #FFFFMFFFF#    ',
    '   #FFFFFMFFFF#  ',
    '  #FFFFFMMMFFFF#   ',
    ' #FFFF##MMM##FFFF# ',
    '######YY#M#YY######',
    '    #YEEY#YEEY#    ',
    '      EE   EE        '
]; // (16x12 pattern, requires PIXEL_SIZE=4 for 64x48 result)

// --- Alien Drawing Patterns (Define all your sprites here) ---
const ALIEN_PATTERNS = {
    // Orange classic alien (10x8 pattern) used for size calculations
    'orange-classic': [ 
        '  AAAAAAAA  ',
        ' AAAAAAAAAA ',
        'AAEEAAAAEEAA',
        'AAEEAAAAEEAA',
        'AAAAAAAAAAAA',
        ' AADDYYDDAA ',
        'AA  DDDD  AA',
        '  AA    AA  '
    ],
    // Orange classic alien (10x8 pattern) Frame 1
    'orange-classic-1': [
        '  AAAAAAAA  ',
        ' AAAAAAAAAA ',
        'AAEEAAAAEEAA',
        'AAEEAAAAEEAA',
        'AAAAAAAAAAAA',
        ' AADDYYDDAA ',
         'AA  DDDD  AA',
        '  AA    AA  '],
    // Orange classic alien (10x8 pattern) Frame 2
    'orange-classic-2': [
        '  AAAAAAAA  ',
        ' AAAAAAAAAA ',
        'AAEEAAAAEEAA',
        'AAEEAAAAEEAA',
        'AAAAAAAAAAAA',
        ' AADDDDDDAA ',
         'AA  DDDD  AA',
        ' AA      AA '],
     // Purple octopus alien (10x10 pattern) original
    'purple-octopus': [
        '  YYUUUUYY  ',
        ' YUUUUUUUUY ',
        'YUUBBPPBBUUY',
        'UUBBPPPPBBUU',
        'UUPPPPPPPPUU',
        'PPPPYYYYPPPP',
        'PP PPPPPP PP',
        'P  PPYYPP  P',
        'P   P  P   P',
         'PP        PP'],
    // Purple octopus alien (10x10 pattern) Frame 1
    'purple-octopus-1': [
        '  YYUUUUYY  ',
        ' YUUUUUUUUY ',
        'YUUBBPPBBUUY',
        'UUBBPPPPBBUU',
        'UUPPPPPPPPUU',
        'PPPPYYYYPPPP',
        'PP PPPPPP PP',
        'P  PPYYPP  P',
        'P   P  P   P',
         'PP        PP']
    // Purple octopus alien (10x10 pattern) Frame 2
    ,'purple-octopus-2': [
        '  YYUUUUYY  ',
        ' YUUUUUUUUY ',
        'YUUBBPPBBUUY',
        'UUBBPPPPBBUU',
        'UUPPPPPPPPUU',
        'PPPPYYYYPPPP',
        'PP PPPPPP PP',
        'P   PPPP   P',
        'PP        PP',
         ' PPP    PPP '],
 // Blue scout alien (10x10 pattern) Original
    'blue-scout': [
        ' FF  BBBB  FF ',
        'FFF BBBBBB FFF',
        ' FF BBBBBB FF ',
        '   BBFFFFBB   ',
        '  BBFFFFFFBB  ',
        ' BBFFCCCCFFBB ',
        'BB  FCCCCF  BB',
        ' B  FFFFFF  B '
    ],
    // Blue scout alien (10x10 pattern) Frame 1
    'blue-scout-1': [
        'FF   BBBB   FF',
        'FFF BBBBBB FFF',
        ' FF BBBBBB FF ',
        '   BBFFFFBB   ',
        '  BBFFFFFFBB  ',
        ' BBFFCCCCFFBB ',
        'BB  FCCCCF  BB',
        ' B  FFFFFF  B '
    ],
    // 10x10 pattern
    'blue-scout-2': [
        ' FF  BBBB  FF ',
        'FFF BBBBBB FFF',
        ' FF BBBBBB FF ',
        '   BBFFFFBB   ',
        '  BBFFFFFFBB  ',
        ' BBFFCCCCFFBB ',
        'BB  FCCCCF  BB',
        ' B  FFFFFF  B '
    ],

    // 10x10 pattern
    'green-robot': [
        'F##########F',
        '#AAAAAAAAAA#',
        '#ABBCCCCBBA#',
        'F#ACCCCCCCA#F',
        'F#ACC##CCA#F',
        'F#ACCCCCCCA#F',
        'F#A##CC##A#F',
        'F##########F',
        'F  ##FF##  F',
        ' F #FFFF# F '
    ],
    // 10x10 pattern
    'green-robot-1': [
        'F##########F',
        '#AAAAAAAAAA#',
        '#ABBCCCCBBA#',
        'F#ACCCCCCCA#F',
        'F#ACC##CCA#F',
        'F#ACCCCCCCA#F',
        'F#A##CC##A#F',
        'F##########F',
        'F  ##FF##  F',
        ' F #FFFF# F '
    ],
    // 10x10 pattern
    'green-robot-2': [
        'F##########F',
        '#AAAAAAAAAA#',
        '#ABBCCCCBBA#',
        'F#ACCCCCCCA#F',
        'F#ACC##CCA#F',
        'F#ACCCCCCCA#F',
        'F#A##CC##A#F',
        'F##########F',
        'F  ##FF##  F',
        ' F #FFFF# F '
    ],
    // 10x10 pattern gold warrior original
    'gold-warrior': [
        '     L     ',
        ' L L L L L ',
        'ELELELELELE',
        'LLLLLLLLLLL',
        'DGGDDDDDGGD',
        'DXXDDDDDXXD',
        ' DDDLDLDDD ',
        '  DDDDDDD',
        '   DDDDD   ',
        '    DDD    '
    ],
    // 10x10 pattern gold warrior frame 1
    'gold-warrior-1': [
        '     L     ',
        ' L L L L L ',
        'ALALALALALA',
        'LLLLLLLLLLL',
        'LLDDLLLDDLL',
        'LDDLYDYLDDL',
        ' DDLDLDLDD ',
        '  DLYDYLD  ',
        '   DLLLD   ',
        '    DLD    '
    ],
    // 10x10 pattern Gold warrior frame 2
    'gold-warrior-2': [
        '     L     ',
        ' L L L L L ',
        'ELELELELELE',
        'LLLLLLLLLLL',
        'LLDDLLLDDLL',
        'LDDLDYDLDDL',
        ' DDLYLYLDD ',
        '  DLDYDLD  ',
        '   DLLLD   ',
        '    DLD    '
    ],

    // 18x18 pattern (Boss)
    'boss-alien': [
        ' H               ',
        'H  HHHHHHHHHHHHHHH',
        'H HEEEEHFFFFFHEEEEEH',
        'HHELLEEEHHHHHEEELLEH',
        ' HELLLEEEEEEEEEELLLEH',
        ' HELLLEEEEEEEEEELLLEH',
        ' HELLLEEEEEEEEEELLLEH',
        ' HEEEEEHHEEEHHEEEEEEH',
        ' HEEEEEEHHHHHEEEEEEEH',
        ' HHHHHHEEEEEEEHHHHHH ',
        '       HHHHHHH       ',
        '  E   HEEEEEEEH   E  ',
        ' EEEHHHEEEEEEEHHHEEE ',
        ' EEEHHHEEEEEEEHHHEEE ',
        '      HEEEEEEEH      ',
        '     HHHH HHHHH     ',
        '    HEEEEH HEEHHH    ',
        '    HHHHHH HHHHHH    '
    ],
    //Boss alien (18x18 pattern) Frame 1
        'boss-alien-1': [
        'H                ',
        'H  HHHHHHHHHHHHHHH',
        'H HEEEEHFFFFFHEEEEEH',
        'HHELLEEEHHHHHEEELLEH',
        ' HELLLEEEEEEEEEELLLEH',
        ' HELLLEEEEEEEEEELLLEH',
        ' HEELLEEEEEEEEEELLEEH',
        ' HEEEEEHHEEEHHEEEEEEH',
        ' HEEEEEEHHHHHEEEEEEEH',
        ' HHHHHHEEEEEEEHHHHHH ',
        '       HHHHHHH       ',
        '  E   HEHEEEHEH   E  ',
        ' EEEHHHEHEEEHEHHHEEE ',
        ' EEEHHHEHEEEHEHHHEEE ',
        '      HEEEEEEEH      ',
        '     HHHH HHHHH     ',
        '    HEEEEH HEEEEH    ',
        '    HHHHHH HHHHHH    ',
],
    //Boss alien (18x18 pattern) Frame 2
        'boss-alien-2': [
        ' H               ',
        'H  HHHHHHHHHHHHHHH',
        'H HEEEEHAAAAAHEEEEEH',
        'HHELLEEEHHHHHEEELLEH',
        ' HELLLEEEEEEEEEELLLEH',
        ' HELLLEEEEEEEEEELLLEH',
        ' HEELLEEEEEEEEEELLEEH',
        ' HEEEEEEEEEEEEEEEEEEH',
        ' HEEEEEEHHHHHEEEEEEEH',
        ' HHHHHHEEEEEEEHHHHHH ',
        '       HHHHHHH       ',
        '      HEHEEEHEH      ',
        ' EEEHHHEHEEEHEHHHEEE ',
        ' EEEHHHEHEEEHEHHHEEE ',
        '      HEEEEEEEH      ',
        '     HHHH HHHHH     ',
        '    HEEEEH HEEEEH    ',
        '    HHHHHH HHHHHH    ']
};

function drawExplosions() {
    const currentTime = performance.now();
    
    gameState.explosions = gameState.explosions.filter(explosion => {
        const elapsedTime = currentTime - explosion.startTime;
        const timeRemaining = explosion.duration - elapsedTime;
        
        if (timeRemaining <= 0) {
            return false; 
        }
        // Calculate opacity and scale based on time
        const progress = elapsedTime / explosion.duration; // 0 to 1
        const opacity = 1 - progress; 
        const scale = 1 + progress * 1.5; // Scale from 1 to 2.5

        const size = 60; // Base size
        const currentSize = size * scale;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#ff4500'; // Orange/Red color

        // Draw a circle for simplicity, or use a pixel art explosion pattern
        ctx.beginPath();
        ctx.arc(
            explosion.x + ALIEN_SIZE / 2, // Center explosion on the alien's position
            explosion.y + ALIEN_SIZE / 2, 
            currentSize / 2, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        ctx.restore();

        return true;
    });
}

// Define all upgrade options for the shop
const UPGRADE_DATA = [
    // 1. Ship Speed (Uses existing playerSpeed variable)
    { id: 'player_speed', name: 'Player Speed Boost (+20%)', cost: 100, effect: () => gameState.playerSpeed *= 1.2, max: 3 }, 
    
    // 2. Correct Answer Boost
    { id: 'quiz_boost', name: 'Quiz Ammo Boost (+50%)', cost: 200, effect: () => gameState.quizAmmoMultiplier *= 1.5, max: 4 },
    
    // 3. Next Run Bonus
    { id: 'next_run_bonus', name: 'Next Run Bonus (+1000 Score)', cost: 1000, effect: () => gameState.nextRunBonusScore += 1000, max: 5 },
    
    // Keeping Extra Life and Max Ammo for balance, but you can remove them if needed
    { id: 'extra_life', name: 'Extra Life', cost: 100, effect: () => gameState.lives++, max: 5 },
    { id: 'max_ammo', name: 'Max Ammo Increase (+10)', cost: 50, effect: () => gameState.ammoMax += 10, max: 50 },
];

// Define all alien types and their scores
const ALIEN_DATA = {
    'orange-classic': { score: 5, name: 'Orange Classic' }, // Basic look
    'blue-scout': { score: 10, name: 'Blue Scout' },     // Fast-looking
    'purple-octopus': { score: 15, name: 'Purple Octopus' }, // Armored
    'green-robot': { score: 20, name: 'Green Robot' },    // Mechanical
    'gold-warrior': { score: 25, name: 'Gold Warrior' }    // Diamond/Crown
};

let gameState = {
    score: 0,
    lives: 10,
    ammo: 0, 
    ammoMax: 20,// Starts at 0
    playerX: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    playerSpeed: 4,
    bullets: [],
    aliens: [],
    explosions: [],
    keysPressed: {},
    isFiring: false,
    lastShotTime: 0,
    timeScoreInterval: null,
    alienSpawnTimer: 0,
    questions: [], // Loaded from JSON
    waveNumber: 1, // Start at Wave 1
    aliensToSpawn: 0,
    aliensSpawnedInWave: 0,
    timeSinceLastAlienSpawn: 0,
    nextAlienSpawnDelay: 0,
    isPaused: false,
    quizActive: false,
    currentQuestion: null,
    quizTimerInterval: null,
    shopActive: false,
    shopTimerInterval: null,
    shopUpgradesPurchased: {}, // Tracks purchases {id: count}
    bossActive: false,
    SPEED_COMPENSATION_FACTOR : 1.0,
    bossMoveDirection: 1, // 1 for right, -1 for left
    bossStartY: 0,    
    quizAmmoMultiplier: 1.0, // Base multiplier for ammo reward 
    nextRunBonusScore: 0,
    frameCount: 0, // Counts the frames until the next sprite change
    spriteFrameIndex: 0, // 0 or 1, determines which frame is drawn (Frame 1 or 2)
};

// --- DOM Elements ---

// 1. CANVAS ELEMENTS
const gameCanvas = document.getElementById('game-canvas');
// CRITICAL: Get the 2D drawing context for rendering
const ctx = gameCanvas.getContext('2d'); 
const scoreDisplay = document.getElementById('score-display');
const livesDisplay = document.getElementById('lives-display');
const ammoDisplay = document.getElementById('ammo-display');
const waveDisplay = document.getElementById('wave-display')
const quizContainer = document.getElementById('quiz-container');
const quizTimerEl = document.getElementById('quiz-timer');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const quizFeedbackEl = document.getElementById('quiz-feedback');
const shopContainer = document.getElementById('shop-container');
const shopTimerEl = document.getElementById('shop-timer');
const upgradeListEl = document.getElementById('upgrade-list');
const shopCloseButton = document.getElementById('shop-close-button');
shopCloseButton.addEventListener('click', endShop); // Set up listener

// --- Step 1 & 5: Update HUD and Lives Logic ---
function updateHUD() {
    scoreDisplay.textContent = `Score: ${gameState.score}`;
    livesDisplay.textContent = `Lives: ${gameState.lives}`;
    ammoDisplay.textContent = `Ammo: ${gameState.ammo}`;
    waveDisplay.textContent = `Wave: ${gameState.waveNumber}`;
}

function loseLife() {
    gameState.lives -= 1;
    updateHUD();
    if (gameState.lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    clearInterval(gameState.timeScoreInterval);
    localStorage.setItem('nextRunBonusScore', gameState.nextRunBonusScore)
    alert(`GAME OVER! Final Score: ${gameState.score}`);
    location.reload(); 
}
// --- Pixel Art Drawing Function ---
// --- Pixel Art Drawing Function ---
function drawPixelArt(x, y, pattern, pixelSize, colorMap) {
    // ⭐️ FIX: Ensure local pixel position is calculated correctly relative to the entity's (x, y)
    for (let row = 0; row < pattern.length; row++) {
        const line = pattern[row];
        for (let col = 0; col < line.length; col++) {
            const char = line[col];
            const color = colorMap[char];
            
            if (color) {
                ctx.fillStyle = color;
                
                // Draw a rectangle for the pixel
                // The x and y parameters passed to the function are the top-left corner of the sprite.
                // We add the offset (col * pixelSize) and (row * pixelSize) to that base position.
                ctx.fillRect(
                    x + col * pixelSize,     // x position of the pixel
                    y + row * pixelSize,     // y position of the pixel
                    pixelSize, 
                    pixelSize
                );
            }
        }
    }
}

// --- Step 1: Load Questions from JSON ---
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        const data = await response.json();
        gameState.questions = data.questions;
        console.log('Questions loaded successfully:', gameState.questions.length);
    } catch (error) {
        console.error('Error loading questions.json:', error);
    }
}

// --- Step 6: Survival Time Scoring ---
function startSurvivalScore() {
    // +1 point every 2 seconds
    gameState.timeScoreInterval = setInterval(() => {
        gameState.score += 1;
        updateHUD();
    }, 2000);
}

// --- Step 2: Player Movement and Controls ---
function handleKeyDown(e) {
    gameState.keysPressed[e.code] = true;
    if (e.code === 'Space') {
        gameState.isFiring = true;
    }
}

function handleKeyUp(e) {
    delete gameState.keysPressed[e.code];
    if (e.code === 'Space') {
        gameState.isFiring = false;
    }
}

function updatePlayerPosition() {
    let newX = gameState.playerX;
    
    // Left/Right Movement
    if (gameState.keysPressed['ArrowLeft'] || gameState.keysPressed['KeyA']) {
        newX -= gameState.playerSpeed * gameState.SPEED_COMPENSATION_FACTOR;
    }
    if (gameState.keysPressed['ArrowRight'] || gameState.keysPressed['KeyD']) {
        newX += gameState.playerSpeed * gameState.SPEED_COMPENSATION_FACTOR;
    }

    // Keep player within bounds
    newX = Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE));
    gameState.playerX = newX;
}

// --- Step 3: Shooting Mechanic ---
explosions: []

// --- Step 3: Shooting Mechanic ---
function fireBullet() {
    // Check for Ammo: stops firing when Ammo runs out.
    if (gameState.ammo <= 0) return;

    const currentTime = performance.now();
    const delay = 1000 / FIRE_RATE_BASE; 

    if (currentTime - gameState.lastShotTime > delay) {
        // Decrement Ammo
        gameState.ammo -= 1; 

        // Define actual sprite dimensions for calculation
        const bulletWidth = BULLET_SPRITE_WIDTH; // Current bullet width
        const shipSpriteWidth = SHIP_PATTERN[0].length * PIXEL_SIZE; // Ship width (76)
        const shipSpriteHeight = SHIP_PATTERN.length * PIXEL_SIZE; // Ship height (60)
        
        // ⭐️ CENTERING FIX: Use the actual ship's sprite width
        const startX = gameState.playerX + (shipSpriteWidth / 2) - (bulletWidth / 2); 
        const startY = GAME_HEIGHT - LANDSCAPE_HEIGHT - shipSpriteHeight;

        // Add to array for tracking (NO DOM ELEMENT)
        gameState.bullets.push({
            x: startX,
            y: startY,
        });

        gameState.lastShotTime = currentTime;
        updateHUD();
    }
}


function drawPlayer() {
    // The playerX position needs to be adjusted because the pattern is 16 columns wide.
    const spriteWidth = SHIP_PATTERN[0].length * PIXEL_SIZE;
    const drawX = gameState.playerX; 
    
    // Y position is constant, just above the landscape
    const drawY = GAME_HEIGHT - LANDSCAPE_HEIGHT - (SHIP_PATTERN.length * PIXEL_SIZE);

    drawPixelArt(drawX, drawY, SHIP_PATTERN, PIXEL_SIZE, COLOR_MAP);
}

function drawAliens() {
    // Get the current frame number (1 or 2)
    const currentFrame = gameState.spriteFrameIndex + 1; 

    gameState.aliens.forEach(alien => {
        let pattern;

        if (alien.type === 'orange-classic', 'purple-octopus', 'blue-scout', 'gold-warrior', 'green-robot', 'boss-alien') {
            // Select the animated pattern: 'orange-classic-1' or 'orange-classic-2'
            pattern = ALIEN_PATTERNS[`${alien.type}-${currentFrame}`]; 

        } else {
            // For all other aliens, use their static name (e.g., 'blue-scout').
            // If they are not defined, fallback to the main orange frame.
            pattern = ALIEN_PATTERNS[alien.type] || ALIEN_PATTERNS['orange-classic-1']; 
        }

        if (pattern) {
            // Draw the pixel art sprite
            drawPixelArt(alien.x, alien.y, pattern, PIXEL_SIZE, COLOR_MAP); 
            
            // Draw Boss Lives as text (optional)
            if (alien.type === 'boss-alien') {
                ctx.fillStyle = 'white';
                ctx.font = '16px monospace';
                ctx.textAlign = 'center';
                // You'll need to recalculate drawWidth for this text to center correctly
                const drawWidth = ALIEN_PATTERNS['boss-alien'][0].length * PIXEL_SIZE;
                ctx.fillText(
                    `LIVES: ${alien.lives}`, 
                    alien.x + drawWidth / 2, 
                    alien.y + alien.height + 20
                );
            }
        }
    });
}

function drawExplosions() {
    const currentTime = performance.now();
    
    gameState.explosions = gameState.explosions.filter(explosion => {
        const elapsedTime = currentTime - explosion.startTime;
        const timeRemaining = explosion.duration - elapsedTime;
        
        if (timeRemaining <= 0) {
            return false; // Remove expired explosion
        }

        // Calculate opacity and scale based on time
        const progress = elapsedTime / explosion.duration; // 0 to 1
        const opacity = 1 - progress; 
        const scale = 1 + progress * 1.5; // Scale from 1 to 2.5

        const size = 60; // Base size
        const currentSize = size * scale;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#ff4500'; // Orange/Red color

        // Draw a circle for simplicity, or use a pixel art explosion pattern
        ctx.beginPath();
        ctx.arc(
            explosion.x + ALIEN_SIZE / 2, // Center explosion on the alien's position
            explosion.y + ALIEN_SIZE / 2, 
            currentSize / 2, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        ctx.restore();

        return true;
    });
}

// --- Landscape Drawing Function ---
function drawLandscape() {
    const landscapeY = GAME_HEIGHT - LANDSCAPE_HEIGHT;
    
    // Example: Draw a solid green rectangle for the landscape
    ctx.fillStyle = '#385723'; 
    ctx.fillRect(0, landscapeY, GAME_WIDTH, LANDSCAPE_HEIGHT);

    // Optional: Draw a thin line for the surface
    ctx.fillStyle = '#6b8e23';
    ctx.fillRect(0, landscapeY, GAME_WIDTH, 5);
}

function drawBullets() {
    gameState.bullets.forEach(bullet => {
        // ⭐️ NEW: Draw the bullet pixel art sprite
        drawPixelArt(bullet.x, bullet.y, BULLET_PATTERN, PIXEL_SIZE, COLOR_MAP); 
    });
}

// --- Wave and Spawning Management ---

function startWave() {
    // I. Alien Count per Wave: Wave Number x 3
    gameState.aliensToSpawn = gameState.waveNumber * 2;
    gameState.aliensSpawnedInWave = 0;
    
    // ⭐️ NEW MANUAL COMPENSATION LOGIC
    // We assume the wave logic increases complexity/speed by a fixed factor (e.g., 5%) per wave.
    // We adjust the speed factors down to compensate.
    
    // Set the COMPENSATION FACTOR: Reduce movement by (WaveNumber - 1) * 0.05
    // Example: Wave 1 = 1.0. Wave 2 = 0.95. Wave 3 = 0.90.
   gameState.SPEED_COMPENSATION_FACTOR = 1.0 / gameState.waveNumber;
    
    // Ensure it doesn't go below a certain threshold (e.g., 0.5)
    gameState.SPEED_COMPENSATION_FACTOR = Math.max(0.5, gameState.SPEED_COMPENSATION_FACTOR);
    
    // Set the initial delay for the first alien
    setNextSpawnDelay();
    
    console.log(`Starting Wave ${gameState.waveNumber}. Factor: ${gameState.SPEED_COMPENSATION_FACTOR.toFixed(2)}`);
}

function setNextSpawnDelay() {
    // II. Randomized deployment times: from 0 seconds to (2 * Wave Number) seconds
    const maxDelaySeconds = gameState.waveNumber * 2;
    // Calculate delay in milliseconds
    gameState.nextAlienSpawnDelay = Math.random() * maxDelaySeconds * 1000;
    gameState.timeSinceLastAlienSpawn = 0; // Reset the timer
}

function manageWaves() {
    // If there are aliens left to spawn in the current wave
    if (gameState.aliensSpawnedInWave < gameState.aliensToSpawn) {
        
        // REMOVE the deltaTime logic and revert to the fixed step timer
        gameState.timeSinceLastAlienSpawn += (1000 / 60); // Revert to fixed step (~16.6ms)
        
        if (gameState.timeSinceLastAlienSpawn >= gameState.nextAlienSpawnDelay) {
            spawnAlien();
            gameState.aliensSpawnedInWave++;
            
            // Only calculate the next delay if there are more aliens to come
            if (gameState.aliensSpawnedInWave < gameState.aliensToSpawn) {
                setNextSpawnDelay();
            }
        }
    } else if (gameState.aliens.length === 0 && !gameState.quizActive && !gameState.shopActive && !gameState.bossActive) { 
        // Condition: Screen clear AND no interlude (Quiz, Shop, or Boss fight) running.
        
        // PHASE 4 CORE CHANGE: Check for Boss Wave (every 5th wave)
        if (gameState.waveNumber % 5 === 0) {
            // STOP, trigger SHOP. (Shop leads directly to Boss Wave)
            console.log(`Wave ${gameState.waveNumber} cleared. Starting Shop...`);
            startShop(); 
        } else {
            // Normal wave flow: Start the Quiz (Quiz leads directly to the next wave)
            console.log(`Wave ${gameState.waveNumber} cleared. Starting Quiz...`);
            startQuiz(); 
        }
    }
}
// --- Step 4: Basic Alien Spawning and Movement ---
function spawnAlien() {
    const alienTypes = Object.keys(ALIEN_DATA);
    const chosenTypeKey = alienTypes[Math.floor(Math.random() * alienTypes.length)];
    const alienData = ALIEN_DATA[chosenTypeKey];

    // Determine sprite width/height based on pattern
    const pattern = ALIEN_PATTERNS[chosenTypeKey] || ALIEN_PATTERNS['orange-classic'];
    const width = pattern[0].length * PIXEL_SIZE;
    const height = pattern.length * PIXEL_SIZE;

    // Randomized horizontal start positions
    const startX = Math.random() * (GAME_WIDTH - width);
    const newAlien = {
        x: startX,
        y: 0,
        type: chosenTypeKey,
        score: alienData.score,
        width: width,
        height: height
    };
    gameState.aliens.push(newAlien);
    
    // ⭐️ ADD THIS LINE:
    console.log("Alien Spawned:", newAlien);
}

function updateAliens() {
    const landscapeY = GAME_HEIGHT - LANDSCAPE_HEIGHT;

    gameState.aliens = gameState.aliens.filter(alien => {
        // Skip standard movement for the boss; its movement is handled by updateBossMovement()
        if (alien.type !== 'boss-alien') {
            alien.y += ALIEN_SPEED * gameState.SPEED_COMPENSATION_FACTOR; // Apply factor
        }

        // Step 5: Alien-to-Landscape Collision
        if (alien.y + alien.height >= landscapeY) {
            
            // 1. Trigger the Visual Effect
            createExplosion(alien.x, alien.y);
            
            // 2. Trigger the Consequence
            if (alien.type !== 'boss-alien' || alien.lives > 0) {
                loseLife(); 
            }

            // 3. Remove the alien from the array (NO DOM REMOVAL)
            return false;
        }

        return true;
    });
}

// --- Bullet Movement Function ---
function updateBullets() {
    gameState.bullets = gameState.bullets.filter(bullet => {
        bullet.y -= BULLET_SPEED * gameState.SPEED_COMPENSATION_FACTOR; // Apply factor

        // Remove if it goes off-screen
        if (bullet.y < 0) {
            return false;
        }

        return true;
    });
}

// --- Boss Movement Function ---
function updateBossMovement() {
    if (!gameState.bossActive || gameState.aliens.length === 0) return;

    const boss = gameState.aliens.find(a => a.type === 'boss-alien');
    if (!boss) return;

    // --- Horizontal Movement (Patrol) ---
    let newX = boss.x + BOSS_HORIZONTAL_SPEED * gameState.bossMoveDirection;

    // Check bounds:
    if (newX <= 0) {
        newX = 0;
        gameState.bossMoveDirection = 1; // Reverse to right
    } else if (newX + boss.width >= GAME_WIDTH) {
        newX = GAME_WIDTH - boss.width;
        gameState.bossMoveDirection = -1; // Reverse to left
    }
    
    boss.x = newX;
    // ❌ REMOVED: boss.el.style.left = `${boss.x}px`;

    // --- Vertical Movement (A slow, initial descent) ---
    if (boss.y < BOSS_VERTICAL_MAX) {
        boss.y += 0.2; 
    }
    // ❌ REMOVED: boss.el.style.top = `${boss.y}px`;
}

// ---Collision Detection and Explosion and boss ---
function checkCollisions() {
    // --- 1. Bullet vs. Alien Collisions (Modified for Boss) ---
    
    // Iterate backwards through the bullets to safely remove them
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        let bulletHitSomething = false;

        // Iterate backwards through the aliens/boss to safely remove them
        for (let j = gameState.aliens.length - 1; j >= 0; j--) {
            const alien = gameState.aliens[j];
            
            // AABB (Axis-Aligned Bounding Box) collision check
            if (
                bullet.x < alien.x + alien.width &&
                bullet.x + BULLET_SPRITE_WIDTH > alien.x &&     // Use new constant
                bullet.y < alien.y + alien.height &&
                bullet.y + BULLET_SPRITE_HEIGHT > alien.y   // 15 is bullet height
            ) {
                // Bullet hit detected
                bulletHitSomething = true;

                if (alien.type === 'boss-alien') {
                    // --- PHASE 4: BOSS DAMAGE LOGIC ---
                    alien.lives--;
                    
                    if (alien.lives <= 0) {
                        // Boss destroyed!
                        gameState.score += ALIEN_BOSS_DATA['boss-alien'].score; // Award full score
                        createExplosion(alien.x + alien.width / 2, alien.y + alien.height / 2); // Center explosion
                        gameState.aliens.splice(j, 1); // Remove Boss from array
                        gameState.bossActive = false; // Boss fight over
                        
                        // BOSS DEFEATED: Transition to the next wave
                        gameState.waveNumber++;
                        updateHUD();
                        startWave(); 
                    } else {
                        // Boss took damage but is still alive (no explosion)
                        console.log(`Boss hit! Lives remaining: ${alien.lives}`);
                    }
                } 
                else {
                    // Normal Alien (Orange, Blue, etc.)
                    
                    // 1. AWARD SCORE FIRST
                    gameState.score += 1 + alien.score;
                    
                    // 2. CREATE EXPLOSION using the alien's current position
                    createExplosion(alien.x, alien.y);
                    
                    // 3. REMOVE ALIEN from the DOM and the array LAST
                    gameState.aliens.splice(j, 1);
                }
                
                // Stop checking aliens, as the bullet is destroyed regardless of target
                break; 
            }
        }

        // If the bullet hit any alien or boss, remove it from the game
        if (bulletHitSomething) {

            gameState.bullets.splice(i, 1);
        }
    }

    updateHUD();
}

// Step 6: Pixel art explosion visual indicator
function createExplosion(x, y) {
    // Add an object to the explosions array to track it for drawing
    gameState.explosions.push({
        x: x,
        y: y,
        startTime: performance.now(),
        duration: 300 // Match the old CSS animation duration
    });
}


// --- Game Loop (Canvas Rendering) ---
function gameLoop() {
    // If the game is paused, exit the loop immediately
    if (gameState.isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }
    gameState.frameCount++;

    if (gameState.frameCount >= ALIEN_ANIMATION_SPEED) {
        // Cycle between index 0 and 1 (2 frames total)
        gameState.spriteFrameIndex = (gameState.spriteFrameIndex + 1) % 2; 
        gameState.frameCount = 0;
    }
    // 1. CLEAR CANVAS
    // Clears the entire drawing area every frame to prepare for the new draw
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // 2. UPDATE LOGIC (Movement, Spawning, Collisions)
    updatePlayerPosition(); 
    
    // Step 3: Auto-fire mechanic
    if (gameState.ammo > 0) {
        fireBullet(); 
    }
    
    // Step 4: Boss Movement Update
    if (gameState.bossActive) {
        updateBossMovement(); 
    }
    
    updateBullets();
    updateAliens();
    checkCollisions();

    // Spawn Logic
    manageWaves();

    // ===================================
    // 3. DRAW LOGIC (Rendering to Canvas)
    // ===================================
    // The landscape and game objects must be drawn now
    drawLandscape(); 
    drawPlayer(); 
    drawAliens();
    drawBullets(); 
    drawExplosions(); // Assuming you create a function to draw active explosions

    // ===================================
    // 4. NEXT FRAME
    // ===================================
    requestAnimationFrame(gameLoop);
}

// And ensure your init() calls it correctly:
function init() {
    // ... (rest of init) ...
    startSurvivalScore();
    gameLoop(); // Start the main game loop (NOT gameLoop(0))
}
// Note: We update init() in the final step to start gameLoop(0)
// --- Quiz System Functions ---
function startQuiz() {
    // Check if the initial list is loaded. Since we allow repeats, 
    // we only check if the list exists and has length > 0
    if (!gameState.questions || gameState.questions.length === 0) {
        console.error("No questions loaded. Cannot start quiz.");
        endQuiz();
        return;
    }

    gameState.isPaused = true;
    gameState.quizActive = true;
    quizContainer.classList.remove('hidden');

    // NEW: Start the marathon by loading the first question
    loadNextQuestion(); 

    // 3. Start the timer
    let timeLeft = QUIZ_DURATION;
    quizTimerEl.textContent = `Time Left: ${timeLeft}s`;

    gameState.quizTimerInterval = setInterval(() => {
        timeLeft--;
        quizTimerEl.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(gameState.quizTimerInterval);
            // MODIFIED: Call endQuiz directly when the timer hits zero
            endQuiz(); 
        }
    }, 1000);
}

function loadNextQuestion() {
    if (!gameState.questions || gameState.questions.length === 0) {
        console.log("Ran out of questions! You can continue working until the timer runs out.");
        // Optional: If we truly ran out, we could stop the timer here, 
        // but for now, we let the time run out to keep the phase length consistent.
        return; 
    }
    
    // Clear previous feedback
    quizFeedbackEl.classList.add('hidden');
    optionsContainer.innerHTML = '';

    // 1. Select a random question (allowing repeats)
    const qIndex = Math.floor(Math.random() * gameState.questions.length);
    gameState.currentQuestion = gameState.questions[qIndex]; 
    
    // 2. Display the question and options
    questionTextEl.textContent = gameState.currentQuestion.question;
    
    gameState.currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        // The handler now calls processAnswer instead of handleAnswer
        button.addEventListener('click', () => processAnswer(option, button));
        optionsContainer.appendChild(button);
    });
}

function processAnswer(selectedOption, button) {
    // Disable all buttons immediately after an answer is chosen
    Array.from(optionsContainer.children).forEach(btn => {
        btn.disabled = true;
    });

    const isCorrect = selectedOption === gameState.currentQuestion.answer;

    if (isCorrect) {
        // V. Ammo Reward: Each correct answer grants 5 Ammo (base) * multiplier
        // Use Math.ceil to ensure you always get at least 1 extra ammo when multiplying
        const baseAmmo = 5;
        const ammoReward = Math.round(baseAmmo * gameState.quizAmmoMultiplier);
        
        gameState.ammo += ammoReward; 
        button.classList.add('quiz-correct');
        quizFeedbackEl.textContent = `CORRECT! +${ammoReward} Ammo.`;
    } else {
        // Lives: A life is lost if a quiz question is answered incorrectly.
        loseLife(); 
        button.classList.add('quiz-incorrect');
        quizFeedbackEl.textContent = `INCORRECT! Answer: ${gameState.currentQuestion.answer}. -1 Life.`;
    }

    quizFeedbackEl.classList.remove('hidden');
    updateHUD();

    // After a short delay to show the feedback, load the next question
    setTimeout(loadNextQuestion, 1000); // 1 second delay
}

function endQuiz() {
    // 1. Cleanup quiz state
    gameState.currentQuestion = null;
    gameState.quizActive = false;
    quizContainer.classList.add('hidden');
    quizFeedbackEl.classList.add('hidden');
    
    // Resume the game loop
    gameState.isPaused = false;
    requestAnimationFrame(gameLoop); 
    
    // 2. Progression to the next wave
    
    // Increment the wave number AFTER the quiz is complete
    gameState.waveNumber++;
    updateHUD(); 

    // Check for the interlude (Boss Wave)
    if (gameState.waveNumber % 5 === 0) {
        // When a boss wave (5, 10, etc.) is detected AFTER a quiz, 
        // immediately start the shop, which leads to the boss.
        console.log(`Wave ${gameState.waveNumber} detected. Starting Shop interlude.`);
        startShop(); // <--- CRITICAL FIX: Explicitly start the Shop
    } else {
        // Normal wave progression: start the new wave
        startWave(); 
    }
}
// --- Shop System Functions ---
function startShop() {
    gameState.isPaused = true;
    gameState.shopActive = true;
    shopContainer.classList.remove('hidden');

    // Initialize purchase count for new shop round
    // We only need this if upgrades had limited purchases per round.
    // For now, we use the global shopUpgradesPurchased for max limit.

    displayUpgrades();
    
    // Start the timer
    let timeLeft = SHOP_DURATION;
    shopTimerEl.textContent = `Time Left: ${timeLeft}s`;

    gameState.shopTimerInterval = setInterval(() => {
        timeLeft--;
        shopTimerEl.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(gameState.shopTimerInterval);
            endShop(); // End shop on timeout
        }
    }, 1000);
}

function displayUpgrades() {
    upgradeListEl.innerHTML = '';
    
    UPGRADE_DATA.forEach(upgrade => {
        const button = document.createElement('button');
        button.className = 'upgrade-button';
        
        // Check if the upgrade has been purchased its max times
        const purchasedCount = gameState.shopUpgradesPurchased[upgrade.id] || 0;
        const isDisabled = upgrade.max !== undefined && purchasedCount >= upgrade.max;

        button.innerHTML = `
            <span>${upgrade.name}</span>
            <span>Cost: ${upgrade.cost} Score</span>
        `;
        button.disabled = isDisabled;
        
        button.addEventListener('click', () => buyUpgrade(upgrade, button));
        upgradeListEl.appendChild(button);
    });
}

function buyUpgrade(upgrade, button) {
    if (gameState.score >= upgrade.cost) {
        // Deduct score
        gameState.score -= upgrade.cost;
        
        // Apply effect (e.g., lives++, ammoMax++)
        upgrade.effect();
        
        // Track purchase
        gameState.shopUpgradesPurchased[upgrade.id] = (gameState.shopUpgradesPurchased[upgrade.id] || 0) + 1;
        
        updateHUD(); // Update score/lives/ammoMax display
        
        // Disable button if max purchased is reached
        const purchasedCount = gameState.shopUpgradesPurchased[upgrade.id];
        if (upgrade.max !== undefined && purchasedCount >= upgrade.max) {
            button.disabled = true;
            button.textContent = `${upgrade.name} (Max Purchased)`;
        }
        
        // Re-check all buttons in case the score deduction affects other purchase options
        displayUpgrades();
    } else {
        alert("Not enough score!");
    }
}
function endShop() {
    clearInterval(gameState.shopTimerInterval);
    gameState.shopActive = false;
    shopContainer.classList.add('hidden');
    
    // Transition directly into the Boss Wave setup
    startBossWave();
}

// --- Boss Wave Functions ---
function startBossWave() {
    console.log(`BOSS WAVE ${gameState.waveNumber} INITIATED!`);
    
    // Reset spawn counters from the previous wave
    gameState.aliensToSpawn = 0;
    gameState.aliensSpawnedInWave = 0;
    
    gameState.bossActive = true;
    
    // 1. Determine Boss Sprite size
    const bossPattern = ALIEN_PATTERNS['boss-alien'];
    const bossWidth = bossPattern[0].length * PIXEL_SIZE;
    const bossHeight = bossPattern.length * PIXEL_SIZE;
    const startX = (GAME_WIDTH / 2) - (bossWidth / 2); // Center it
    
    // ⭐️ CRITICAL FIX: Define bossData by looking it up in the constant map
    const bossData = ALIEN_BOSS_DATA['boss-alien'];
    
    gameState.aliens.push({
        x: startX,
        y: 0,
        type: 'boss-alien',
        score: bossData.score, 
        lives: bossData.lives, // Boss has multiple lives
        width: bossWidth,
        height: bossHeight
    });

    // Resume the game loop to fight the boss
    gameState.isPaused = false;
    requestAnimationFrame(gameLoop);
}
// --- Initialization ---
function init() {
    
    const savedBonus = parseInt(localStorage.getItem('nextRunBonusScore')) || 0;
    if (savedBonus > 0) {
        gameState.score += savedBonus;
        console.log(`Applied Next Run Bonus: +${savedBonus} Score.`);
        
        // Clear the bonus so it's not applied again if the player refreshes the game
        localStorage.removeItem('nextRunBonusScore');
    }
    // 1. Initial HUD call (Displays 10 Lives, 0 Score, 0 Ammo)
    updateHUD(); 
    
    loadQuestions(); 

    // Add 10 Ammo for initial testing! 
    gameState.ammo = 100;
    
    // 2. Second HUD call (Updates Ammo to 10)
    updateHUD(); 

    // REPLACE the old manual spawn/timer start with this:
    startWave();

    // Start listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    startSurvivalScore();
    gameLoop(); // Start the main game loop
}

init();