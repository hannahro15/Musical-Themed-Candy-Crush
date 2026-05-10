// gameController.js - Game flow and state management

import { getLevelConfig, LEVELS } from './levels.js';
import {
  showMenuPage,
  updateObjectiveCounters,
  updateMovesDisplay,
  updateScoreDisplay,
  updateLivesDisplay,
  updateTotalScoreDisplay,
  updateHighScoreDisplay
} from './ui.js';
import { getHighScore, saveHighScore, getHighestLevel, saveHighestLevel, loadGameProgress, clearGameProgress, saveGameProgress } from './storage.js';
import {
  getSafeSymbol,
  hasPossibleMoves,
  generateGameBoard
} from './board.js';
import { BOARD_SIZE, SYMBOLS, INITIAL_LIVES } from './constants.js';
import { gameState } from './gameState.js';
import { handleLevelLose } from './levelOutcomes.js';
import { setGameBoardRef, boardEventHandlers } from './boardEventHandlers.js';
import { startTimer } from './timer.js';
import { wireUpCellEvents } from './events.js';
import { showElement, hideElement } from './utils.js';
import * as dom from './domElements.js';

/* -----------------------------------
   UI STATE
----------------------------------- */

export function showMenu() {
  dom.container?.classList.remove('game-active');
  showMenuPage(
    dom.heading,
    dom.subtitle,
    dom.menu,
    dom.gameBoard,
    dom.movesDisplay,
    dom.scoreDisplay,
    dom.timerDisplay,
    dom.livesDisplay,
    dom.restartContainer
  );
  
  // Show high score and highest level on menu
  const highScore = getHighScore();
  const highestLevel = getHighestLevel();
  updateHighScoreDisplay(dom.highScoreDisplay, highScore);
  
  if (dom.highestLevelDisplay) {
    if (highestLevel > 0) {
      dom.highestLevelDisplay.textContent = `Highest Level: ${highestLevel}`;
      showElement(dom.highestLevelDisplay);
    } else {
      hideElement(dom.highestLevelDisplay);
    }
  }
  
  // Show/hide continue button based on saved progress
  const savedProgress = loadGameProgress();
  if (dom.continueButton) {
    if (savedProgress) {
      showElement(dom.continueButton);
    } else {
      hideElement(dom.continueButton);
    }
  }
  
  // Hide home button on menu
  hideElement(dom.homeBtn);
}

export function showGameUI() {
  dom.container?.classList.add('game-active');
  hideElement(dom.heading);
  hideElement(dom.subtitle);
  hideElement(dom.menu);
  hideElement(dom.highScoreDisplay);
  hideElement(dom.highestLevelDisplay);

  // Always show both the container and the board
  dom.gameBoardContainer.classList.remove('hidden');
  dom.gameBoard.classList.remove('hidden');
  showElement(dom.scoreMovesWrapper);
  showElement(dom.levelDisplay);
  showElement(dom.movesDisplay);
  showElement(dom.scoreDisplay);
  showElement(dom.timerDisplay);
  showElement(dom.livesDisplay);
  showElement(dom.objectiveCounters);
  showElement(dom.totalScoreDisplay);
  showElement(dom.homeBtn);

  hideElement(dom.restartLevelModal);
}

export function showGameOver() {
  showElement(dom.gameOverModal);
}

export function hideGameOver() {
  hideElement(dom.gameOverModal);
}

export function goHome() {
  // Auto-save progress before going home
  autoSaveProgress();
  
  // Stop timer if active
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerActive = false;
  }
  
  // Return to menu
  showMenu();
}

/* -----------------------------------
   STATE HELPERS
----------------------------------- */

export function resetGame() {
  gameState.level = 1;
  gameState.lives = INITIAL_LIVES;
  gameState.score = 0;
  gameState.totalScore = 0;
}

function clearObjectives() {
  Object.keys(gameState).forEach((key) => {
    if (key.endsWith('Left') && key !== 'movesLeft') {
      delete gameState[key];
    }
  });
}

function getCurrentBoardState() {
  const board = [];
  const cells = dom.gameBoard.querySelectorAll('.cell');
  
  for (let i = 0; i < BOARD_SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = Array.from(cells).find(c => 
        parseInt(c.dataset.row) === i && parseInt(c.dataset.col) === j
      );
      board[i][j] = cell ? cell.textContent : '';
    }
  }
  
  return board;
}

export function autoSaveProgress() {
  // Only save if game is active and not at menu
  if (!gameState.levelComplete && gameState.level > 0) {
    const boardState = getCurrentBoardState();
    saveGameProgress(gameState, boardState);
  }
}

function loadObjectives(config) {
  clearObjectives();

  if (!config.objectives) return;

  config.objectives.forEach((objective) => {
    gameState[objective.label + 'Left'] = objective.count;
  });
}

/* -----------------------------------
   BOARD
----------------------------------- */

function generateBoard() {
  setGameBoardRef(dom.gameBoard);
  generateGameBoard(
    dom.gameBoard,
    BOARD_SIZE,
    SYMBOLS,
    getSafeSymbol,
    hasPossibleMoves,
    setupBoardEvents
  );
}

function setupBoardEvents() {
  wireUpCellEvents(
    dom.gameBoard,
    BOARD_SIZE,
    boardEventHandlers.onDragStart,
    boardEventHandlers.onDrop,
    boardEventHandlers.onTouchStart,
    boardEventHandlers.onTouchEnd
  );
}

/* -----------------------------------
   GAME FLOW
----------------------------------- */

export function startGame() {
  console.log('Play Game button clicked');
  hideGameOver();

  resetGame();
  clearGameProgress(); // Clear any saved progress when starting new game
  showGameUI();

  updateLivesDisplay(dom.livesDisplay, gameState.lives);

  startLevel(1);
}

export function continueGame() {
  console.log('Continue Game button clicked');
  const savedProgress = loadGameProgress();
  
  if (!savedProgress) {
    // No saved progress, start new game
    startGame();
    return;
  }
  
  // Restore game state
  gameState.level = savedProgress.level;
  gameState.lives = savedProgress.lives;
  gameState.score = savedProgress.score;
  gameState.totalScore = savedProgress.totalScore;
  gameState.movesLeft = savedProgress.movesLeft;
  gameState.timer = savedProgress.timer;
  
  // Restore objectives
  if (savedProgress.objectives) {
    for (const key in savedProgress.objectives) {
      gameState[key] = savedProgress.objectives[key];
    }
  }
  
  hideGameOver();
  showGameUI();
  
  const config = getLevelConfig(savedProgress.level);
  if (!config) {
    startGame();
    return;
  }
  
  // Restore board state
  restoreBoardState(savedProgress.boardState, config);
  
  // Update UI
  renderLevel(config);
  
  // Start timer if needed
  if (config.timer && savedProgress.timer > 0) {
    gameState.timerActive = true;
    startTimer(
      gameState,
      dom.timerDisplay,
      () => handleLevelLose(dom.restartContainer, dom.confirmRestartBtn, dom.confirmNextLevelBtn)
    );
  }
}

function restoreBoardState(boardState, config) {
  if (!boardState || boardState.length === 0) {
    // No board state saved, generate new board
    generateNewBoard();
    return;
  }
  
  // Clear existing board
  dom.gameBoard.innerHTML = '';
  
  // Recreate board from saved state
  boardState.forEach((row, i) => {
    row.forEach((symbol, j) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.textContent = symbol;
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.draggable = true;
      dom.gameBoard.appendChild(cell);
    });
  });
  
  // Wire up events
  wireUpCellEvents(
    dom.gameBoard,
    BOARD_SIZE,
    boardEventHandlers.onDragStart,
    boardEventHandlers.onDrop,
    boardEventHandlers.onTouchStart,
    boardEventHandlers.onTouchEnd
  );
}

export function startLevel(levelNumber) {
  const config = getLevelConfig(levelNumber);

  if (!config) {
    showMenu();
    return;
  }

  gameState.level = levelNumber;
  gameState.levelComplete = false;
  gameState.movesLeft = config.moves;
  gameState.timer = config.timer;
  gameState.timerActive = true;
  gameState.score = 0;

  loadObjectives(config);

  renderLevel(config);
  generateBoard();

  startTimer(
    gameState,
    dom.timerDisplay,
    () => handleLevelLose(dom.restartContainer, dom.confirmRestartBtn, dom.confirmNextLevelBtn)
  );
}

function renderLevel(config) {
  dom.levelDisplay.textContent = 'LEVEL ' + gameState.level;

  updateMovesDisplay(dom.movesDisplay, gameState.movesLeft);
  updateScoreDisplay(dom.scoreDisplay, gameState.score);
  updateLivesDisplay(dom.livesDisplay, gameState.lives);
  updateTotalScoreDisplay(dom.totalScoreDisplay, gameState.totalScore);

  updateObjectiveCounters(
    dom.objectiveCounters,
    config.objectives,
    gameState
  );
}

export function restartLevel() {
  hideGameOver();
  startLevel(gameState.level);
  hideElement(dom.restartLevelModal);
}

export function nextLevel() {
  // Add current level score to total score
  gameState.totalScore += gameState.score;
  
  if (gameState.level >= LEVELS.length) {
    // Game completed - save high score and highest level
    saveHighScore(gameState.totalScore);
    saveHighestLevel(LEVELS.length);
    clearGameProgress(); // Clear saved progress when game is completed
    
    // Display final score in congratulations modal
    if (dom.congratsFinalScore) {
      dom.congratsFinalScore.textContent = `Total Score: ${gameState.totalScore.toLocaleString()}`;
    }
    
    showElement(dom.congratsModal);
    hideElement(dom.nextLevelModal);
    return;
  }
  
  // Save highest level reached
  saveHighestLevel(gameState.level);
  
  startLevel(gameState.level + 1);
  hideElement(dom.nextLevelModal);
}
