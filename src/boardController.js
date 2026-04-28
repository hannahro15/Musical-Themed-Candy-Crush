// boardController.js - Handles board swapping and match resolution logic
import { swapCellContents, scoreForMatch, areAdjacent } from './game.js';
import { getLevelConfig } from './levels.js';
import { findMatches, dropAndRefill, hasPossibleMoves } from './board.js';
import { updateMovesDisplay, updateScoreDisplay, updateObjectiveCounters } from './ui.js';
import { gameState } from './gameState.js';
import { BOARD_SIZE, SYMBOLS } from './constants.js';
import { getSafeSymbol } from './board.js';
import { wireUpCellEvents } from './events.js';

// These will be injected from script.js
let gameBoard, movesDisplay, scoreDisplay, restartContainer, nextLevelBtn, restartBtn;

export function setBoardControllerDeps(deps) {
  gameBoard = deps.gameBoard;
  movesDisplay = deps.movesDisplay;
  scoreDisplay = deps.scoreDisplay;
  restartContainer = deps.restartContainer;
  nextLevelBtn = deps.nextLevelBtn;
  restartBtn = deps.restartBtn;
}

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

  if (checkWinCondition(config)) {
    // handleLevelWin should be called from script.js after trySwap resolves
    gameState.isResolving = false;
    return;
  }

  if (gameState.movesLeft <= 0 && !gameState.levelComplete && gameState.timer > 0) {
    // handleLevelLose should be called from script.js after trySwap resolves
    gameState.isResolving = false;
    return;
  }
  gameState.isResolving = false;
}

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

async function resolveAllMatchesAndDrop() {
  let matches = findMatches(gameBoard, BOARD_SIZE);
  let scoreGained = 0;
  const config = getLevelConfig(gameState.level);
  const matchedCounts = {};
  config.objectives.forEach(obj => { matchedCounts[obj.label] = 0; });

  while (matches.length > 0) {
    for (const group of matches) {
      scoreGained += scoreForMatch(group.length);
      for (const cell of group) {
        cell.classList.add('matched');
        config.objectives.forEach(obj => {
          if (cell.textContent === obj.symbol) matchedCounts[obj.label]++;
        });
      }
    }
    await wait(250); // Animation delay
    for (const group of matches) {
      for (const cell of group) {
        cell.textContent = '';
        cell.classList.remove('matched');
      }
    }
    dropAndRefill(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol);
    wireUpCellEvents(
      gameBoard,
      BOARD_SIZE,
      // These event handlers should be injected or imported as needed
      // For now, leave as placeholders
      () => {},
      () => {},
      () => {},
      () => {}
    );
    matches = findMatches(gameBoard, BOARD_SIZE);
    if (!hasPossibleMoves(gameBoard, BOARD_SIZE)) {
      await import('./board.js').then(({ reshuffleBoard }) => {
        reshuffleBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol, hasPossibleMoves, () => wireUpCellEvents(
          gameBoard,
          BOARD_SIZE,
          () => {},
          () => {},
          () => {},
          () => {}
        ));
      });
      break;
    }
  }
  return { scoreGained, matchedCounts, config };
}

function updateScoreAndObjectives(scoreGained, matchedCounts, config) {
  gameState.score += scoreGained;
  updateScoreDisplay(scoreDisplay, gameState.score);
  config.objectives.forEach(obj => {
    const key = obj.label + 'Left';
    if (typeof gameState[key] !== 'number') gameState[key] = obj.count;
    if (matchedCounts[obj.label] > 0) {
      gameState[key] = Math.max(0, gameState[key] - matchedCounts[obj.label]);
    }
  });
  updateObjectiveCounters(document.getElementById('objective-counters'), config.objectives, gameState);
}

function checkWinCondition(config) {
  return config.objectives.every(obj => {
    const key = obj.label + 'Left';
    return gameState[key] === 0;
  });
}

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}
