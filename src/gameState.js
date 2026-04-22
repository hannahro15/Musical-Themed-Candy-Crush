// gameState.js - Handles game state object and state-reset logic
import { INITIAL_LIVES } from './constants.js';

export let gameState = {
  movesLeft: 0,
  score: 0,
  isResolving: false,
  level: 1,
  levelComplete: false,
  timer: 0,
  timerInterval: null,
  timerActive: false,
  lives: INITIAL_LIVES,
};

export function resetGameState(config) {
  gameState.movesLeft = config.moves;
  gameState.score = 0;
  Object.keys(gameState).forEach(key => {
    if (key.endsWith('Left') && key !== 'movesLeft') delete gameState[key];
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
