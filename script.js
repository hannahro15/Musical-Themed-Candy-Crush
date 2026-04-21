import { LEVELS, getLevelConfig } from './levels.js';
import { showMenuPage, updateLivesDisplay, updateMovesDisplay, updateScoreDisplay, updateLevel1Counters, updateTimerDisplay } from './ui.js';
import { swapCellContents, areAdjacent, getRandomSymbol, scoreForMatch } from './game.js';
import { handleDragStart, handleDrop, handleTouchStart, handleTouchEnd } from './interaction.js';
import { getCellGrid, findMatches, getSafeSymbol, generateGameBoard } from './board.js';
import { BOARD_SIZE, SYMBOLS, INITIAL_LIVES } from './constants.js';
// ...existing code...

// On page load, show only the menu
document.addEventListener('DOMContentLoaded', showMenuPage);
const playButton = document.getElementById('playBtn');
const heading = document.querySelector('h1');
const menu = document.querySelector('.menu');
const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('movesDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const violinCounter = document.getElementById('violinCounter');
const pianoCounter = document.getElementById('pianoCounter');
const level1Counters = document.getElementById('level1-counters');
const timerDisplay = document.getElementById('timerDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const restartBtn = document.getElementById('restartBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const restartContainer = document.getElementById('restartContainer');


// Game state
const DEFAULT_LEVEL = 1;
const initialLevelConfig = getLevelConfig(DEFAULT_LEVEL);
    timerDisplay.classList.remove('hidden');
    document.getElementById('levelDisplay').classList.remove('hidden');
    livesDisplay.classList.remove('hidden');
    restartContainer.classList.add('hidden');
    document.getElementById('levelDisplay').textContent = `Level ${levelNum}`;
    updateLivesDisplay();
    updateMovesDisplay();
    updateScoreDisplay();
    updateLevel1Counters();
    updateTimerDisplay();
    generateGameBoard();
    startTimer();

function updateLivesDisplay() {
    livesDisplay.textContent = `❤️ Lives: ${gameState.lives}`;
}

function handleRestartLevel() {
    // If out of lives, reset to menu
    if (gameState.lives === 0) {
        showMenuPage();
        // Reset lives for next session
        gameState.lives = null;
        return;
    }
    // Reset everything as if starting the current level fresh
    const config = getLevelConfig(gameState.level);
    heading.classList.add('hidden');
    menu.classList.add('hidden');
    document.getElementById('game-board-container').classList.remove('hidden');
    gameBoard.classList.remove('hidden');
    document.getElementById('score-moves-wrapper').classList.remove('hidden');
    level1Counters.classList.remove('hidden');
    movesDisplay.classList.remove('hidden');
    scoreDisplay.classList.remove('hidden');
    timerDisplay.classList.remove('hidden');
    document.getElementById('levelDisplay').classList.remove('hidden');
    livesDisplay.classList.remove('hidden');
    restartContainer.classList.add('hidden');
    gameState.movesLeft = config.moves;
    gameState.score = 0;
    gameState.violinsLeft = config.violins;
    gameState.pianosLeft = config.pianos;
    gameState.levelComplete = false;
    gameState.timer = config.timer;
    gameState.timerActive = true;
    updateLivesDisplay();
    updateMovesDisplay();
    updateScoreDisplay();
    updateLevel1Counters();
    updateTimerDisplay();
    generateGameBoard();
    startTimer();
}
function updateTimerDisplay() {
    timerDisplay.textContent = `Time: ${gameState.timer}s`;
}

function startTimer() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        if (!gameState.timerActive) return;
        gameState.timer--;
        updateTimerDisplay();
        if (gameState.timer <= 0) {
            gameState.timer = 0;
            updateTimerDisplay();
            clearInterval(gameState.timerInterval);
            gameState.timerActive = false;
            showLevel1Result(false, true);
        }
    }, 1000);
}




// ── Shared swap logic ────────────────────────────────────────────────────────

async function trySwap(sourceCell, targetCell) {
    if (gameState.movesLeft <= 0 || gameState.isResolving || gameState.levelComplete || !gameState.timerActive) return;
    gameState.isResolving = true;
    swapCellContents(sourceCell, targetCell);
    let matchedGroups = findMatches();
    if (matchedGroups.length === 0) {
        swapCellContents(sourceCell, targetCell);
        gameState.isResolving = false;
    } else {
        gameState.movesLeft--;
        updateMovesDisplay();
        await resolveBoardAndLevel1(matchedGroups);
        if (gameState.levelComplete) return;
        if (gameState.movesLeft === 0) {
            showLevel1Result();
            return;
        }
        if (!hasValidMoves()) {
            shuffleBoard();
        }
        // After cascades, check for new matches before allowing next move
        let postCascadeGroups = findMatches();
        while (postCascadeGroups.length > 0) {
            await resolveBoardAndLevel1(postCascadeGroups);
            if (gameState.levelComplete) return;
            postCascadeGroups = findMatches();
        }
        gameState.isResolving = false;
    }
}

// ── Core helpers ─────────────────────────────────────────────────────────────

function swapCellContents(cellA, cellB) {
    [cellA.textContent, cellB.textContent] = [cellB.textContent, cellA.textContent];
}

function getCellGrid() {
    const allCells = Array.from(gameBoard.children);
    const grid = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        grid.push(allCells.slice(row * BOARD_SIZE, (row + 1) * BOARD_SIZE));
    }
    return grid;
}

function findMatches() {
    // Returns an array of match groups, each group is an array of cells
    const grid = getCellGrid();
    const matchedGroups = [];
    const visited = new Set();

    function scanLineForMatches(line) {
        let startIndex = 0;
        while (startIndex <= line.length - 3) {
            const symbol = line[startIndex].textContent;
            if (!symbol) { startIndex++; continue; }
            let endIndex = startIndex + 1;
            while (endIndex < line.length && line[endIndex].textContent === symbol) endIndex++;
            if (endIndex - startIndex >= 3) {
                const group = [];
                for (let i = startIndex; i < endIndex; i++) {
                    if (!visited.has(line[i])) {
                        group.push(line[i]);
                        visited.add(line[i]);
                    }
                }
                if (group.length > 0) matchedGroups.push(group);
            }
            startIndex = endIndex;
        }
    }

    for (let row = 0; row < BOARD_SIZE; row++) scanLineForMatches(grid[row]);
    for (let col = 0; col < BOARD_SIZE; col++) scanLineForMatches(grid.map(row => row[col]));

    return matchedGroups;
}

// ── Cascade resolution ────────────────────────────────────────────────────────

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Level 1: resolve board and update counters
async function resolveBoardAndLevel1(matchedGroups) {
    gameState.isResolving = true;
    try {
        while (matchedGroups.length > 0) {
            for (const group of matchedGroups) {
                // Level 1: count violins and pianos
                let violins = 0, pianos = 0;
                for (const cell of group) {
                    if (cell.textContent === '🎻') violins++;
                    if (cell.textContent === '🎹') pianos++;
                }
                if (violins > 0) gameState.violinsLeft = Math.max(0, gameState.violinsLeft - violins);
                if (pianos > 0) gameState.pianosLeft = Math.max(0, gameState.pianosLeft - pianos);
                updateLevel1Counters();
                // Only award score if group contains at least one violin or piano
                if (violins > 0 || pianos > 0) {
                    gameState.score += scoreForMatch(group.length);
                }
                group.forEach(cell => cell.classList.add('matched'));
            }
            updateScoreDisplay();
            await delay(300);
            for (const group of matchedGroups) {
                group.forEach(cell => { cell.classList.remove('matched'); cell.textContent = ''; });
            }
            await delay(150);
            applyGravity();
            await delay(300);
            matchedGroups = findMatches();
            // Check win condition after each cascade
            if (gameState.violinsLeft === 0 && gameState.pianosLeft === 0) {
                gameState.levelComplete = true;
                showLevel1Result(true);
                return;
            }
        }
    } finally {
        gameState.isResolving = false;
    }
}

async function resolveBoard(matchedGroups) {
    gameState.isResolving = true;
    try {
        while (matchedGroups.length > 0) {
            // Score for all groups in this cascade
            for (const group of matchedGroups) {
                gameState.score += scoreForMatch(group.length);
                group.forEach(cell => cell.classList.add('matched'));
            }
            updateScoreDisplay();
            await delay(300);
            for (const group of matchedGroups) {
                group.forEach(cell => { cell.classList.remove('matched'); cell.textContent = ''; });
            }
            await delay(150);
            applyGravity();
            await delay(300);
            matchedGroups = findMatches();
        }
    } finally {
        gameState.isResolving = false;
    }
}

function applyGravity() {
    const grid = getCellGrid();

    for (let col = 0; col < BOARD_SIZE; col++) {
        const filledSymbols = [];
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            if (grid[row][col].textContent) filledSymbols.push(grid[row][col].textContent);
        }

        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            const symbolIndex = BOARD_SIZE - 1 - row;
            grid[row][col].textContent = symbolIndex < filledSymbols.length 
                ? filledSymbols[symbolIndex] 
                : getRandomSymbol();
        }
    }
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function updateMovesDisplay() {
    movesDisplay.textContent = `Moves: ${gameState.movesLeft}`;
}

function updateLevel1Counters() {
    violinCounter.textContent = `🎻: ${gameState.violinsLeft}`;
    pianoCounter.textContent = `🎹: ${gameState.pianosLeft}`;
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${gameState.score}`;
}

// ── Utility functions ─────────────────────────────────────────────────────────

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function getSafeSymbol(grid, row, col) {
    const forbiddenSymbols = new Set();
    if (col >= 2 && grid[row][col - 1] === grid[row][col - 2]) 
        forbiddenSymbols.add(grid[row][col - 1]);
    if (row >= 2 && grid[row - 1][col] === grid[row - 2][col]) 
        forbiddenSymbols.add(grid[row - 1][col]);
    
    const availableSymbols = SYMBOLS.filter(symbol => !forbiddenSymbols.has(symbol));
    return availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
}

function generateGameBoard() {
    gameBoard.innerHTML = '';
    const grid = Array.from({ length: BOARD_SIZE }, () => []);
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const symbol = getSafeSymbol(grid, row, col);
            grid[row][col] = symbol;
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = symbol;
            cell.draggable = true;
            gameBoard.appendChild(cell);
        }
    }
}

function areAdjacent(cellA, cellB) {
    const allCells = [...gameBoard.children];
    const [indexA, indexB] = [allCells.indexOf(cellA), allCells.indexOf(cellB)];
    const indexDiff = Math.abs(indexA - indexB);
    const sameRow = Math.floor(indexA / BOARD_SIZE) === Math.floor(indexB / BOARD_SIZE);
    return indexDiff === BOARD_SIZE || (indexDiff === 1 && sameRow);
}

function scoreForMatch(matchSize) {
    if (matchSize === 3) return 10;
    if (matchSize === 4) return 20;
    if (matchSize === 5) return 40;
    if (matchSize > 5) return 60;
    return 0;
}

function hasValidMoves() {
    const grid = getCellGrid();
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (col < BOARD_SIZE - 1) {
                swapCellContents(grid[row][col], grid[row][col + 1]);
                if (findMatches().length > 0) {
                    swapCellContents(grid[row][col], grid[row][col + 1]);
                    return true;
                }
                swapCellContents(grid[row][col], grid[row][col + 1]);
            }
            if (row < BOARD_SIZE - 1) {
                swapCellContents(grid[row][col], grid[row + 1][col]);
                if (findMatches().length > 0) {
                    swapCellContents(grid[row][col], grid[row + 1][col]);
                    return true;
                }
                swapCellContents(grid[row][col], grid[row + 1][col]);
            }
        }
    }
    return false;
}

function shuffleBoard() {
    const allCells = Array.from(gameBoard.children);
    let attempts = 0;
    
    do {
        const symbols = allCells.map(cell => cell.textContent);
        
        for (let i = symbols.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [symbols[i], symbols[randomIndex]] = [symbols[randomIndex], symbols[i]];
        }
        
        allCells.forEach((cell, index) => cell.textContent = symbols[index]);
    } while (findMatches().length > 0 && attempts++ < 5);
}



function showLevel1Result(won, timedOut = false) {
    gameState.levelComplete = true;
    gameState.timerActive = false;
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    if (won) {
        // Unlock next level if not already unlocked
        if (gameState.level >= gameState.maxUnlockedLevel) {
            setMaxUnlockedLevel(gameState.level + 1);
            gameState.maxUnlockedLevel = gameState.level + 1;
        }
        scoreDisplay.textContent = `Level Complete! Score: ${gameState.score}`;
        movesDisplay.textContent = '🎉 You Win!';
        restartContainer.classList.add('hidden');
        nextLevelContainer.classList.remove('hidden');
    } else if (timedOut) {
        scoreDisplay.textContent = `Time's up! Score: ${gameState.score}`;
        movesDisplay.textContent = '⏰ Game Over!';
        restartContainer.classList.remove('hidden');
        nextLevelContainer.classList.add('hidden');
    } else {
        scoreDisplay.textContent = `Level Failed. Score: ${gameState.score}`;
        movesDisplay.textContent = 'Game Over!';
        restartContainer.classList.remove('hidden');
        nextLevelContainer.classList.add('hidden');
    }
    level1Counters.classList.add('hidden');
    gameBoard.classList.add('hidden');
    timerDisplay.classList.add('hidden');
    livesDisplay.classList.remove('hidden');
}
