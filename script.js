// Get DOM elements
const playBtn = document.getElementById('playBtn');
const heading = document.querySelector('h1');
const menu = document.querySelector('.menu');
const gameBoard = document.getElementById('gameBoard');

// Game configuration
const SYMBOLS = ['🎵', '🎶', '🎸', '🎹', '🎻', '🎷', '🎺', '🥁'];
const BOARD_SIZE = 8;

// Game state
let draggedCell = null;

// Initialize event listeners
playBtn.addEventListener('click', handlePlayClick);
gameBoard.addEventListener('dragstart', handleDragStart);
gameBoard.addEventListener('dragover', handleDragOver);
gameBoard.addEventListener('drop', handleDrop);

// Event handler functions
function handlePlayClick() {
    heading.classList.add('hidden');
    menu.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    
    if (gameBoard.children.length === 0) {
        generateGameBoard(BOARD_SIZE, BOARD_SIZE);
    }
}

function handleDragStart(e) {
    if (!e.target.classList.contains('cell')) return;
    draggedCell = e.target;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    if (e.target.classList.contains('cell') && draggedCell && areAdjacent(draggedCell, e.target)) {
        [e.target.textContent, draggedCell.textContent] = [draggedCell.textContent, e.target.textContent];
        draggedCell = null;
    }
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