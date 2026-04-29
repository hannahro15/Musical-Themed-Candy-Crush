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

  test('handleLevelWin updates gameState and shows next level modal', () => {
    // Simulate the next level modal in the DOM
    const nextLevelModal = document.createElement('div');
    nextLevelModal.id = 'nextLevelModal';
    nextLevelModal.classList.add('modal', 'hidden');
    document.body.appendChild(nextLevelModal);

    handleLevelWin();

    expect(gameState.levelComplete).toBe(true);
    expect(gameState.timerActive).toBe(false);
    expect(nextLevelModal.classList.contains('hidden')).toBe(false);

    // Clean up
    document.body.removeChild(nextLevelModal);
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