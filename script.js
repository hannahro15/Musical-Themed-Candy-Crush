// Get DOM elements
const playBtn = document.getElementById('playBtn');
const heading = document.querySelector('h1');
const menu = document.querySelector('.menu');
const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('movesDisplay');

// Game configuration
const SYMBOLS = ['🎵', '🎶', '🎸', '🎹', '🎻', '🎷', '🎺', '🥁'];
const BOARD_SIZE = 8;
const INITIAL_MOVES = 20;

// Game state
const gameState = {
    movesLeft: INITIAL_MOVES,
    isResolving: false,
};
let draggedCell = null;

// Initialize event listeners
if (playBtn) {
    playBtn.addEventListener('click', handlePlayClick);
}
if (gameBoard) {
    gameBoard.addEventListener('dragstart', handleDragStart);
    gameBoard.addEventListener('dragover', handleDragOver);
    gameBoard.addEventListener('drop', handleDrop);
}

// Event handler functions
function handlePlayClick() {
    if (heading) heading.classList.add('hidden');
    if (menu) menu.classList.add('hidden');
    if (gameBoard) gameBoard.classList.remove('hidden');
    if (movesDisplay) {
        movesDisplay.classList.remove('hidden');
    }

    if (gameBoard.children.length === 0) {
        gameState.movesLeft = INITIAL_MOVES;
        updateMovesDisplay();
        generateGameBoard(BOARD_SIZE, BOARD_SIZE);
    }
}

function handleDragStart(e) {
    if (gameState.isResolving) { e.preventDefault(); return; }
    if (!e.target.classList.contains('cell')) return;
    draggedCell = e.target;
}

function handleDragOver(e) {
    e.preventDefault();
}

async function handleDrop(e) {
    e.preventDefault();
    if (gameState.isResolving) return;
    if (!e.target.classList.contains('cell') || !draggedCell) return;
    if (!areAdjacent(draggedCell, e.target)) {
        draggedCell = null;
        return;
    }

    const source = draggedCell;
    const target = e.target;
    draggedCell = null;

    // Tentatively swap
    swapCells(source, target);

    if (!hasAnyMatch()) {
        // Revert — no match formed, do not consume a move
        swapCells(source, target);
    } else {
        // Valid swap: consume a move and resolve cascades
        gameState.movesLeft--;
        updateMovesDisplay();
        await resolveBoard();
    }
}

// ── Core helpers ─────────────────────────────────────────────────────────────

function swapCells(a, b) {
    [a.textContent, b.textContent] = [b.textContent, a.textContent];
}

function getCell(row, col) {
    return gameBoard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function findMatches() {
    const matched = new Set();
    // Cache all cell references in a 2D array to avoid repeated querySelector calls
    const cells = Array.from({ length: BOARD_SIZE }, (_, r) =>
        Array.from({ length: BOARD_SIZE }, (_, c) => getCell(r, c))
    );

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

function hasAnyMatch() {
    return findMatches().size > 0;
}

// ── Cascade resolution ────────────────────────────────────────────────────────

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function resolveBoard() {
    gameState.isResolving = true;

    let matched = findMatches();
    while (matched.size > 0) {
        // Highlight matched cells briefly
        matched.forEach(cell => cell.classList.add('matched'));
        await delay(300);

        // Clear matched cells
        matched.forEach(cell => {
            cell.classList.remove('matched');
            cell.textContent = '';
        });
        await delay(150);

        // Apply gravity and refill
        applyGravity();
        await delay(300);

        matched = findMatches();
    }

    gameState.isResolving = false;
}

function applyGravity() {
    // Cache all cell references in a 2D array to avoid repeated querySelector calls
    const cells = Array.from({ length: BOARD_SIZE }, (_, r) =>
        Array.from({ length: BOARD_SIZE }, (_, c) => getCell(r, c))
    );

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
    if (!movesDisplay) return;
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

    // Horizontal: two cells to the left are identical → forbid that symbol
    if (col >= 2 && grid[row][col - 1] === grid[row][col - 2]) {
        forbidden.add(grid[row][col - 1]);
    }

    // Vertical: two cells above are identical → forbid that symbol
    if (row >= 2 && grid[row - 1][col] === grid[row - 2][col]) {
        forbidden.add(grid[row - 1][col]);
    }

    const available = forbidden.size > 0 ? SYMBOLS.filter(s => !forbidden.has(s)) : SYMBOLS;
    const pool = available.length > 0 ? available : SYMBOLS;
    return pool[Math.floor(Math.random() * pool.length)];
}

// Function to generate the game board
function generateGameBoard(rows, cols) {
    gameBoard.innerHTML = '';

    // Build a 2-D symbol grid with no pre-existing 3+ matches
    const grid = [];
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = safeSymbol(grid, i, j);
        }
    }

    // Create DOM cells from the pre-validated grid
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = grid[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.draggable = true;

            cell.addEventListener('click', () => {
                cell.classList.toggle('selected');
            });

            gameBoard.appendChild(cell);
        }
    }
}

function areAdjacent(cell1, cell2) {
    const rowDiff = Math.abs(cell1.dataset.row - cell2.dataset.row);
    const colDiff = Math.abs(cell1.dataset.col - cell2.dataset.col);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}