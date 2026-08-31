// gameState.js - Handles game state object and state-reset logic
import { INITIAL_LIVES } from './constants.js';

export let gameState = {
  movesLeft: 0,
  score: 0,
  totalScore: 0,
  isResolving: false,
  level: 1,
  levelComplete: false,
  timer: 0,
  timerInterval: null,
  timerActive: false,
  lives: INITIAL_LIVES,
  draggedCell: null,
  touchStartCell: null,
  touchStartX: null,
  touchStartY: null,
  selectedCell: null,
};

/**
 * True for dynamic objective-progress keys (e.g. "violinLeft"), which are
 * distinguished from the fixed "movesLeft" field by the same "Left" suffix.
 * @param {string} key
 * @returns {boolean}
 */
export function isObjectiveKey(key) {
  return key.endsWith('Left') && key !== 'movesLeft';
}

export function resetGameState(config) {
  gameState.movesLeft = config.moves;
  gameState.score = 0;
  Object.keys(gameState).forEach(key => {
    if (isObjectiveKey(key)) delete gameState[key];
  });
  if (config.objectives && Array.isArray(config.objectives)) {
    config.objectives.forEach(obj => {
      gameState[obj.label + 'Left'] = obj.count;
    });
  }
  gameState.levelComplete = false;
  gameState.timer = config.timer;
  gameState.timerActive = true;
}

export function setDraggedCell(cell) {
  gameState.draggedCell = cell;
}
export function setTouchStartCell(cell) {
  gameState.touchStartCell = cell;
}
export function setTouchStartX(x) {
  gameState.touchStartX = x;
}
export function setTouchStartY(y) {
  gameState.touchStartY = y;
}
export function setSelectedCell(cell) {
  gameState.selectedCell = cell;
}
