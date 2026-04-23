// gameStatus.test.js - Unit tests for gameStatus.js
// Add your tests here
import { gameState } from '../src/gameState.js';
import { handleLevelWin, handleLevelLose } from '../src/gameStatus.js';

describe('gameStatus', () => {
  beforeEach(() => {
    // Reset gameState before each test
    gameState.levelComplete = false;
    gameState.timerActive = false;
    gameState.timerInterval = null;
    gameState.lives = 3; // Assuming INITIAL_LIVES is 3
  });

  test('handleLevelWin updates gameState and UI elements correctly', () => {
    const restartContainer = document.createElement('div');
    const nextLevelBtn = document.createElement('button');
    const restartBtn = document.createElement('button');
    restartContainer.classList.add('hidden');
    nextLevelBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');

    handleLevelWin(restartContainer, nextLevelBtn, restartBtn);

    expect(gameState.levelComplete).toBe(true);
    expect(gameState.timerActive).toBe(false);
    expect(restartContainer.classList.contains('hidden')).toBe(false);
    expect(nextLevelBtn.classList.contains('hidden')).toBe(false);
    expect(restartBtn.classList.contains('hidden')).toBe(true);
  });

  test('handleLevelLose updates gameState and UI elements correctly', () => {
    const restartContainer = document.createElement('div');
    const restartBtn = document.createElement('button');
    const nextLevelBtn = document.createElement('button');
    restartContainer.classList.add('hidden');
    restartBtn.classList.add('hidden');
    nextLevelBtn.classList.remove('hidden');

    handleLevelLose(restartContainer, restartBtn, nextLevelBtn);

    expect(gameState.levelComplete).toBe(true);
    expect(gameState.timerActive).toBe(false);
    expect(gameState.lives).toBe(2); // Assuming it decrements from 3
    expect(restartContainer.classList.contains('hidden')).toBe(false);
    expect(restartBtn.classList.contains('hidden')).toBe(false);
    expect(nextLevelBtn.classList.contains('hidden')).toBe(true);
  });
});