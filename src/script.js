

import { getLevelConfig } from './levels.js';
import { showMenuPage, updateObjectiveCounters, updateMovesDisplay, updateScoreDisplay, updateLivesDisplay } from './ui.js';
import { getSafeSymbol, findMatches, dropAndRefill, hasPossibleMoves, generateGameBoard } from './board.js';
import { BOARD_SIZE, SYMBOLS, INITIAL_LIVES } from './constants.js';
import { swapCellContents, scoreForMatch } from './game.js';
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

// --- Game State ---
// (removed local gameState definition)

// --- Drag/Touch State ---
// (removed let draggedCell, touchStartCell, touchStartX, touchStartY and their setter functions)





// --- Level/Board Setup ---
function startLevel(levelNum) {
  const config = getLevelConfig(levelNum);
  if (!config) {
    // No more levels, show menu or win screen
    showMenuPage(heading, menu, gameBoard, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
    return;
  }
  // Reset game state for new level
  gameState.level = levelNum;
  gameState.levelComplete = false;
  gameState.movesLeft = config.moves;
  gameState.score = 0;
  gameState.timer = config.timer;
  gameState.timerActive = true;
  // Reset all objective counters
  Object.keys(gameState).forEach(key => {
    if (key.endsWith('Left') && key !== 'movesLeft') delete gameState[key];
  });
  if (config.objectives && Array.isArray(config.objectives)) {
    config.objectives.forEach(obj => {
      gameState[obj.label + 'Left'] = obj.count;
    });
  }
  // Update UI
  document.getElementById('levelDisplay').textContent = `LEVEL ${levelNum}`;
  updateObjectiveCounters(document.getElementById('objective-counters'), config.objectives, gameState);
  updateMovesDisplay(movesDisplay, gameState.movesLeft);
  updateScoreDisplay(scoreDisplay, gameState.score);
  updateLivesDisplay(livesDisplay, gameState.lives);
  // Generate board and wire up cell events
  generateBoardAndWireEvents();
  // Start timer
  startTimer(gameState, timerDisplay, () => handleLevelLose(restartContainer, restartBtn, nextLevelBtn));
}

function generateBoardAndWireEvents() {
  // Use the robust board.js logic for board generation
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

async function trySwap(sourceCell, targetCell) {
  if (gameState.isResolving || gameState.levelComplete || !gameState.timerActive) return;
  gameState.isResolving = true;

  swapCellContents(sourceCell, targetCell);

  // Wait a short moment so the swap is visible before clearing matches
  await new Promise(res => setTimeout(res, 180));

  // Detect matches after swap
  let matches = findMatches(gameBoard, BOARD_SIZE);

  // Only swap back if neither swapped cell is in a match
  const swappedInMatch = matches.some(group => group.includes(sourceCell) || group.includes(targetCell));
  if (matches.length === 0 || !swappedInMatch) {
    // No match, or match does not involve swapped cells: swap back
    swapCellContents(sourceCell, targetCell);
    gameState.isResolving = false;
    return;
  }

  // At least one match: resolve all matches
  let scoreGained = 0;
  // Dynamically count matches for all objectives
  const config = getLevelConfig(gameState.level);
  const matchedCounts = {};
  config.objectives.forEach(obj => { matchedCounts[obj.label] = 0; });

  // Decrement movesLeft and update display for a valid swap
  gameState.movesLeft = Math.max(0, gameState.movesLeft - 1);
  updateMovesDisplay(movesDisplay, gameState.movesLeft);

  while (matches.length > 0) {
    // Animate matched cells
    for (const group of matches) {
      scoreGained += scoreForMatch(group.length);
      for (const cell of group) {
        cell.classList.add('matched');
        // Count matches for all objectives
        config.objectives.forEach(obj => {
          if (cell.textContent === obj.symbol) matchedCounts[obj.label]++;
        });
      }
    }
    await new Promise(res => setTimeout(res, 250)); // Animation delay
    // Remove matched cells
    for (const group of matches) {
      for (const cell of group) {
        cell.textContent = '';
        cell.classList.remove('matched');
      }
    }
    // Drop cells down and refill
    dropAndRefill(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol);
    // Ensure new cells are interactive
    wireUpCellEvents(
      gameBoard,
      BOARD_SIZE,
      (e) => handleDragStart(e, gameState, setDraggedCell),
      (e) => handleDrop(e, gameState, gameState.draggedCell, setDraggedCell, (a, b) => areAdjacent(a, b, gameBoard, BOARD_SIZE), trySwap),
      (e) => handleTouchStart(e, gameState, setTouchStartCell, setTouchStartX, setTouchStartY, gameBoard),
      (e) => handleTouchEnd(e, gameState, gameState.touchStartCell, gameState.touchStartX, gameState.touchStartY, setTouchStartCell, BOARD_SIZE, gameBoard, trySwap)
    );
    matches = findMatches(gameBoard, BOARD_SIZE);
  }

  // Update score and display
  gameState.score += scoreGained;
  updateScoreDisplay(scoreDisplay, gameState.score);

  // Decrease counters for all objectives
  let allObjectivesComplete = true;
  config.objectives.forEach(obj => {
    const key = obj.label + 'Left';
    if (typeof gameState[key] !== 'number') gameState[key] = obj.count;
    if (matchedCounts[obj.label] > 0) {
      gameState[key] = Math.max(0, gameState[key] - matchedCounts[obj.label]);
    }
    if (gameState[key] > 0) allObjectivesComplete = false;
  });
  updateObjectiveCounters(document.getElementById('objective-counters'), config.objectives, gameState);
  // Check for win condition after counters update
  if (allObjectivesComplete) {
    handleLevelWin(restartContainer, nextLevelBtn, restartBtn);
    gameState.isResolving = false;
    return;
  }

  if (gameState.movesLeft <= 0 && !gameState.levelComplete) {
    // Only trigger lose if timer is still above 0
    if (gameState.timer > 0) {
      handleLevelLose(restartContainer, restartBtn, nextLevelBtn);
      gameState.isResolving = false;
      return;
    }
  }
  gameState.isResolving = false;
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
    return;
  }
  startLevel(gameState.level);
}

// --- Initialization ---



function handleNextLevel() {
  // Hide restart/next buttons and start next level
  if (restartContainer) restartContainer.classList.add('hidden');
  if (nextLevelBtn) nextLevelBtn.classList.add('hidden');
  if (restartBtn) restartBtn.classList.add('hidden');
  startLevel(gameState.level + 1);
}

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
