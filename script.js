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

// Game state
const gameState = {
    movesLeft: INITIAL_MOVES,
    isResolving: false,
};
let draggedCell = null;

// ── Setup ─────────────────────────────────────────────────────────────────────

playBtn.addEventListener('click', handlePlayClick);
gameBoard.addEventListener('dragstart', handleDragStart);
gameBoard.addEventListener('dragover', e => e.preventDefault());
gameBoard.addEventListener('drop', handleDrop);

// ── Event handlers ───────────────────────────────────────────────────────────

function handlePlayClick() {
    heading.classList.add('hidden');
    menu.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    movesDisplay.classList.remove('hidden');

    if (gameBoard.children.length === 0) {
        gameState.movesLeft = INITIAL_MOVES;
        updateMovesDisplay();
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

    const source = draggedCell;
    const target = e.target;
    draggedCell = null;

    if (!target.classList.contains('cell') || !areAdjacent(source, target)) return;

    swapCells(source, target);

    const matched = findMatches();
    if (matched.size === 0) {
        swapCells(source, target); // revert — no match formed
    } else {
        gameState.movesLeft--;
        updateMovesDisplay();
        await resolveBoard(matched);
    }
}

// ── Core helpers ─────────────────────────────────────────────────────────────

function swapCells(a, b) {
    [a.textContent, b.textContent] = [b.textContent, a.textContent];
}

function getCellGrid() {
    const flat = Array.from(gameBoard.children);
    return Array.from({ length: BOARD_SIZE }, (_, r) => flat.slice(r * BOARD_SIZE, (r + 1) * BOARD_SIZE));
}

function findMatches() {
    const matched = new Set();
    const cells = getCellGrid();

    // Horizontal runs of 3+
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c <= BOARD_SIZE - 3; c++) {
            const sym = cells[r][c].textContent;
            if (!sym) continue;
            if (cells[r][c + 1].textContent === sym && cells[r][c + 2].textContent === sym) {
                matched.add(cells[r][c]);
                matched.add(cells[r][c + 1]);
                matched.add(cells[r][c + 2]);
                for (let k = c + 3; k < BOARD_SIZE && cells[r][k].textContent === sym; k++) {
                    matched.add(cells[r][k]);
                }
            }
        }
    }

    // Vertical runs of 3+
    for (let c = 0; c < BOARD_SIZE; c++) {
        for (let r = 0; r <= BOARD_SIZE - 3; r++) {
            const sym = cells[r][c].textContent;
            if (!sym) continue;
            if (cells[r + 1][c].textContent === sym && cells[r + 2][c].textContent === sym) {
                matched.add(cells[r][c]);
                matched.add(cells[r + 1][c]);
                matched.add(cells[r + 2][c]);
                for (let k = r + 3; k < BOARD_SIZE && cells[k][c].textContent === sym; k++) {
                    matched.add(cells[k][c]);
                }
            }
        }
    }

    return matched;
}

// ── Cascade resolution ────────────────────────────────────────────────────────

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function resolveBoard(matched) {
    gameState.isResolving = true;
    try {
        while (matched.size > 0) {
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
        // Compact non-empty symbols to the bottom of each column
        let writeRow = BOARD_SIZE - 1;
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            if (cells[row][col].textContent !== '') {
                if (writeRow !== row) {
                    cells[writeRow][col].textContent = cells[row][col].textContent;
                    cells[row][col].textContent = '';
                }
                writeRow--;
            }
        }
        // Fill remaining empty cells at the top with new random symbols
        for (let row = writeRow; row >= 0; row--) {
            cells[row][col].textContent = getRandomSymbol();
        }
    }
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function updateMovesDisplay() {
    movesDisplay.textContent = `Moves: ${gameState.movesLeft}`;
}

// ── Utility functions ─────────────────────────────────────────────────────────

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

// Pick a random symbol that won't form a 3-in-a-row match at (row, col)
// given the partially-filled grid built so far.
function safeSymbol(grid, row, col) {
    const forbidden = new Set();
    if (col >= 2 && grid[row][col - 1] === grid[row][col - 2]) forbidden.add(grid[row][col - 1]);
    if (row >= 2 && grid[row - 1][col] === grid[row - 2][col]) forbidden.add(grid[row - 1][col]);
    const pool = forbidden.size > 0 ? SYMBOLS.filter(s => !forbidden.has(s)) : SYMBOLS;
    return pool[Math.floor(Math.random() * pool.length)];
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
    const ia = children.indexOf(a), ib = children.indexOf(b);
    const diff = Math.abs(ia - ib);
    return diff === BOARD_SIZE || (diff === 1 && Math.floor(ia / BOARD_SIZE) === Math.floor(ib / BOARD_SIZE));
}