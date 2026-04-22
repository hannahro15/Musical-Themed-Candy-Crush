

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
const nextLevelBtn = document.getElementById('nextLevelBtn');

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
  // Hide next level and restart buttons at the start
  if (nextLevelBtn) nextLevelBtn.classList.add('hidden');
  if (restartBtn) restartBtn.classList.add('hidden');
  if (restartContainer) restartContainer.classList.add('hidden');
  const config = getLevelConfig(levelNum);
  gameState.movesLeft = config.moves;
  gameState.score = 0;
  gameState.violinsLeft = config.violins;
  gameState.pianosLeft = config.pianos;
  gameState.level = levelNum;
  gameState.levelComplete = false;
  gameState.timer = config.timer;
  gameState.timerActive = true;
  document.getElementById('levelDisplay').textContent = `Level ${levelNum}`;
  updateLivesDisplay(livesDisplay, gameState.lives);
  updateMovesDisplay(movesDisplay, gameState.movesLeft);
  updateScoreDisplay(scoreDisplay, gameState.score);
  updateLevel1Counters(violinCounter, pianoCounter, gameState.violinsLeft, gameState.pianosLeft);
  updateTimerDisplay(timerDisplay, gameState.timer);

  // Reset timer before generating the board
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  gameState.timerActive = true;
  gameState.timer = config.timer;

  generateGameBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol);
  wireUpCellEvents();
  // Counters for level objective (not board count)
  updateLevel1Counters(violinCounter, pianoCounter, gameState.violinsLeft, gameState.pianosLeft);
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
  let violinsMatched = 0;
  let pianosMatched = 0;

  while (matches.length > 0) {
    // Animate matched cells
    for (const group of matches) {
      scoreGained += scoreForMatch(group.length);
      for (const cell of group) {
        cell.classList.add('matched');
        if (cell.textContent === '🎻') violinsMatched++;
        if (cell.textContent === '🎹') pianosMatched++;
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

// Reshuffles the board until there is at least one possible move
function reshuffleBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol) {
  let allCells = Array.from(gameBoard.children);
  let symbols = allCells.map(cell => cell.textContent).filter(Boolean);
  let attempts = 0;
  do {
    // Shuffle symbols array
    for (let i = symbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
    }
    // Assign shuffled symbols back to cells
    allCells.forEach((cell, idx) => {
      cell.textContent = symbols[idx] || '';
    });
    attempts++;
    // Avoid infinite loop: after 20 tries, just refill the board
    if (attempts > 20) {
      generateGameBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol);
      break;
    }
  } while (!hasPossibleMoves(gameBoard, BOARD_SIZE));
}

  // Decrease counters for matched violins/pianos (level objective)
  if (violinsMatched > 0 || pianosMatched > 0) {
    gameState.violinsLeft = Math.max(0, gameState.violinsLeft - violinsMatched);
    gameState.pianosLeft = Math.max(0, gameState.pianosLeft - pianosMatched);
    updateLevel1Counters(violinCounter, pianoCounter, gameState.violinsLeft, gameState.pianosLeft);
    // Check for win condition after counters update
    if (gameState.violinsLeft === 0 && gameState.pianosLeft === 0) {
      handleLevelWin();
      return;
    }
  }

// Show Next Level button and stop timer on win
function handleLevelWin() {
  gameState.levelComplete = true;
  gameState.timerActive = false;
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  if (restartContainer) restartContainer.classList.remove('hidden');
  if (nextLevelBtn) nextLevelBtn.classList.remove('hidden');
  if (restartBtn) restartBtn.classList.add('hidden');
}

// Show Restart Level button and stop timer on lose
function handleLevelLose() {
  gameState.levelComplete = true;
  gameState.timerActive = false;
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  // Always show the restart container and button
  if (restartContainer) restartContainer.classList.remove('hidden');
  if (restartBtn) restartBtn.classList.remove('hidden');
  if (nextLevelBtn) nextLevelBtn.classList.add('hidden');
}
  // Update score and moves
  gameState.score += scoreGained;
  gameState.movesLeft--;
  updateScoreDisplay(scoreDisplay, gameState.score);
  updateMovesDisplay(movesDisplay, gameState.movesLeft);


  // Optionally update board counters for debugging (not for objectives)
  // updateSymbolCounters();
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
      handleLevelLose();
    }
  }, 1000);
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
  const counters = document.getElementById('objective-counters') || level1Counters;
  counters.classList.remove('hidden');

  // Start the first level
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

if (nextLevelBtn) {
  nextLevelBtn.addEventListener('click', () => {
    startLevel(gameState.level + 1);
  });
}

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
