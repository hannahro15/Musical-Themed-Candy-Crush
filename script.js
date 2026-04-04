// Game configuration
const SYMBOLS = ['🎵', '🎶', '🎸', '🎹', '🎻', '🎷', '🎺', '🥁'];
const BOARD_SIZE = 8;
const INITIAL_MOVES = 20;

// DOM elements — script runs after <body>, so these are available immediately
const playBtn = document.getElementById('playBtn');
const heading = document.querySelector('h1');
const menu = document.querySelector('.menu');
const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('movesDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');

// Game state
const gameState = {
    movesLeft: INITIAL_MOVES,
    score: 0,
    isResolving: false,
};
let draggedCell = null;
let touchStartCell = null;
let touchStartX = 0;
let touchStartY = 0;

// ── Setup ─────────────────────────────────────────────────────────────────────

playBtn.addEventListener('click', handlePlayClick);
gameBoard.addEventListener('dragstart', handleDragStart);
gameBoard.addEventListener('dragover', e => e.preventDefault());
gameBoard.addEventListener('drop', handleDrop);
gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
gameBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
gameBoard.addEventListener('touchend', handleTouchEnd);

// ── Event handlers ───────────────────────────────────────────────────────────

function handlePlayClick() {
    [heading, menu].forEach(el => el.classList.add('hidden'));
    [document.getElementById('game-board-container'), gameBoard, movesDisplay, scoreDisplay]
        .forEach(el => el.classList.remove('hidden'));

    if (gameBoard.children.length === 0) {
        gameState.movesLeft = INITIAL_MOVES;
        gameState.score = 0;
        updateMovesDisplay();
        updateScoreDisplay();
        generateGameBoard();
    }
}

function handleDragStart(e) {
    if (gameState.isResolving) { e.preventDefault(); return; }
    if (!e.target.classList.contains('cell')) return;
    draggedCell = e.target;
}
async function handleDrop(e) {
    e.preventDefault();
    if (gameState.isResolving || !draggedCell) return;

    const target = e.target;
    if (target.classList.contains('cell') && areAdjacent(draggedCell, target)) {
        await trySwap(draggedCell, target);
    }
    draggedCell = null;
}

// ── Touch handlers ───────────────────────────────────────────────────────────

function handleTouchStart(e) {
    if (gameState.isResolving) return;
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!cell?.classList.contains('cell')) return;
    e.preventDefault();
    touchStartCell = cell;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(e) {
    if (touchStartCell) e.preventDefault();
}

async function handleTouchEnd(e) {
    if (gameState.isResolving || !touchStartCell) return;
    
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    touchStartCell = null;

    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

    const children = [...gameBoard.children];
    const idx = children.indexOf(e.target.closest('.cell'));
    if (idx === -1) return;

    const col = idx % BOARD_SIZE;
    let targetIdx = idx;

    if (Math.abs(dx) > Math.abs(dy)) {
        targetIdx += dx > 0 && col < BOARD_SIZE - 1 ? 1 : dx < 0 && col > 0 ? -1 : 0;
    } else {
        targetIdx += dy > 0 ? BOARD_SIZE : -BOARD_SIZE;
    }

    if (targetIdx !== idx && targetIdx >= 0 && targetIdx < children.length) {
        await trySwap(children[idx], children[targetIdx]);
    }
}

// ── Shared swap logic ────────────────────────────────────────────────────────

async function trySwap(source, target) {
    swapCells(source, target);

    const matched = findMatches();
    if (matched.size === 0) {
        swapCells(source, target);
    } else {
        gameState.movesLeft--;
        updateMovesDisplay();
        await resolveBoard(matched);

        if (gameState.movesLeft <= 0) {
            alert(`Game Over! Final Score: ${gameState.score}`);
            return;
        }

        if (!hasValidMoves()) {
            shuffleBoard();
        }
    }
}

// ── Core helpers ─────────────────────────────────────────────────────────────

function swapCells(a, b) {
    [a.textContent, b.textContent] = [b.textContent, a.textContent];
}

function getCellGrid() {
    const cells = Array.from(gameBoard.children);
    const grid = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        grid.push(cells.slice(r * BOARD_SIZE, (r + 1) * BOARD_SIZE));
    }
    return grid;
}

function findMatches() {
    const matched = new Set();
    const cells = getCellGrid();

    // Scan a line of cells for runs of 3+
    function scanLine(line) {
        let start = 0;
        while (start <= line.length - 3) {
            const sym = line[start].textContent;
            if (!sym) { start++; continue; }
            let end = start + 1;
            while (end < line.length && line[end].textContent === sym) end++;
            if (end - start >= 3) {
                for (let i = start; i < end; i++) matched.add(line[i]);
            }
            start = end;
        }
    }

    // Scan all rows and columns
    for (let r = 0; r < BOARD_SIZE; r++) scanLine(cells[r]);
    for (let c = 0; c < BOARD_SIZE; c++) scanLine(cells.map(row => row[c]));

    return matched;
}

// ── Cascade resolution ────────────────────────────────────────────────────────

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function resolveBoard(matched) {
    gameState.isResolving = true;
    try {
        while (matched.size > 0) {
            gameState.score += scoreForMatch(matched.size);
            updateScoreDisplay();
            matched.forEach(cell => cell.classList.add('matched'));
            await delay(300);
            matched.forEach(cell => { cell.classList.remove('matched'); cell.textContent = ''; });
            await delay(150);
            applyGravity();
            await delay(300);
            matched = findMatches();
        }
    } finally {
        gameState.isResolving = false;
    }
}

function applyGravity() {
    const cells = getCellGrid();

    for (let col = 0; col < BOARD_SIZE; col++) {
        // Collect non-empty symbols from bottom to top
        const filled = [];
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            if (cells[row][col].textContent) filled.push(cells[row][col].textContent);
        }

        // Rewrite column: filled symbols at bottom, new random ones at top
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            const idx = BOARD_SIZE - 1 - row;
            cells[row][col].textContent = idx < filled.length ? filled[idx] : getRandomSymbol();
        }
    }
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function updateMovesDisplay() {
    movesDisplay.textContent = `Moves: ${gameState.movesLeft}`;
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${gameState.score}`;
}

// ── Utility functions ─────────────────────────────────────────────────────────

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

// Pick a random symbol that won't form a 3-in-a-row match at (row, col)
function safeSymbol(grid, row, col) {
    const forbidden = new Set();
    if (col >= 2 && grid[row][col - 1] === grid[row][col - 2]) 
        forbidden.add(grid[row][col - 1]);
    if (row >= 2 && grid[row - 1][col] === grid[row - 2][col]) 
        forbidden.add(grid[row - 1][col]);
    
    const available = SYMBOLS.filter(s => !forbidden.has(s));
    return available[Math.floor(Math.random() * available.length)];
}

// Function to generate the game board
function generateGameBoard() {
    gameBoard.innerHTML = '';
    const grid = Array.from({ length: BOARD_SIZE }, () => []);
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const sym = safeSymbol(grid, i, j);
            grid[i][j] = sym;
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = sym;
            cell.draggable = true;
            gameBoard.appendChild(cell);
        }
    }
}

function areAdjacent(a, b) {
    const children = [...gameBoard.children];
    const [ia, ib] = [children.indexOf(a), children.indexOf(b)];
    const diff = Math.abs(ia - ib);
    const sameRow = Math.floor(ia / BOARD_SIZE) === Math.floor(ib / BOARD_SIZE);
    return diff === BOARD_SIZE || (diff === 1 && sameRow);
}

// Points awarded based on number of matched cells
function scoreForMatch(size) {
    if (size === 3) return 10;
    if (size === 4) return 20;
    if (size === 5) return 40;
    if (size > 5) return 60;
    return 0;
}

// Check if any adjacent swap produces at least one 3-in-a-row
function hasValidMoves() {
    const cells = getCellGrid();
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            // Try swap right
            if (c < BOARD_SIZE - 1) {
                swapCells(cells[r][c], cells[r][c + 1]);
                if (findMatches().size > 0) {
                    swapCells(cells[r][c], cells[r][c + 1]);
                    return true;
                }
                swapCells(cells[r][c], cells[r][c + 1]);
            }
            // Try swap down
            if (r < BOARD_SIZE - 1) {
                swapCells(cells[r][c], cells[r + 1][c]);
                if (findMatches().size > 0) {
                    swapCells(cells[r][c], cells[r + 1][c]);
                    return true;
                }
                swapCells(cells[r][c], cells[r + 1][c]);
            }
        }
    }
    return false;
}

// Shuffle all board symbols until the board has valid moves and no existing matches
function shuffleBoard() {
    const cells = Array.from(gameBoard.children);
    let attempts = 0;
    
    do {
        const symbols = cells.map(cell => cell.textContent);
        
        // Fisher-Yates shuffle
        for (let i = symbols.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
        }
        
        cells.forEach((cell, idx) => cell.textContent = symbols[idx]);