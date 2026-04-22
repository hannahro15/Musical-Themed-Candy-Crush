// Expose hasPossibleMoves globally for board.js to use
window.hasPossibleMoves = hasPossibleMoves;


import { getLevelConfig } from './levels.js';
import { showMenuPage, updateLivesDisplay, updateMovesDisplay, updateScoreDisplay, updateObjectiveCounters, updateTimerDisplay } from './ui.js';
import { getSafeSymbol, generateGameBoard, findMatches, hasPossibleMoves, reshuffleBoard, dropAndRefill } from './board.js';
import { BOARD_SIZE, SYMBOLS, INITIAL_LIVES } from './constants.js';
import { handleDragStart, handleDrop, handleTouchStart, handleTouchEnd } from './interaction.js';
import { swapCellContents, areAdjacent, scoreForMatch } from './game.js';
import { startTimer } from './timer.js';
import { wireUpCellEvents, attachEventListeners } from './events.js';
import { gameState, setDraggedCell, setTouchStartCell, setTouchStartX, setTouchStartY } from './gameState.js';
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

/**
 * Wires up drag and touch event listeners for all board cells.
 */
function wireUpCellEvents() {
  const cells = Array.from(gameBoard.children);
  cells.forEach(cell => {
    // Remove previous listeners by cloning the node
    const newCell = cell.cloneNode(true);
    newCell.draggable = true;
    cell.replaceWith(newCell);
  });
  // Re-query after replacement
  const updatedCells = Array.from(gameBoard.children);
  updatedCells.forEach(cell => {
    cell.addEventListener('dragstart', onDragStart);
    cell.addEventListener('dragover', e => e.preventDefault()); // Allow drop
    cell.addEventListener('drop', onDrop);
    cell.addEventListener('touchstart', onTouchStart);
    cell.addEventListener('touchend', onTouchEnd);
  });
}



function onDragStart(e) {
  handleDragStart(e, gameState, setDraggedCell);
}
function onDrop(e) {
  handleDrop(e, gameState, gameState.draggedCell, setDraggedCell, (a, b) => areAdjacent(a, b, gameBoard, BOARD_SIZE), trySwap);
}
function onTouchStart(e) {
  handleTouchStart(e, gameState, setTouchStartCell, setTouchStartX, setTouchStartY, gameBoard);
}
async function onTouchEnd(e) {
  await handleTouchEnd(e, gameState, gameState.touchStartCell, gameState.touchStartX, gameState.touchStartY, setTouchStartCell, BOARD_SIZE, gameBoard, trySwap);
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

  // After all matches resolved, check for possible moves; if none, reshuffle
  if (!hasPossibleMoves(gameBoard, BOARD_SIZE)) {
    reshuffleBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol);
    wireUpCellEvents();
  }
// Returns true if there is at least one possible swap that would result in a match
function hasPossibleMoves(gameBoard, BOARD_SIZE) {
  const allCells = Array.from(gameBoard.children);
  for (let i = 0; i < allCells.length; i++) {
    const cell = allCells[i];
    const row = Math.floor(i / BOARD_SIZE);
    const col = i % BOARD_SIZE;
    // Try swapping with right neighbor
    if (col < BOARD_SIZE - 1) {
      swapCellContents(cell, allCells[i + 1]);
      if (findMatches(gameBoard, BOARD_SIZE).length > 0) {
        swapCellContents(cell, allCells[i + 1]);
        return true;
      }
      swapCellContents(cell, allCells[i + 1]);
    }
    // Try swapping with bottom neighbor
    if (row < BOARD_SIZE - 1) {
      swapCellContents(cell, allCells[i + BOARD_SIZE]);
      if (findMatches(gameBoard, BOARD_SIZE).length > 0) {
        swapCellContents(cell, allCells[i + BOARD_SIZE]);
        return true;
      }
      swapCellContents(cell, allCells[i + BOARD_SIZE]);
    }
  }
  return false;
}

function reshuffleBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol) {
  let allCells = Array.from(gameBoard.children);
  let symbols = allCells.map(cell => cell.textContent).filter(Boolean);
  let attempts = 0;
  do {
    for (let i = symbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
    }
    allCells.forEach((cell, idx) => {
      cell.textContent = symbols[idx] || '';
    });
    attempts++;
    if (attempts > 20) {
      generateGameBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol);
      break;
    }
  } while (!hasPossibleMoves(gameBoard, BOARD_SIZE));
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

// Drop and refill logic for match-3
/**
 * Drops cells down and refills empty spots with new symbols.
 * @param {HTMLElement} gameBoard
 * @param {number} BOARD_SIZE
 * @param {string[]} SYMBOLS
 * @param {function} getSafeSymbol
 */
function dropAndRefill(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol) {
  const grid = [];
  const allCells = Array.from(gameBoard.children);
  for (let row = 0; row < BOARD_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      grid[row][col] = allCells[row * BOARD_SIZE + col];
    }
  }
  for (let col = 0; col < BOARD_SIZE; col++) {
    let emptySpots = 0;
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (!grid[row][col].textContent) {
        emptySpots++;
      } else if (emptySpots > 0) {
        grid[row + emptySpots][col].textContent = grid[row][col].textContent;
        grid[row][col].textContent = '';
      }
    }
    for (let row = 0; row < emptySpots; row++) {
      grid[row][col].textContent = getSafeSymbol(
        grid.map(r => r.map(c => c.textContent)),
        row,
        col,
        SYMBOLS
      );
    }
  }
}

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
