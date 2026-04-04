// Game configuration
const SYMBOLS = ['🎵', '🎶', '🎸', '🎹', '🎻', '🎷', '🎺', '🥁'];
const BOARD_SIZE = 8;
const INITIAL_MOVES = 20;

// DOM elements — script runs after <body>, so these are available immediately
const playButton = document.getElementById('playBtn');
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

playButton.addEventListener('click', handlePlayClick);
gameBoard.addEventListener('dragstart', handleDragStart);
gameBoard.addEventListener('dragover', event => event.preventDefault());
gameBoard.addEventListener('drop', handleDrop);
gameBoard.addEventListener('touchstart', handleTouchStart);
gameBoard.addEventListener('touchend', handleTouchEnd);

// ── Event handlers ───────────────────────────────────────────────────────────

function handlePlayClick() {
    [heading, menu].forEach(element => element.classList.add('hidden'));
    [document.getElementById('game-board-container'), gameBoard, movesDisplay, scoreDisplay]
        .forEach(element => element.classList.remove('hidden'));

    if (gameBoard.children.length === 0) {
        gameState.movesLeft = INITIAL_MOVES;
        gameState.score = 0;
        updateMovesDisplay();
        updateScoreDisplay();
        generateGameBoard();
    }
}

function handleDragStart(event) {
    if (gameState.isResolving) { event.preventDefault(); return; }
    if (!event.target.classList.contains('cell')) return;
    draggedCell = event.target;
}

async function handleDrop(event) {
    event.preventDefault();
    if (gameState.isResolving || !draggedCell) return;

    const targetCell = event.target;
    if (targetCell.classList.contains('cell') && areAdjacent(draggedCell, targetCell)) {
        await trySwap(draggedCell, targetCell);
    }
    draggedCell = null;
}

// ── Touch handlers ───────────────────────────────────────────────────────────

function handleTouchStart(event) {
    if (gameState.isResolving) return;
    const touch = event.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!cell?.classList.contains('cell')) return;
    touchStartCell = cell;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

async function handleTouchEnd(event) {
    if (gameState.isResolving || !touchStartCell) return;
    
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const sourceCell = touchStartCell;
    touchStartCell = null;

    const MIN_SWIPE_DISTANCE = 20;
    if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE && Math.abs(deltaY) < MIN_SWIPE_DISTANCE) return;

    const allCells = [...gameBoard.children];
    const sourceIndex = allCells.indexOf(sourceCell);
    if (sourceIndex === -1) return;

    const column = sourceIndex % BOARD_SIZE;
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    
    let indexOffset;
    if (isHorizontalSwipe) {
        const swipeRight = deltaX > 0 && column < BOARD_SIZE - 1;
        const swipeLeft = deltaX < 0 && column > 0;
        indexOffset = swipeRight ? 1 : swipeLeft ? -1 : 0;
    } else {
        indexOffset = deltaY > 0 ? BOARD_SIZE : -BOARD_SIZE;
    }
    
    const targetIndex = sourceIndex + indexOffset;

    if (indexOffset !== 0 && targetIndex >= 0 && targetIndex < allCells.length) {
        await trySwap(sourceCell, allCells[targetIndex]);
    }
}

// ── Shared swap logic ────────────────────────────────────────────────────────

async function trySwap(sourceCell, targetCell) {
    swapCellContents(sourceCell, targetCell);

    const matchedCells = findMatches();
    if (matchedCells.size === 0) {
        swapCellContents(sourceCell, targetCell);
    } else {
        gameState.movesLeft--;
        updateMovesDisplay();
        await resolveBoard(matchedCells);

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
    const matchedCells = new Set();
    const grid = getCellGrid();

    function scanLineForMatches(line) {
        let startIndex = 0;
        while (startIndex <= line.length - 3) {
            const symbol = line[startIndex].textContent;
            if (!symbol) { startIndex++; continue; }
            let endIndex = startIndex + 1;
            while (endIndex < line.length && line[endIndex].textContent === symbol) endIndex++;
            if (endIndex - startIndex >= 3) {
                for (let i = startIndex; i < endIndex; i++) matchedCells.add(line[i]);
            }
            startIndex = endIndex;
        }
    }

    for (let row = 0; row < BOARD_SIZE; row++) scanLineForMatches(grid[row]);
    for (let col = 0; col < BOARD_SIZE; col++) scanLineForMatches(grid.map(row => row[col]));

    return matchedCells;
}

// ── Cascade resolution ────────────────────────────────────────────────────────

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function resolveBoard(matchedCells) {
    gameState.isResolving = true;
    try {
        while (matchedCells.size > 0) {
            gameState.score += scoreForMatch(matchedCells.size);
            updateScoreDisplay();
            matchedCells.forEach(cell => cell.classList.add('matched'));
            await delay(300);
            matchedCells.forEach(cell => { cell.classList.remove('matched'); cell.textContent = ''; });
            await delay(150);
            applyGravity();
            await delay(300);
            matchedCells = findMatches();
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
                if (findMatches().size > 0) {
                    swapCellContents(grid[row][col], grid[row][col + 1]);
                    return true;
                }
                swapCellContents(grid[row][col], grid[row][col + 1]);
            }
            if (row < BOARD_SIZE - 1) {
                swapCellContents(grid[row][col], grid[row + 1][col]);
                if (findMatches().size > 0) {
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
    } while (findMatches().size > 0 && attempts++ < 5);
}