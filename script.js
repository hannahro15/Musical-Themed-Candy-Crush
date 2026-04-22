

import { getLevelConfig } from './levels.js';
import { showMenuPage, updateObjectiveCounters } from './ui.js';
import { getSafeSymbol, findMatches, dropAndRefill } from './board.js';
import { BOARD_SIZE, SYMBOLS, INITIAL_LIVES } from './constants.js';
import { swapCellContents } from './game.js';
import { gameState } from './gameState.js';
import { handleLevelWin, handleLevelLose } from './gameStatus.js';
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




// All event handler functions are used in event wiring elsewhere or in startLevel

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

    matches = findMatches(gameBoard, BOARD_SIZE);
  }


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
} // <-- This closing brace properly ends trySwap


/**
 * Handles Play Game button click.
 */
function handlePlayClick() {
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

/**
 * Handles Restart Level button click.
 */
function handleRestartLevel() {
  if (gameState.lives === 0) {
    showMenuPage(heading, menu, gameBoard, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
    gameState.lives = INITIAL_LIVES;
    return;
  }
  startLevel(gameState.level);
}

// --- Initialization ---

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
  showMenuPage(heading, menu, gameBoard, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
});
