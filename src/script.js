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
  goHome,
  restartGameFromBeginning
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

  // Restart Game button event
  if (dom.restartGameButton) {
    dom.restartGameButton.addEventListener('click', () => {
      const { restartGame } = require('./gameController.js');
      restartGame();
    });
  }

  // Home button event (during gameplay)
  if (dom.homeBtn) {
    dom.homeBtn.addEventListener('click', (e) => {
      // Only show confirm modal if in game (board is visible)
      if (!dom.gameBoardContainer.classList.contains('hidden')) {
        const modal = document.getElementById('confirmHomeModal');
        modal.classList.remove('hidden');
        // Focus the close button for accessibility
        const closeBtn = document.getElementById('closeConfirmHomeModal');
        if (closeBtn) closeBtn.focus();

        function cleanup() {
          modal.classList.add('hidden');
          confirmBtn.removeEventListener('click', handleConfirm);
          cancelBtn.removeEventListener('click', handleCancel);
          closeBtn.removeEventListener('click', handleClose);
          closeBtn.removeEventListener('keydown', handleCloseKey);
        }

        function handleConfirm() {
          cleanup();
          if (typeof saveGameProgress === 'function') saveGameProgress();
          goHome();
        }
        function handleCancel() {
          cleanup();
        }
        function handleClose() {
          cleanup();
        }
        function handleCloseKey(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClose();
          }
        }

        const confirmBtn = document.getElementById('confirmHomeBtn');
        const cancelBtn = document.getElementById('cancelHomeBtn');
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        closeBtn.addEventListener('click', handleClose);
        closeBtn.addEventListener('keydown', handleCloseKey);
      } else {
        goHome();
      }
    });
  }

  // Restart Game button event
  if (dom.restartGameBtn) {
    dom.restartGameBtn.addEventListener('click', restartGameFromBeginning);
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