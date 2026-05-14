//add tests for gameController.js

import { gameState } from '../src/gameState.js';
import { startLevel } from '../src/gameController.js';

describe('gameController', () => {
  beforeEach(() => {
    // Reset gameState before each test
    gameState.levelComplete = false;
    gameState.timerActive = false;
    gameState.timerInterval = null;
    gameState.lives = 3; // Assuming INITIAL_LIVES is 3
    gameState.level = 1;
    gameState.score = 0;
    gameState.totalScore = 0;
    document.body.innerHTML = '';
  });
});