// --- Game Constants and Initial State ---
const GAME_WIDTH = 600;
const GAME_HEIGHT = 800;
const LANDSCAPE_HEIGHT = 50;
const PLAYER_SIZE = 50;
const ALIEN_SIZE = 40;
const BULLET_SPEED = 13;
let ALIEN_SPEED = 0.4; // Slow vertical descent
let FIRE_RATE_BASE = 0.6; // shots/sec (base rate)
const QUIZ_DURATION = 15; // 15 seconds (medium difficulty)
const SHOP_DURATION = 30; // 30 seconds for the shop timer
const BOSS_LIVES = 10;     // Boss alien requires 10 hits (will be adjusted later)
const BOSS_HORIZONTAL_SPEED = 0.75; // Speed for side-to-side movement
const BOSS_VERTICAL_MAX = 100;    // Max vertical distance boss descends
const PIXEL_SIZE = 4; // Adjust this value to scale your pixel art
const ALIEN_ANIMATION_SPEED = 50; // Change frame every 15 game loop iterations (~0.25 seconds at 60 FPS)
const NUM_STARS_MIN = 20; // Minimum number of stars
const NUM_STARS_MAX = 60; // Maximum number of stars
const PLAYER_MOVE_SPEED_BASE = 4; // Pixels per frame move speed
const BULLET_WIDTH = 2;   // The canvas width of the rendered bullet
const BULLET_HEIGHT = 15; // The canvas height of the bullet (a sensible height for a laser)
const BULLET_SPRITE_WIDTH = BULLET_WIDTH;   // Used for collision logic
const BULLET_SPRITE_HEIGHT = BULLET_HEIGHT; // Used for collision logic
const COLOR_MAP = {
    '#': '#004272ff', // Grey/Hull
    'M': '#4a4598ff', // Dark Blue/Missiles
    'C': '#66fcf1', // Cyan/Cockpit
    'E': '#ff0000', // Red/Engine Thrust
    'A': '#ff5500ff', // Orange
    'B': '#0000ff', // Blue
    'F': '#006affff', // Blue other
    'P': '#cc88ff', // Purple
    'G': '#00ff00', // Green
    'L': '#e4c200ff', // Gold/Yellow
    'Y': '#838282ff', // Grey
    'U': '#930193ff', // Dark Purple
    'D': '#e6fb04ff', // Yellow
    'W': '#ffffffff', // Brown
    'X': '#1dc200ff', // Green
    'H': '#414141ff', // Dark Grey
    'N': '#ff00c8ff', // PINK
    'V': '#2f7500ff', // Bright Pink
    'R': '#8b4513ff', // Brown
    'Q': '#015ad7ff', // Blue other
    ' ': null       // Transparent/Background
    // Define colors for aliens here too
}
// Define boss alien data
const ALIEN_BOSS_DATA = {
    'boss-alien': { score: 500, name: 'Boss Alien', lives: BOSS_LIVES }
};

// --- Bullet Sprite Pattern ---
const BULLET_PATTERN = [
    'DD', // Orange (Top)
    'LL', // Red (Middle)
    'LL', 
    'AA',
    'EE', // Orange (Bottom)
];
// --- Ship Sprite Pattern ---
const SHIP_PATTERN_1 = [
    '         #         ',
    '        #F#         ',
    '       #FFF#       ',
    '      #FFFFF#      ',
    '      #FBBBF#      ',
    '     #FBBBBBF#     ',
    '    #FFQFFFQFF#    ',
    '    #FFQFFFQFF#    ',
    '    #FFQFMFQFF#    ',
    '   #FFFQFMFQFF#  ',
    '  #FFFQFMMMFQFF#   ',
    ' #FFFQ##MMM##QFFF# ',
    'U#####YY#M#YY#####X',
    '    #YAAY#YAAY#    ',
    '      AA   AA        ',
    '      EE   EE        ',
    '      EE   EE        '
];
const SHIP_PATTERN_2 = [
    '         #         ',
    '        #F#         ',
    '       #FFF#       ',
    '      #FFFFF#      ',
    '      #FBBBF#      ',
    '     #FBBBBBF#     ',
    '    #FFQFFFQFF#    ',
    '    #FFQFFFQFF#    ',
    '    #FFQFMFQFF#    ',
    '   #FFFQFMFQFF#  ',
    '  #FFFQFMMMFQFF#   ',
    ' #FFFQ##MMM##QFFF# ',
    'X#####YY#M#YY#####U',
    '    #YEEY#YEEY#    ',
    '      EE   EE        ',
    '      AA   AA        ',
    '      AA   AA        '
];
const SHIP_PATTERN = SHIP_PATTERN_1;

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
        '  NNUUUUNN  ',
        ' NUUUUUUUUN ',
        'NUUFFPPFFUUN',
        'UUFFPPPPFFUU',
        'UUPPPPPPPPUU',
        'PPPPNNNNPPPP',
        'PP PPPPPP PP',
        'P  PPNNPP  P',
        'P   P  P   P',
         'PP        PP']
    // Purple octopus alien (10x10 pattern) Frame 2
    ,'purple-octopus-2': [
        '  NNUUUUNN  ',
        ' NUUUUUUUUN ',
        'NUUFFPPFFUUN',
        'UUFFPPPPFFUU',
        'UUPPPPPPPPUU',
        'PPPPNNNNPPPP',
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
        '  EE    EE  ',
        ' YEEY  YEEY ',
        ' LYYLLLLYYL  ',
        ' LDDDLLDDDL ',
        ' DDDDDDDDDD ',
        ' DDDDDDDDDD ',
        '  DDD  DDD ',
        '   DD  DD  ',
        '    D  D   ',
    ],
    // 10x10 pattern gold warrior frame 1
    'gold-warrior-1': [
        '  EE    EE  ',
        ' YEEY  YEEY ',
        ' LYYLLLLYYL  ',
        ' LDDDLLDDDL ',
        ' LDDDLLDDDL ',
        ' LDDDLLDDDL ',
        '  DDH  HDD ',
        '   DH  HD  ',
        '    H  H   ',
        '    H  H   ',
    ],
    // 10x10 pattern Gold warrior frame 2
    'gold-warrior-2': [
        '  EE    EE  ',
        ' YAAY  YAAY ',
        ' LYYLLLLYYL  ',
        ' LDDDLLDDDL ',
        ' LDDDLLDDDL ',
        ' LDDDLLDDDL ',
        '   DDHHDD  ',
        '    DHHD   ',
        '     HH    ',
        '     HH    ',
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

// --- Landscape Pixel Art Pattern (5x12 Pixels) ---
const LANDSCAPE_PATTERN = [
    '                                     ',
    '                                     ',
    'G  G  G             G  G  G          ',
    ' G GVG V GV G  G     G G G     G   G ',
    ' X GXG X VG G G  V  XG X GX   V G G   ',
    '  XGXVXV VXGGX VXV V  XGX XV V  XGG X',
    'GGXGXGXVVGGXGXGXVVVGGGXGXGXVVVGGGXGXG',
    'VVVXXXVVVVVVXXXVVVVVVVVXXXVVVVVVVXXXV',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
    'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
    'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
];

const LANDSCAPE_SPRITE_WIDTH = LANDSCAPE_PATTERN[0].length * PIXEL_SIZE; // 5 * 4 = 20

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

// --- Drawing Functions ---

// --- Drawing Functions ---
function drawLandscape() {
    const pattern = LANDSCAPE_PATTERN;
    const patternWidth = LANDSCAPE_SPRITE_WIDTH; 
    
    // The starting Y position is the bottom of the game minus the height of the landscape area (50px)
    // GAME_HEIGHT (800) - LANDSCAPE_HEIGHT (50) = 750
    const startY = GAME_HEIGHT - LANDSCAPE_HEIGHT; 

    // Loop horizontally across the entire game width (600)
    for (let x = 0; x < GAME_WIDTH; x += patternWidth) {
        
        // ⭐️ CRITICAL ACTION: Only call drawPixelArt for the tiling!
        drawPixelArt(
            x,              // Starting X position
            startY,         // Starting Y position (fixed at 750)
            pattern, 
            PIXEL_SIZE, 
            COLOR_MAP
        );
    }
}

const SHOP_ITEMS = {
    'fireRateBoost': {
        name: 'Fire Rate Boost',
        baseCost: 100,
        maxLevel: 5,
        effect: 0.25, // +0.25 shots/sec
        description: 'Increases shots per second by 0.25.'
    },
    'shipSpeed': {
        name: 'Ship Speed',
        baseCost: 150,
        maxLevel: 3,
        effect: 0.10, // +10% movement speed multiplier (0.10)
        description: 'Increases ship horizontal movement speed by 10% of base speed.'
    },
    'shieldGenerator': {
        name: 'Shield Generator',
        baseCost: 200,
        maxLevel: 1, // Limit of 1 purchase
        effect: 1, // Grants 1 permanent shield layer (1 life)
        description: 'Grants 1 permanent shield layer (absorbs 1 hit). Limit 1.'
    },
    'questionBonus': {
        name: 'Question Bonus',
        baseCost: 250,
        maxLevel: 5,
        effect: 1, // +1 ammo gained per question
        description: 'Increases the ammo gained per question by 1.'
    },
    'nextRunBonus': {
        name: 'Next Run Bonus (Permanent)',
        baseCost: 1500,
        maxLevel: 5,
        effect: { fireRate: 0.25, speed: 0.10, ammo: 1 },
        description: 'Permanent stats for upcoming runs: +1 Ammo/Q, +0.25 Fire Rate, +10% Speed.'
    }
};

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
    bullets: [],
    aliens: [],
    explosions: [],
    stars: [],
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
    frameCount: 0, // Counts the frames until the next sprite change
    spriteFrameIndex: 0, // 0 or 1, determines which frame is drawn (Frame 1 or 2)
    upgradeLevels: {
        fireRateBoost: 0,
        shipSpeed: 0,
        shieldGenerator: 0,
        questionBonus: 0,
        // The level of the permanent bonus from previous runs
        nextRunBonus: 0
    },
    playerSpeed: PLAYER_MOVE_SPEED_BASE,
    fireRate: FIRE_RATE_BASE,
    ammoBonus: 0,
};

let backgroundGradient = null;

// --- DOM Elements ---

// 1. CANVAS ELEMENTS
const gameCanvas = document.getElementById('game-canvas');
// CRITICAL: Get the 2D drawing context for rendering
const ctx = gameCanvas.getContext('2d'); 
const scoreDisplay = document.getElementById('score-display');
const livesDisplay = document.getElementById('lives-display');
const ammoDisplay = document.getElementById('ammo-display');
const waveDisplay = document.getElementById('wave-display')
const instructionsContainer = document.getElementById('instructions-container');
const beginGameButton = document.getElementById('begin-game-button');
const volumeSlider = document.getElementById('volume-slider');
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

// --- Gradient Helper Function ---
function createBackgroundGradient() {
    // Create a linear gradient object that goes from the top (y=0) to the bottom (y=GAME_HEIGHT)
    // NOTE: This assumes 'ctx' is available in the global scope or defined shortly after the constants.
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);

    // Dark Blue/Purple (Top)
    gradient.addColorStop(0, '#000000ff'); 
    // Mid Blue/Black (Middle)
    gradient.addColorStop(0.5, '#192a57ff');  
    // Dark Purple/Black (Bottom)
    gradient.addColorStop(1, '#3d2853ff');    

    return gradient;
}

// --- Star Background Logic ---

function generateStars() {
    gameState.stars = []; // Clear any existing stars
    
    // Generate a random number of stars within the defined range
    const numStars = Math.floor(Math.random() * (NUM_STARS_MAX - NUM_STARS_MIN + 1)) + NUM_STARS_MIN;

    for (let i = 0; i < numStars; i++) {
        // Star size: mostly 1 pixel, some 2 pixels for depth
        const size = Math.random() < 0.8 ? 1.5 : 2.5; 
        
        gameState.stars.push({
            // Random X/Y position within the game area, but above the landscape
            x: Math.random() * GAME_WIDTH,
            y: Math.random() * (GAME_HEIGHT - LANDSCAPE_HEIGHT),
            size: size,
            // Randomize color slightly for a flickering effect
            color: Math.random() < 0.5 ? '#aaaaaa' : '#ffffff' 
        });
    }
    console.log(`Generated ${numStars} stars for the background.`);
}

function drawStars() {
    gameState.stars.forEach(star => {
        ctx.fillStyle = star.color;
        // Draw the star as a simple filled square
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
}

// --- Shop Logic ---

// Assuming upgradeListEl is already defined globally:
// const upgradeListEl = document.getElementById('upgrade-list'); 

function showShop() {
    gameState.isPaused = true;
    shopContainer.classList.remove('hidden');
    
    // Clear previous upgrades
    upgradeListEl.innerHTML = ''; 

    // Generate new upgrade buttons
    for (const itemId in SHOP_ITEMS) {
        const item = SHOP_ITEMS[itemId];
        const currentLevel = gameState.upgradeLevels[itemId];
        const nextLevel = currentLevel + 1;
        
        // ⭐️ DYNAMIC COST CALCULATION: Base Cost * Next Level
        const cost = item.baseCost * nextLevel;
        const maxLevel = item.maxLevel;
        
        // Determine button state
        const isMaxLevel = currentLevel >= maxLevel;
        const canAfford = gameState.score >= cost;
        
        const buttonText = isMaxLevel 
            ? 'MAX LEVEL' 
            : `Buy Lvl ${nextLevel} (${cost} Score)`;

        const levelText = isMaxLevel 
            ? `Current: Lvl ${currentLevel} (MAX)`
            : `Current: Lvl ${currentLevel}`;
            
        // Shield Generator specific text: only 1 use
        const descriptionText = (itemId === 'shieldGenerator' && currentLevel >= 1)
            ? 'Already Used: Grants 1 permanent shield layer.' 
            : item.description;

        const itemHTML = `
            <div class="upgrade-item">
                <h4>${item.name}</h4>
                <p class="description">${descriptionText}</p>
                <div class="info-line">
                    <span class="level">${levelText}</span>
                    <button class="upgrade-button" 
                            data-id="${itemId}" 
                            ${isMaxLevel || !canAfford ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;
        upgradeListEl.insertAdjacentHTML('beforeend', itemHTML);
    }
    
    // Add event listeners to the dynamically generated buttons
    document.querySelectorAll('.upgrade-button').forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', () => buyUpgrade(button.dataset.id));
        }
    });

    // Ensure your shop timer function is called if it exists:
    // startShopTimer(); 
}


function buyUpgrade(itemId) {
    const item = SHOP_ITEMS[itemId];
    const currentLevel = gameState.upgradeLevels[itemId];
    const nextLevel = currentLevel + 1;
    // ⭐️ DYNAMIC COST CALCULATION: Base Cost * Next Level
    const cost = item.baseCost * nextLevel;

    if (gameState.score < cost || currentLevel >= item.maxLevel) {
        return; // Safety check
    }

    // 1. Deduct cost and update level
    gameState.score -= cost;
    gameState.upgradeLevels[itemId] = nextLevel;

    // 2. Apply effects
    switch (itemId) {
        case 'fireRateBoost':
            // Total fire rate increases by 0.25 per level
            gameState.fireRate = FIRE_RATE_BASE + (item.effect * nextLevel);
            break;
            
        case 'shipSpeed':
            // Recalculate total speed based on base speed * (1 + total percentage bonus)
            const totalSpeedEffect = item.effect * nextLevel;
            gameState.playerSpeed = PLAYER_MOVE_SPEED_BASE * (1 + totalSpeedEffect);
            break;
            
        case 'shieldGenerator':
            // Grants 1 life (permanent shield layer). Max Level 1.
            gameState.lives += item.effect; 
            break;
            
        case 'questionBonus':
            // Increases the ammo gained per question
            gameState.ammoBonus = item.effect * nextLevel;
            break;
            
        case 'nextRunBonus':
            // This permanently modifies the next game's starting stats
            const nextRunFireRateTotal = item.effect.fireRate * nextLevel;
            const nextRunSpeedTotal = item.effect.speed * nextLevel;
            const nextRunAmmoTotal = item.effect.ammo * nextLevel;
            
            // Save the cumulative total effects and the level to localStorage
            localStorage.setItem('nextRunBonusFireRate', nextRunFireRateTotal);
            localStorage.setItem('nextRunBonusSpeed', nextRunSpeedTotal);
            localStorage.setItem('nextRunBonusAmmo', nextRunAmmoTotal);
            localStorage.setItem('nextRunBonusLevel', nextLevel);
            break;
    }
    
    // 3. Re-render the shop and HUD
    updateHUD(); 
    showShop(); // Refresh shop to show new level/cost and disable button if MAX
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
    startMusic();
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

// --- Firing Bullet Function ---
function fireBullet() {
    // Check if enough time has passed since the last shot
    const now = performance.now();
    // fireRate is shots/second, so minTimeBetweenShots is in milliseconds
    const minTimeBetweenShots = 1000 / gameState.fireRate;

    if (now - gameState.lastShotTime < minTimeBetweenShots) {
        return;
    }

    if (gameState.ammo <= 0) {
        return;
    }

    // --- CRITICAL FIX: CORRECT CENTERING LOGIC ---
    // PLAYER_SIZE is 50, BULLET_WIDTH is 2.
    // Offset = (50 / 2) - (2 / 2) = 25 - 1 = 24.
    const bulletX = gameState.playerX + ((PLAYER_SIZE - BULLET_WIDTH) / 2) + 9; // This evaluates to gameState.playerX + 24

    gameState.bullets.push({
        x: bulletX, // The correctly centered x-coordinate
        y: gameState.playerY,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        // Note: Add any other properties your bullet objects require (e.g., type)
    });

    gameState.ammo--;
    gameState.lastShotTime = now;
    updateHUD();
}


function drawPlayer() {
    let pattern;
    
    // The animation index is 0 or 1. If it's 0 (frame 1), use SHIP_PATTERN_1. 
    // If it's 1 (frame 2), use SHIP_PATTERN_2.
    if (gameState.spriteFrameIndex === 0) {
        pattern = SHIP_PATTERN_1;
    } else {
        pattern = SHIP_PATTERN_2;
    }
    
    // NOTE: Ensure your SHIP_PATTERN_1 and SHIP_PATTERN_2 constants are defined 
    // outside of any function scope (at the top level of your game.js file).

    if (!pattern) {
        // Fallback in case animation keys are missing.
        console.error("Player pattern missing. Check SHIP_PATTERN_1/2 definitions.");
        return;
    }
    
    drawPixelArt(
        gameState.playerX, 
        gameState.playerY, 
        pattern, 
        PIXEL_SIZE, 
        COLOR_MAP
    );
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
    gameState.waveNumber++;
    // ⭐️ NEW: Regenerate stars for the new wave aesthetic
    generateStars();
    
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

// --- Global Elements ---
const canvas = document.getElementById('game-canvas');
// ⭐️ NEW: Audio Element
const gameMusic = document.getElementById('game-music'); 

// ... (other global variables)

// --- Utility Functions ---
// ⭐️ NEW: Function to un-mute and play music
function startMusic() {
    if (gameMusic && gameMusic.muted) {
        // Un-mute the element
        gameMusic.muted = false; 
        
        // Attempt to play the audio (sometimes necessary, depending on the browser)
        gameMusic.play().catch(error => {
            console.warn("Music auto-play prevented by browser. User interaction needed.", error);
        });
    }
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
    // ⭐️ NEW: Draw Solid Background Color (Black)
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
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
    drawStars();
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

    showShop();
    
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
    
    // ⭐️ NEW: Load Next Run Bonus stats and apply them
    const savedBonusFR = parseFloat(localStorage.getItem('nextRunBonusFireRate')) || 0;
    const savedBonusSpeed = parseFloat(localStorage.getItem('nextRunBonusSpeed')) || 0;
    const savedBonusAmmo = parseInt(localStorage.getItem('nextRunBonusAmmo')) || 0;
    const savedBonusLevel = parseInt(localStorage.getItem('nextRunBonusLevel')) || 0;

    // Apply permanent bonus stats to the initial game state
    gameState.fireRate = FIRE_RATE_BASE + savedBonusFR;
    // Speed is calculated as Base Speed * (1 + total percentage bonus)
    gameState.playerSpeed = PLAYER_MOVE_SPEED_BASE * (1 + savedBonusSpeed); 
    gameState.ammoBonus = savedBonusAmmo;
    // Set the permanent bonus level for display in the shop
    gameState.upgradeLevels.nextRunBonus = savedBonusLevel;
    // 1. Initial HUD call (Displays 10 Lives, 0 Score, 0 Ammo)
    updateHUD(); 
    generateStars();
    
    loadQuestions(); 
    backgroundGradient = createBackgroundGradient();
    // Add 10 Ammo for initial testing! 
    gameState.ammo = 100;

    // ⭐️ CRITICAL FIX: Initialize Player Position
    // playerX: Center the ship horizontally
    gameState.playerX = (GAME_WIDTH / 2) - (PLAYER_SIZE / 2); 
    // playerY: Position the ship just above the landscape
    // Note: We subtract a few extra pixels (e.g., 60) to account for the sprite's height.
    gameState.playerY = GAME_HEIGHT - LANDSCAPE_HEIGHT - 70;
    
    // 2. Second HUD call (Updates Ammo to 10)
    updateHUD(); 

    startWave();

    // Start listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    beginGameButton.addEventListener('click', startGame);
    gameState.isPaused = true;

    const initialVolume = parseFloat(volumeSlider.value) / 100;
    
    if (gameMusic) {
        gameMusic.volume = initialVolume;
    }
    
    // Listen for changes on the slider
    volumeSlider.addEventListener('input', updateVolume);

    gameState.isPaused = true;

    startSurvivalScore();
    gameLoop(); // Start the main game loop
}

function updateVolume() {
    if (gameMusic) {
        // Convert the 0-100 slider value to a 0.0-1.0 volume value
        gameMusic.volume = parseFloat(volumeSlider.value) / 100;
    }
}

// --- Game Start Function ---
function startGame() {
    // 1. Hide the instruction screen
    instructionsContainer.style.display = 'none';

    // 2. Unpause the game state
    gameState.isPaused = false;
    
    // 3. Start the game loop (The true beginning of the game)
    requestAnimationFrame(gameLoop);
    
    // 4. Also start the music, as this is guaranteed user interaction
    startMusic(); 
}

init();