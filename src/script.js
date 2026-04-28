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

import { areAdjacent } from './game.js';

import {
  trySwap,
  setBoardControllerDeps
} from './boardController.js';

import {
  gameState,
  setDraggedCell,
  setTouchStartCell,
  setTouchStartX,
  setTouchStartY
} from './gameState.js';

import { handleLevelLose } from './gameStatus.js';

import {
  handleDragStart,
  handleDrop,
  handleTouchStart,
  handleTouchEnd
} from './interaction.js';

import { startTimer } from './timer.js';

import {
  attachEventListeners,
  wireUpCellEvents
} from './events.js';

/* -----------------------------------
   DOM ELEMENTS
----------------------------------- */

const playButton = document.getElementById('playBtn');
const howToPlayBtn = document.getElementById('howToPlayBtn');
const heading = document.querySelector('h1');
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

const restartBtn = document.getElementById('restartBtn');
const restartContainer = document.getElementById('restartContainer');
const nextLevelBtn = document.getElementById('nextLevelBtn');

const howToPlayModal = document.getElementById('howToPlayModal');
const closeHowToPlay = document.getElementById('closeHowToPlay');

const gameOverModal = document.getElementById('gameOverModal');
const gameOverRestartBtn = document.getElementById('gameOverRestartBtn');

/* -----------------------------------
   UI HELPERS
----------------------------------- */

function showElement(element) {
  if (element) element.classList.remove('hidden');
}

function hideElement(element) {
  if (element) element.classList.add('hidden');
}

function showMenu() {
  showMenuPage(
    heading,
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
  hideElement(heading);
  hideElement(menu);

  showElement(gameBoardContainer);
  showElement(gameBoard);
  showElement(scoreMovesWrapper);
  showElement(levelDisplay);
  showElement(movesDisplay);
  showElement(scoreDisplay);
  showElement(timerDisplay);
  showElement(livesDisplay);
  showElement(objectiveCounters);

  hideElement(restartContainer);
  hideElement(restartBtn);
  hideElement(nextLevelBtn);
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

    function (event) {
      handleDragStart(
        event,
        gameState,
        setDraggedCell
      );
    },

    function (event) {
      handleDrop(
        event,
        gameState,
        gameState.draggedCell,
        setDraggedCell,
        function (a, b) {
          return areAdjacent(a, b, gameBoard, BOARD_SIZE);
        },
        trySwap
      );
    },

    function (event) {
      handleTouchStart(
        event,
        gameState,
        setTouchStartCell,
        setTouchStartX,
        setTouchStartY,
        gameBoard
      );
    },

    function (event) {
      handleTouchEnd(
        event,
        gameState,
        gameState.touchStartCell,
        gameState.touchStartX,
        gameState.touchStartY,
        setTouchStartCell,
        BOARD_SIZE,
        gameBoard,
        trySwap
      );
    }
  );
}

/* -----------------------------------
   GAME FLOW
----------------------------------- */

function startGame() {
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
    onLevelLose
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
}

function nextLevel() {
  hideElement(restartContainer);
  hideElement(restartBtn);
  hideElement(nextLevelBtn);

  startLevel(gameState.level + 1);
}

function onLevelLose() {
  handleLevelLose(
    restartContainer,
    restartBtn,
    nextLevelBtn
  );

  updateLivesDisplay(livesDisplay, gameState.lives);

  if (gameState.lives <= 0) {
    showGameOver();
  }
}

/* -----------------------------------
   EVENTS
----------------------------------- */

function bindEvents() {
  attachEventListeners({
    restartBtn,
    howToPlayBtn,
    howToPlayModal,
    closeHowToPlay,
    handlePlayClick: startGame,
    handleRestartLevel: restartLevel
  });

  if (playButton) {
    playButton.addEventListener('click', startGame);
  }

  if (nextLevelBtn) {
    nextLevelBtn.addEventListener('click', nextLevel);
  }

  if (gameOverRestartBtn) {
    gameOverRestartBtn.addEventListener('click', function () {
      hideGameOver();
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
    nextLevelBtn,
    restartBtn
  });

  bindEvents();
  showMenu();
}

document.addEventListener('DOMContentLoaded', init);