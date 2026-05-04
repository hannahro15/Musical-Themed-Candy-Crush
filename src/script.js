// main.js

import { getLevelConfig } from './levels.js';
import {
  showMenuPage,
  updateObjectiveCounters,
  updateMovesDisplay,
  updateScoreDisplay,
  updateLivesDisplay
} from './ui.js';

import {
  getSafeSymbol,
  hasPossibleMoves,
  generateGameBoard
} from './board.js';

import {
  BOARD_SIZE,
  SYMBOLS,
  INITIAL_LIVES
} from './constants.js';

import { setBoardControllerDeps } from './boardController.js';
import { gameState } from './gameState.js';
import { handleLevelLose, handleLevelWin } from './gameStatus.js';
import { setGameBoardRef, boardEventHandlers } from './boardEventHandlers.js';
import { startTimer } from './timer.js';
import { wireUpCellEvents } from './events.js';
import { showElement, hideElement } from './utils.js';

/* -----------------------------------
   DOM ELEMENTS
----------------------------------- */

const playButton = document.getElementById('playBtn');
const howToPlayBtn = document.getElementById('howToPlayBtn');
const container = document.querySelector('.container');
const heading = document.querySelector('h1');
const subtitle = document.querySelector('.subtitle');
const menu = document.querySelector('.menu');

const gameBoard = document.getElementById('gameBoard');
const gameBoardContainer = document.getElementById('game-board-container');

const movesDisplay = document.getElementById('movesDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const levelDisplay = document.getElementById('levelDisplay');

const scoreMovesWrapper = document.getElementById('score-moves-wrapper');
const objectiveCounters = document.getElementById('objective-counters');

// Add missing restartContainer reference for menu/game UI state
const restartContainer = document.getElementById('restartLevelModal');
const restartLevelModal = document.getElementById('restartLevelModal');
const confirmRestartBtn = document.getElementById('confirmRestartBtn');
const cancelRestartBtn = document.getElementById('cancelRestartBtn');
const closeRestartModal = document.getElementById('closeRestartModal');
const nextLevelModal = document.getElementById('nextLevelModal');
const confirmNextLevelBtn = document.getElementById('confirmNextLevelBtn');
const cancelNextLevelBtn = document.getElementById('cancelNextLevelBtn');
const closeNextLevelModal = document.getElementById('closeNextLevelModal');


const howToPlayModal = document.getElementById('howToPlayModal');
const closeHowToPlay = document.getElementById('closeHowToPlay');

const gameOverModal = document.getElementById('gameOverModal');
const gameOverRestartBtn = document.getElementById('gameOverRestartBtn');

// Congratulations modal
const congratsModal = document.getElementById('congratsModal');
const congratsRestartBtn = document.getElementById('congratsRestartBtn');



function showMenu() {
  container?.classList.remove('game-active');
  showMenuPage(
    heading,
    subtitle,
    menu,
    gameBoard,
    movesDisplay,
    scoreDisplay,
    timerDisplay,
    livesDisplay,
    restartContainer
  );
}

function showGameUI() {
  container?.classList.add('game-active');
  hideElement(heading);
  hideElement(subtitle);
  hideElement(menu);

  // Always show both the container and the board
  gameBoardContainer.classList.remove('hidden');
  gameBoard.classList.remove('hidden');
  showElement(scoreMovesWrapper);
  showElement(levelDisplay);
  showElement(movesDisplay);
  showElement(scoreDisplay);
  showElement(timerDisplay);
  showElement(livesDisplay);
  showElement(objectiveCounters);

  hideElement(restartLevelModal);
}

function showGameOver() {
  showElement(gameOverModal);
}

function hideGameOver() {
  hideElement(gameOverModal);
}

/* -----------------------------------
   STATE HELPERS
----------------------------------- */

function resetGame() {
  gameState.level = 1;
  gameState.lives = INITIAL_LIVES;
  gameState.score = 0;
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
  setGameBoardRef(gameBoard);
  generateGameBoard(
    gameBoard,
    BOARD_SIZE,
    SYMBOLS,
    getSafeSymbol,
    hasPossibleMoves,
    setupBoardEvents
  );
}


function setupBoardEvents() {
  wireUpCellEvents(
    gameBoard,
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

function startGame() {
  console.log('Play Game button clicked');
  hideGameOver();

  resetGame();
  showGameUI();

  updateLivesDisplay(livesDisplay, gameState.lives);

  startLevel(1);
}

function startLevel(levelNumber) {
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
    timerDisplay,
    () => handleLevelLose(restartContainer, confirmRestartBtn, confirmNextLevelBtn)
  );
}

function renderLevel(config) {
  levelDisplay.textContent = 'LEVEL ' + gameState.level;

  updateMovesDisplay(movesDisplay, gameState.movesLeft);
  updateScoreDisplay(scoreDisplay, gameState.score);
  updateLivesDisplay(livesDisplay, gameState.lives);

  updateObjectiveCounters(
    objectiveCounters,
    config.objectives,
    gameState
  );
}

function restartLevel() {
  hideGameOver();

  if (gameState.lives <= 0) {
    resetGame();
    updateLivesDisplay(livesDisplay, gameState.lives);
    showMenu();
    return;
  }

  startLevel(gameState.level);
  hideElement(restartLevelModal);
}


import { LEVELS } from './levels.js';

function nextLevel() {
  if (gameState.level >= LEVELS.length) {
    // Show congratulations modal if last level completed
    showElement(congratsModal);
    hideElement(nextLevelModal);
    return;
  }
  startLevel(gameState.level + 1);
  hideElement(nextLevelModal);
}


function onLevelLose() {
  handleLevelLose(
    restartContainer,
    confirmRestartBtn,
    confirmNextLevelBtn
  );
  updateLivesDisplay(livesDisplay, gameState.lives);
  if (gameState.lives <= 0) {
    showGameOver();
  }
}

function onLevelWin() {
  handleLevelWin();
}

/* -----------------------------------
   EVENTS
----------------------------------- */

function bindEvents() {
  // Play Game button event
  if (playButton) {
    playButton.addEventListener('click', function () {
      startGame();
    });
  }

  // Restart modal events
  const restartTrigger = document.getElementById('restartBtn');
  if (restartTrigger) {
    restartTrigger.addEventListener('click', function () {
      showElement(restartLevelModal);
    });
  }
  if (confirmRestartBtn) {
    confirmRestartBtn.addEventListener('click', restartLevel);
  }
  if (cancelRestartBtn) {
    cancelRestartBtn.addEventListener('click', function () {
      hideElement(restartLevelModal);
    });
  }
  if (closeRestartModal) {
    closeRestartModal.addEventListener('click', function () {
      hideElement(restartLevelModal);
    });
  }

  // Next level modal events
  if (confirmNextLevelBtn) {
    confirmNextLevelBtn.addEventListener('click', nextLevel);
  }
  if (cancelNextLevelBtn) {
    cancelNextLevelBtn.addEventListener('click', function () {
      hideElement(nextLevelModal);
    });
  }
  if (closeNextLevelModal) {
    closeNextLevelModal.addEventListener('click', function () {
      hideElement(nextLevelModal);
    });
  }

  if (howToPlayBtn) {
    howToPlayBtn.addEventListener('click', function () {
      showElement(howToPlayModal);
    });
  }
  if (closeHowToPlay) {
    closeHowToPlay.addEventListener('click', function () {
      hideElement(howToPlayModal);
    });
  }

  if (gameOverRestartBtn) {
    gameOverRestartBtn.addEventListener('click', function () {
      hideGameOver();
      showMenu();
    });
  }
  if (congratsRestartBtn) {
    congratsRestartBtn.addEventListener('click', function () {
      hideElement(congratsModal);
      showMenu();
    });
  }
}


/* -----------------------------------
   INIT
----------------------------------- */

function init() {
  setBoardControllerDeps({
    gameBoard,
    movesDisplay,
    scoreDisplay,
    restartContainer,
    restartBtn: confirmRestartBtn,
    nextLevelBtn: confirmNextLevelBtn
  });

  bindEvents();
  showMenu();
}

document.addEventListener('DOMContentLoaded', init);