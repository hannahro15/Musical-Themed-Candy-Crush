// Get DOM elements
const playBtn = document.getElementById('playBtn');
const heading = document.querySelector('h1');
const menu = document.querySelector('.menu');
const gameBoard = document.getElementById('gameBoard');

// Handle play button click
playBtn.addEventListener('click', () => {
    heading.style.display = 'none';
    menu.style.display = 'none';
    gameBoard.style.display = 'block';
});
