import { getLevelConfig } from './levels.js';
import { showMenuPage, updateObjectiveCounters, updateMovesDisplay, updateScoreDisplay, updateLivesDisplay } from './ui.js';
import { getSafeSymbol, findMatches, dropAndRefill, hasPossibleMoves, generateGameBoard } from './board.js';
import { BOARD_SIZE, SYMBOLS, INITIAL_LIVES } from './constants.js';
import { swapCellContents, scoreForMatch, areAdjacent } from './game.js';
import { trySwap, setBoardControllerDeps } from './boardController.js';
import { gameState, setDraggedCell, setTouchStartCell, setTouchStartX, setTouchStartY } from './gameState.js';
import { handleLevelWin, handleLevelLose } from './gameStatus.js';
import { handleDragStart, handleDrop, handleTouchStart, handleTouchEnd } from './interaction.js';
import { startTimer } from './timer.js';
import { attachEventListeners, wireUpCellEvents } from './events.js';

// --- DOM Elements ---

const playButton = document.getElementById('playBtn');
const howToPlayBtn = document.getElementById('howToPlayBtn');
const heading = document.querySelector('h1');
const menu = document.querySelector('.menu');
const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('movesDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const restartBtn = document.getElementById('restartBtn');
const restartContainer = document.getElementById('restartContainer');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const howToPlayModal = document.getElementById('howToPlayModal');
const closeHowToPlay = document.getElementById('closeHowToPlay');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverRestartBtn = document.getElementById('gameOverRestartBtn');

// --- Game State ---
// (removed local gameState definition)

// --- Drag/Touch State ---
// (removed let draggedCell, touchStartCell, touchStartX, touchStartY and their setter functions)





// --- Level/Board Setup ---
function startLevel(levelNum) {
  const config = getLevelConfig(levelNum);
  if (!config) {
    showMenuPage(heading, menu, gameBoard, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
    return;
  }
  gameState.level = levelNum;
  gameState.levelComplete = false;
  gameState.movesLeft = config.moves;
  gameState.score = 0;
  gameState.timer = config.timer;
  gameState.timerActive = true;
  Object.keys(gameState).forEach(key => {
    if (key.endsWith('Left') && key !== 'movesLeft') delete gameState[key];
  });
  if (config.objectives && Array.isArray(config.objectives)) {
    config.objectives.forEach(obj => {
      gameState[obj.label + 'Left'] = obj.count;
    });
  }
  document.getElementById('levelDisplay').textContent = `LEVEL ${levelNum}`;
  updateObjectiveCounters(document.getElementById('objective-counters'), config.objectives, gameState);
  updateMovesDisplay(movesDisplay, gameState.movesLeft);
  updateScoreDisplay(scoreDisplay, gameState.score);
  updateLivesDisplay(livesDisplay, gameState.lives);
  generateBoardAndWireEvents();
  startTimer(gameState, timerDisplay, () => handleLevelLose(restartContainer, restartBtn, nextLevelBtn));
}

function generateBoardAndWireEvents() {
  generateGameBoard(
    gameBoard,
    BOARD_SIZE,
    SYMBOLS,
    getSafeSymbol,
    hasPossibleMoves,
    () => wireUpCellEvents(
      gameBoard,
      BOARD_SIZE,
      (e) => handleDragStart(e, gameState, setDraggedCell),
      (e) => handleDrop(e, gameState, gameState.draggedCell, setDraggedCell, (a, b) => areAdjacent(a, b, gameBoard, BOARD_SIZE), trySwap),
      (e) => handleTouchStart(e, gameState, setTouchStartCell, setTouchStartX, setTouchStartY, gameBoard),
      (e) => handleTouchEnd(e, gameState, gameState.touchStartCell, gameState.touchStartX, gameState.touchStartY, setTouchStartCell, BOARD_SIZE, gameBoard, trySwap)
    )
  );
}

/**
 * Attempts to swap two cells and resolve matches.
 * @param {HTMLElement} sourceCell
 * @param {HTMLElement} targetCell
 */


// The trySwap function is now imported from boardController.js, so it has been removed.

async function swapAndCheckMatch(sourceCell, targetCell) {
  swapCellContents(sourceCell, targetCell);
  await wait(180);
  let matches = findMatches(gameBoard, BOARD_SIZE);
  const swappedInMatch = matches.some(group => group.includes(sourceCell) || group.includes(targetCell));
  if (matches.length === 0 || !swappedInMatch) {
    swapCellContents(sourceCell, targetCell);
    return false;
  }
  // Decrement movesLeft and update display for a valid swap
  gameState.movesLeft = Math.max(0, gameState.movesLeft - 1);
  updateMovesDisplay(movesDisplay, gameState.movesLeft);


  // Code related to reshuffling and event wiring has been moved to boardController.js
  return { scoreGained, matchedCounts, config };
}

function updateScoreAndObjectives(scoreGained, matchedCounts, config) {
  gameState.score += scoreGained;
  updateScoreDisplay(scoreDisplay, gameState.score);
  config.objectives.forEach(obj => {
    const key = obj.label + 'Left';
    if (typeof gameState[key] !== 'number') gameState[key] = obj.count;
    if (matchedCounts[obj.label] > 0) {
      gameState[key] = Math.max(0, gameState[key] - matchedCounts[obj.label]);
    }
  });
  updateObjectiveCounters(document.getElementById('objective-counters'), config.objectives, gameState);
}

function checkWinCondition(config) {
  return config.objectives.every(obj => {
    const key = obj.label + 'Left';
    return gameState[key] === 0;
  });
}

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}


/**
 * Handles Play Game button click.
 */

function startGame() {
  // Always reset lives and level
  gameState.lives = INITIAL_LIVES;
  gameState.level = 1;

  // Hide menu, show all game UI elements in a single place
  heading.classList.add('hidden');
  menu.classList.add('hidden');
  document.getElementById('game-board-container').classList.remove('hidden');
  gameBoard.classList.remove('hidden');
  document.getElementById('score-moves-wrapper').classList.remove('hidden');
  document.getElementById('levelDisplay').classList.remove('hidden');
  movesDisplay.classList.remove('hidden');
  scoreDisplay.classList.remove('hidden');
  timerDisplay.classList.remove('hidden');
  livesDisplay.classList.remove('hidden');
  if (restartContainer) restartContainer.classList.add('hidden');
  // Always show the objective counters
  const counters = document.getElementById('objective-counters');
  counters.classList.remove('hidden');

  // Start the first level
  startLevel(1);
}

function handlePlayClick() {
  startGame();
}

/**
 * Handles Restart Level button click.
 */
function handleRestartLevel() {
  if (gameState.lives === 0) {
    showMenuPage(heading, menu, gameBoard, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
    gameState.lives = INITIAL_LIVES;
    updateLivesDisplay(livesDisplay, gameState.lives);
    if (restartBtn) restartBtn.classList.add('hidden');
    return;
  }
  startLevel(gameState.level);
  if (restartBtn) restartBtn.classList.add('hidden');
}

// --- Initialization ---



function handleNextLevel() {
  // Hide restart/next buttons and start next level
  if (restartContainer) restartContainer.classList.add('hidden');
  if (nextLevelBtn) nextLevelBtn.classList.add('hidden');
  if (restartBtn) restartBtn.classList.add('hidden');
  startLevel(gameState.level + 1);
}



// Inject dependencies for boardController
setBoardControllerDeps({
  gameBoard,
  movesDisplay,
  scoreDisplay,
  restartContainer,
  nextLevelBtn,
  restartBtn
});

document.addEventListener('DOMContentLoaded', () => {
  attachEventListeners({
    playButton,
    restartBtn,
    howToPlayBtn,
    howToPlayModal,
    closeHowToPlay,
    handlePlayClick,
    handleRestartLevel
  });
  if (nextLevelBtn) nextLevelBtn.addEventListener('click', handleNextLevel);
  showMenuPage(heading, menu, gameBoard, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
});

// --- Game Over Modal Logic ---
function showGameOverModal() {
  if (gameOverModal) gameOverModal.classList.remove('hidden');
}
function hideGameOverModal() {
  if (gameOverModal) gameOverModal.classList.add('hidden');
}
if (gameOverRestartBtn) {
  gameOverRestartBtn.addEventListener('click', () => {
    hideGameOverModal();
    // Option 1: Go to menu page
    showMenuPage(heading, menu, gameBoard, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
    // Option 2: Uncomment below to start at level 1 directly instead of menu
    // patchedStartGame();
  });
}

// Patch handleLevelLose to show modal if lives are 0
const originalHandleLevelLose = handleLevelLose;
function patchedHandleLevelLose(...args) {
  originalHandleLevelLose(...args);
  if (gameState.lives === 0) {
    showGameOverModal();
  }
}
// Patch global reference
window.handleLevelLose = patchedHandleLevelLose;

// Hide modal on new game or restart
const originalStartGame = startGame;
function patchedStartGame(...args) {
  hideGameOverModal();
  originalStartGame(...args);
}
window.startGame = patchedStartGame;

const originalHandleRestartLevel = handleRestartLevel;
function patchedHandleRestartLevel(...args) {
  hideGameOverModal();
  originalHandleRestartLevel(...args);
}
window.handleRestartLevel = patchedHandleRestartLevel;

// After patching window.startGame, ensure playButton uses the patched version
if (playButton) {
  playButton.removeEventListener('click', handlePlayClick); // Remove old if present
  playButton.addEventListener('click', () => window.startGame());
}
