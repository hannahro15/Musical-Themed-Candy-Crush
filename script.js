// Get DOM elements
const playBtn = document.getElementById('playBtn');
const heading = document.querySelector('h1');
const menu = document.querySelector('.menu');
const gameBoard = document.getElementById('gameBoard');

// Handle play button click
playBtn.addEventListener('click', () => {
    heading.classList.add('hidden');
    menu.classList.add('hidden');
    if (!gameBoard.hasChildNodes()) generateGameBoard(8, 8);
    gameBoard.classList.remove('hidden');
});

// Function to generate the game board
function generateGameBoard(rows, cols) {
    gameBoard.innerHTML = ''; 
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = `${i},${j}`;
            gameBoard.appendChild(cell);
        }
    }
}