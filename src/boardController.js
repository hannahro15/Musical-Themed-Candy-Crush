
// boardController.js - Handles board swapping and match resolution logic
import { swapCellContents, scoreForMatch, areAdjacent } from './game.js';
import { getLevelConfig } from './levels.js';
import { findMatches, dropAndRefill, hasPossibleMoves } from './board.js';
import { updateMovesDisplay, updateScoreDisplay, updateObjectiveCounters, updateTotalScoreDisplay } from './ui.js';
import { gameState } from './gameState.js';
import { BOARD_SIZE, SYMBOLS } from './constants.js';
import { getSafeSymbol } from './board.js';
import { wireUpCellEvents } from './events.js';
import { boardEventHandlers } from './boardEventHandlers.js';
import { autoSaveProgress } from './gameController.js';
import { announce } from './utils.js';
import { setCellSymbol } from './cellUtils.js';
import * as dom from './domElements.js';

// These will be injected from script.js
let gameBoard, movesDisplay, scoreDisplay, totalScoreDisplay, restartContainer, nextLevelBtn, restartBtn;

/**
 * Injects DOM and UI dependencies for the board controller.
 * @param {Object} deps
 */
export function setBoardControllerDeps(deps) {
  gameBoard = deps.gameBoard;
  movesDisplay = deps.movesDisplay;
  scoreDisplay = deps.scoreDisplay;
  totalScoreDisplay = deps.totalScoreDisplay;
  restartContainer = deps.restartContainer;
  nextLevelBtn = deps.nextLevelBtn;
  restartBtn = deps.restartBtn;
}


/**
 * Attempts to swap two cells and resolve matches if valid.
 * @param {HTMLElement} sourceCell
 * @param {HTMLElement} targetCell
 */
export async function trySwap(sourceCell, targetCell) {
  if (gameState.isResolving || gameState.levelComplete || !gameState.timerActive) return;
  gameState.isResolving = true;

  const matchResult = await swapAndCheckMatch(sourceCell, targetCell);
  if (!matchResult) {
    gameState.isResolving = false;
    return;
  }

  const { scoreGained, matchedCounts, config } = await resolveAllMatchesAndDrop();
  updateScoreAndObjectives(scoreGained, matchedCounts, config);

  // Auto-save progress after each move
  autoSaveProgress();

  if (checkWinCondition(config)) {
    await showLevelWin();
    gameState.isResolving = false;
    return;
  }

  if (gameState.movesLeft <= 0 && !gameState.levelComplete && gameState.timer > 0) {
    await showLevelLose();
    gameState.isResolving = false;
    return;
  }
  gameState.isResolving = false;
}


/**
 * Swaps two cells, checks for a match, and reverts if no match.
 * @param {HTMLElement} sourceCell
 * @param {HTMLElement} targetCell
 * @returns {Promise<boolean>} True if swap results in a match
 */
async function swapAndCheckMatch(sourceCell, targetCell) {
  swapCellContents(sourceCell, targetCell);
  await wait(180);
  let matches = findMatches(gameBoard, BOARD_SIZE);
  const swappedInMatch = matches.some(group => group.includes(sourceCell) || group.includes(targetCell));
  if (matches.length === 0 || !swappedInMatch) {
    swapCellContents(sourceCell, targetCell);
    return false;
  }
  // Decrement movesLeft and update display for a valid swap
  gameState.movesLeft = Math.max(0, gameState.movesLeft - 1);
  updateMovesDisplay(movesDisplay, gameState.movesLeft);
  return true;
}


/**
 * Resolves all matches and drops, handling combos and reshuffles.
 * @returns {Promise<{scoreGained: number, matchedCounts: Object, config: Object}>}
 */
async function resolveAllMatchesAndDrop() {
  let matches = findMatches(gameBoard, BOARD_SIZE);
  let scoreGained = 0;
  let chainCount = 0;
  const config = getLevelConfig(gameState.level);
  const matchedCounts = {};
  config.objectives.forEach(obj => { matchedCounts[obj.label] = 0; });

  while (matches.length > 0) {
    chainCount++;
    let waveScore = 0;
    for (const group of matches) {
      const matchScore = scoreForMatch(group.length);
      scoreGained += matchScore;
      waveScore += matchScore;
      for (const cell of group) {
        cell.classList.add('matched');
        config.objectives.forEach(obj => {
          if (cell.textContent === obj.symbol) matchedCounts[obj.label]++;
        });
      }
    }

    if (waveScore > 0) {
      showScorePopup(waveScore, matches.flat());
    }

    const comboLevel = getComboLevel(matches, chainCount);
    const comboBonus = getComboBonus(matches, chainCount);
    if (comboBonus > 0) {
      scoreGained += comboBonus;
      showScorePopup(comboBonus, matches.flat(), 'combo', comboLevel);
      announce(`Combo times ${comboLevel}! Plus ${comboBonus} points.`);
    } else if (waveScore > 0) {
      const matchCount = matches.length;
      announce(`${matchCount} match${matchCount > 1 ? 'es' : ''} found! Plus ${waveScore} points.`);
    }

    await wait(80); // Reduced animation delay for faster match disappearance
    for (const group of matches) {
      for (const cell of group) {
        setCellSymbol(cell, '');
        cell.classList.remove('matched');
      }
    }
    dropAndRefill(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol);
    wireBoardEvents();
    matches = findMatches(gameBoard, BOARD_SIZE);
    if (!hasPossibleMoves(gameBoard, BOARD_SIZE)) {
      await import('./board.js').then(({ reshuffleBoard }) => {
        reshuffleBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol, hasPossibleMoves, wireBoardEvents);
      });
      break;
    }
  }
  return { scoreGained, matchedCounts, config };
}

function wireBoardEvents() {
  wireUpCellEvents(
    gameBoard,
    BOARD_SIZE,
    boardEventHandlers.onDragStart,
    boardEventHandlers.onDrop,
    boardEventHandlers.onTouchStart,
    boardEventHandlers.onTouchEnd
  );
}

async function showLevelWin() {
  await wait(250);
  const { handleLevelWin } = await import('./levelOutcomes.js');
  handleLevelWin();
}

async function showLevelLose() {
  const { handleLevelLose } = await import('./levelOutcomes.js');
  handleLevelLose(
    dom.restartContainer,
    dom.confirmRestartBtn,
    dom.confirmNextLevelBtn
  );
}


/**
 * Updates the score, total score, and objectives after matches.
 * @param {number} scoreGained
 * @param {Object} matchedCounts
 * @param {Object} config
 */
function updateScoreAndObjectives(scoreGained, matchedCounts, config) {
  gameState.score += scoreGained;
  gameState.totalScore += scoreGained;
  updateScoreDisplay(scoreDisplay, gameState.score);
  updateTotalScoreDisplay(totalScoreDisplay, gameState.totalScore);
  config.objectives.forEach(obj => {
    const key = obj.label + 'Left';
    if (typeof gameState[key] !== 'number') gameState[key] = obj.count;
    if (matchedCounts[obj.label] > 0) {
      gameState[key] = Math.max(0, gameState[key] - matchedCounts[obj.label]);
    }
  });
  updateObjectiveCounters(document.getElementById('objective-counters'), config.objectives, gameState);
}


/**
 * Checks if all objectives are complete for the current level.
 * @param {Object} config
 * @returns {boolean}
 */
function checkWinCondition(config) {
  return config.objectives.every(obj => {
    const key = obj.label + 'Left';
    return gameState[key] === 0;
  });
}


/**
 * Waits for a specified number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}


/**
 * Returns the combo level for a match chain.
 * @param {HTMLElement[][]} matches
 * @param {number} chainCount
 * @returns {number}
 */
function getComboLevel(matches, chainCount) {
  return Math.max(matches.length, chainCount);
}


/**
 * Calculates the combo bonus for a match chain.
 * @param {HTMLElement[][]} matches
 * @param {number} chainCount
 * @returns {number}
 */
function getComboBonus(matches, chainCount) {
  let bonus = 0;
  if (matches.length > 1) {
    bonus += (matches.length - 1) * 20;
  }
  if (chainCount > 1) {
    bonus += chainCount * 20;
  }
  return bonus;
}


/**
 * Shows a score popup animation at the center of matched cells.
 * @param {number} points
 * @param {HTMLElement[]} cells
 * @param {string} [type]
 * @param {number} [comboLevel]
 */
function showScorePopup(points, cells, type = 'score', comboLevel = 1) {
  if (!gameBoard || !points || !cells?.length) return;

  const popup = document.createElement('div');
  popup.className = `score-popup${type === 'combo' ? ' combo-popup' : ''}`;
  popup.textContent = type === 'combo'
    ? `Combo x${comboLevel} +${points}`
    : `+${points}`;

  const centerX = cells.reduce((sum, cell) => sum + cell.offsetLeft + (cell.offsetWidth / 2), 0) / cells.length;
  const centerY = cells.reduce((sum, cell) => sum + cell.offsetTop + (cell.offsetHeight / 2), 0) / cells.length;

  popup.style.left = `${centerX}px`;
  popup.style.top = `${centerY}px`;

  gameBoard.appendChild(popup);

  window.setTimeout(() => {
    popup.remove();
  }, 700);
}

export {
  getComboLevel,
  getComboBonus,
  updateScoreAndObjectives,
  checkWinCondition,
  showScorePopup
};
