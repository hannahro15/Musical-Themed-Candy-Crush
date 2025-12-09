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
    if (e.target.classList.contains('cell') && draggedCell) {
        [e.target.textContent, draggedCell.textContent] = [draggedCell.textContent, e.target.textContent];
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