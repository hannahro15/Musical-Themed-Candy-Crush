
import { getLevelConfig } from './levels.js';
import { showMenuPage, updateLivesDisplay, updateMovesDisplay, updateScoreDisplay, updateLevel1Counters, updateTimerDisplay } from './ui.js';
import { getSafeSymbol, generateGameBoard } from './board.js';
import { BOARD_SIZE, SYMBOLS, INITIAL_LIVES } from './constants.js';


// --- DOM Elements ---
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
const restartContainer = document.getElementById('restartContainer');

// --- Game State ---
let gameState = {
  movesLeft: 0,
  score: 0,
  isResolving: false,
  violinsLeft: 0,
  pianosLeft: 0,
  level: 1,
  levelComplete: false,
  timer: 0,
  timerInterval: null,
  timerActive: false,
  lives: INITIAL_LIVES,
};

// --- Main Orchestration ---
function startLevel(levelNum = 1) {
  const config = getLevelConfig(levelNum);
  gameState = {
    ...gameState,
    movesLeft: config.moves,
    score: 0,
    violinsLeft: config.violins,
    pianosLeft: config.pianos,
    level: levelNum,
    levelComplete: false,
    timer: config.timer,
    timerActive: true,
  };
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
  document.getElementById('levelDisplay').textContent = `Level ${levelNum}`;
  updateLivesDisplay(livesDisplay, gameState.lives);
  updateMovesDisplay(movesDisplay, gameState.movesLeft);
  updateScoreDisplay(scoreDisplay, gameState.score);
  updateLevel1Counters(violinCounter, pianoCounter, gameState.violinsLeft, gameState.pianosLeft);
  updateTimerDisplay(timerDisplay, gameState.timer);
  generateGameBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol);
  startTimer();
}

function startTimer() {
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(() => {
    if (!gameState.timerActive) return;
    gameState.timer--;
    updateTimerDisplay(timerDisplay, gameState.timer);
    if (gameState.timer <= 0) {
      gameState.timer = 0;
      updateTimerDisplay(timerDisplay, gameState.timer);
      clearInterval(gameState.timerInterval);
      gameState.timerActive = false;
      // Show result (implement as needed)
    }
  }, 1000);
}

function handlePlayClick() {
  gameState.lives = INITIAL_LIVES;
  startLevel(1);
}

function handleRestartLevel() {
  if (gameState.lives === 0) {
    showMenuPage(heading, menu, gameBoard, level1Counters, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
    gameState.lives = INITIAL_LIVES;
    return;
  }
  startLevel(gameState.level);
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  showMenuPage(heading, menu, gameBoard, level1Counters, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
});
playButton.addEventListener('click', handlePlayClick);
restartBtn.addEventListener('click', handleRestartLevel);
// Add more event listeners as needed (drag, drop, touch, etc.)

