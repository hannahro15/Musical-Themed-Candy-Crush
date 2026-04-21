

import { getLevelConfig } from './levels.js';
import { showMenuPage, updateLivesDisplay, updateMovesDisplay, updateScoreDisplay, updateLevel1Counters, updateTimerDisplay } from './ui.js';
import { getSafeSymbol, generateGameBoard, findMatches } from './board.js';
import { BOARD_SIZE, SYMBOLS, INITIAL_LIVES } from './constants.js';
import { handleDragStart, handleDrop, handleTouchStart, handleTouchEnd } from './interaction.js';
import { swapCellContents, areAdjacent, scoreForMatch } from './game.js';

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

/**
 * Starts a new level and initializes the game state and UI.
 * @param {number} levelNum
 */
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
  wireUpCellEvents();
  startTimer();
}

// --- Drag/Touch State ---
let draggedCell = null;
let touchStartCell = null;
let touchStartX = 0;
let touchStartY = 0;

function setDraggedCell(cell) {
  draggedCell = cell;
}
function setTouchStartCell(cell) {
  touchStartCell = cell;
}
function setTouchStartX(x) {
  touchStartX = x;
}
function setTouchStartY(y) {
  touchStartY = y;
}

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
  handleDrop(e, gameState, draggedCell, setDraggedCell, (a, b) => areAdjacent(a, b, gameBoard, BOARD_SIZE), trySwap);
}
function onTouchStart(e) {
  handleTouchStart(e, gameState, setTouchStartCell, setTouchStartX, setTouchStartY, gameBoard);
}
function onTouchEnd(e) {
  handleTouchEnd(e, gameState, touchStartCell, touchStartX, touchStartY, setTouchStartCell, BOARD_SIZE, gameBoard, trySwap);
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

  while (matches.length > 0) {
    // Animate matched cells
    for (const group of matches) {
      scoreGained += scoreForMatch(group.length);
      for (const cell of group) {
        cell.classList.add('matched');
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
    wireUpCellEvents(); // Ensure new cells are interactive

    // Update symbol counters after board changes
    updateSymbolCounters();

    matches = findMatches(gameBoard, BOARD_SIZE);
  }

  // Update score and moves
  gameState.score += scoreGained;
  gameState.movesLeft--;
  updateScoreDisplay(scoreDisplay, gameState.score);
  updateMovesDisplay(movesDisplay, gameState.movesLeft);


  // Update symbol counters after all matches resolved
  updateSymbolCounters();
// Update the violin and piano counters based on the current board
function updateSymbolCounters() {
  const allCells = Array.from(gameBoard.children);
  let violins = 0;
  let pianos = 0;
  for (const cell of allCells) {
    if (cell.textContent === '🎻') violins++;
    if (cell.textContent === '🎹') pianos++;
  }
  gameState.violinsLeft = violins;
  gameState.pianosLeft = pianos;
  updateLevel1Counters(violinCounter, pianoCounter, violins, pianos);
}

  gameState.isResolving = false;
}
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
 * Starts the countdown timer for the level.
 */
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

/**
 * Handles Play Game button click.
 */
function handlePlayClick() {
  gameState.lives = INITIAL_LIVES;
  startLevel(1);
}

/**
 * Handles Restart Level button click.
 */
function handleRestartLevel() {
  if (gameState.lives === 0) {
    showMenuPage(heading, menu, gameBoard, level1Counters, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
    gameState.lives = INITIAL_LIVES;
    return;
  }
  startLevel(gameState.level);
}

// --- Event Listeners ---


/**
 * Attaches main menu and restart event listeners.
 */
function attachEventListeners() {
  if (playButton) playButton.addEventListener('click', handlePlayClick);
  if (restartBtn) restartBtn.addEventListener('click', handleRestartLevel);
}

// --- Initialization ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    showMenuPage(heading, menu, gameBoard, level1Counters, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
    attachEventListeners();
  });
} else {
  showMenuPage(heading, menu, gameBoard, level1Counters, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);
  attachEventListeners();
}
