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
import { getHighScore, saveHighScore } from './storage.js';
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
  
  // Show high score on menu
  const highScore = getHighScore();
  updateHighScoreDisplay(dom.highScoreDisplay, highScore);
}

export function showGameUI() {
  dom.container?.classList.add('game-active');
  hideElement(dom.heading);
  hideElement(dom.subtitle);
  hideElement(dom.menu);
  hideElement(dom.highScoreDisplay);

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

  hideElement(dom.restartLevelModal);
}

export function showGameOver() {
  showElement(dom.gameOverModal);
}

export function hideGameOver() {
  hideElement(dom.gameOverModal);
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
  showGameUI();

  updateLivesDisplay(dom.livesDisplay, gameState.lives);

  startLevel(1);
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
    // Game completed - save high score
    saveHighScore(gameState.totalScore);
    showElement(dom.congratsModal);
    hideElement(dom.nextLevelModal);
    return;
  }
  startLevel(gameState.level + 1);
  hideElement(dom.nextLevelModal);
}
