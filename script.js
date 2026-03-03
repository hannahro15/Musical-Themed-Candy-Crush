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
        const targetCell = e.target;
        // Swap the candies
        [targetCell.textContent, draggedCell.textContent] = [draggedCell.textContent, targetCell.textContent];

        // Check if the swap creates a match involving the swapped cells
        const matches = matchForThree();
        const swapCreatedMatch = matches.some(cell => cell === draggedCell || cell === targetCell);

        if (!swapCreatedMatch) {
            // No new match from this swap, revert
            [targetCell.textContent, draggedCell.textContent] = [draggedCell.textContent, targetCell.textContent];
        } else {
            clearMatches();
        }
        draggedCell = null;
    }
}

// Utility functions
function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

// Function to generate the game board
function generateGameBoard(rows, cols) {
    gameBoard.innerHTML = ''; 
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = getRandomSymbol();
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
function matchForThree() {
    const cells = Array.from(gameBoard.children);
    const rows = BOARD_SIZE;
    const cols = BOARD_SIZE;
    let matches = [];

    // Check horizontal matches
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 2; c++) {
            const cell1 = cells[r * cols + c];
            const cell2 = cells[r * cols + c + 1];
            const cell3 = cells[r * cols + c + 2];
            if (cell1.textContent === cell2.textContent && cell2.textContent === cell3.textContent) {
                matches.push(cell1, cell2, cell3);
            }
        }
    }

    // Check vertical matches
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 2; r++) {
            const cell1 = cells[r * cols + c];
            const cell2 = cells[(r + 1) * cols + c];
            const cell3 = cells[(r + 2) * cols + c];
            if (cell1.textContent === cell2.textContent && cell2.textContent === cell3.textContent) {
                matches.push(cell1, cell2, cell3);
            }
        }
    }

    return matches;
}

// Function to clear matched cells and refill the board
function clearMatches() {
    let hadMatches = false;

    while (true) {
        const matches = matchForThree();
        if (matches.length === 0) {
            break;
        }

        hadMatches = true;

        matches.forEach(cell => {
            cell.textContent = '';
        });

        refillBoard();
    }

    return hadMatches;
}

function refillBoard() {
    const cells = Array.from(gameBoard.children);
    const rows = BOARD_SIZE;
    const cols = BOARD_SIZE;

    for (let c = 0; c < cols; c++) {
        let emptyCells = [];
        for (let r = rows - 1; r >= 0; r--) {
            const cell = cells[r * cols + c];
            if (cell.textContent === '') {
                emptyCells.push(cell);
            } else if (emptyCells.length > 0) {
                const emptyCell = emptyCells.shift();
                emptyCell.textContent = cell.textContent;
                cell.textContent = '';
                emptyCells.push(cell);
            }
        }

        // Fill empty cells at the top
        emptyCells.forEach(cell => {
            cell.textContent = getRandomSymbol();
        });
    }
}