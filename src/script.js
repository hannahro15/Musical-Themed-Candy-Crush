// script.js - Application initialization and event binding

import { setBoardControllerDeps } from './boardController.js';
import { showElement, hideElement } from './utils.js';
import * as dom from './domElements.js';
import {
  showMenu,
  showGameUI,
  showGameOver,
  hideGameOver,
  startGame,
  continueGame,
  restartLevel,
  nextLevel,
  goHome
} from './gameController.js';

/* -----------------------------------
   EVENT BINDING
----------------------------------- */

function bindEvents() {
  // Play Game button event
  if (dom.playButton) {
    dom.playButton.addEventListener('click', startGame);
  }

  // Continue Game button event
  if (dom.continueButton) {
    dom.continueButton.addEventListener('click', continueGame);
  }

  // Home button event (during gameplay)
  if (dom.homeBtn) {
    dom.homeBtn.addEventListener('click', goHome);
  }

  // Restart modal events
  if (dom.restartTrigger) {
    dom.restartTrigger.addEventListener('click', () => {
      showElement(dom.restartLevelModal);
    });
  }
  if (dom.confirmRestartBtn) {
    dom.confirmRestartBtn.addEventListener('click', restartLevel);
  }
  if (dom.cancelRestartBtn) {
    dom.cancelRestartBtn.addEventListener('click', () => {
      hideElement(dom.restartLevelModal);
    });
  }
  if (dom.closeRestartModal) {
    dom.closeRestartModal.addEventListener('click', () => {
      hideElement(dom.restartLevelModal);
    });
  }

  // Next level modal events
  if (dom.confirmNextLevelBtn) {
    dom.confirmNextLevelBtn.addEventListener('click', nextLevel);
  }
  if (dom.cancelNextLevelBtn) {
    dom.cancelNextLevelBtn.addEventListener('click', () => {
      hideElement(dom.nextLevelModal);
    });
  }
  if (dom.closeNextLevelModal) {
    dom.closeNextLevelModal.addEventListener('click', () => {
      hideElement(dom.nextLevelModal);
    });
  }

  // How to play modal events
  if (dom.howToPlayBtn) {
    dom.howToPlayBtn.addEventListener('click', () => {
      showElement(dom.howToPlayModal);
    });
  }
  if (dom.closeHowToPlay) {
    dom.closeHowToPlay.addEventListener('click', () => {
      hideElement(dom.howToPlayModal);
    });
  }

  // Game over modal events
  if (dom.gameOverPlayAgainBtn) {
    dom.gameOverPlayAgainBtn.addEventListener('click', () => {
      hideGameOver();
      startGame();
    });
  }
  if (dom.gameOverHomeBtn) {
    dom.gameOverHomeBtn.addEventListener('click', () => {
      hideGameOver();
      showMenu();
    });
  }

  // Congratulations modal events
  if (dom.congratsPlayAgainBtn) {
    dom.congratsPlayAgainBtn.addEventListener('click', () => {
      hideElement(dom.congratsModal);
      startGame();
    });
  }
  if (dom.congratsHomeBtn) {
    dom.congratsHomeBtn.addEventListener('click', () => {
      hideElement(dom.congratsModal);
      showMenu();
    });
  }
}

/* -----------------------------------
   INITIALIZATION
----------------------------------- */

function init() {
  setBoardControllerDeps({
    gameBoard: dom.gameBoard,
    movesDisplay: dom.movesDisplay,
    scoreDisplay: dom.scoreDisplay,
    totalScoreDisplay: dom.totalScoreDisplay,
    restartContainer: dom.restartContainer,
    restartBtn: dom.confirmRestartBtn,
    nextLevelBtn: dom.confirmNextLevelBtn
  });

  bindEvents();
  showMenu();
}

document.addEventListener('DOMContentLoaded', init);