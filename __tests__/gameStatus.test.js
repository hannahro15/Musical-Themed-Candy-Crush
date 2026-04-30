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

  test('HandleLevelWin does nothing if the modal is missing from the DOM', () => {
    // Ensure the modal is not in the DOM
    const existingModal = document.getElementById('nextLevelModal');
    if (existingModal) {
      document.body.removeChild(existingModal);
    }

    // Call handleLevelWin and ensure no errors are thrown
    expect(() => handleLevelWin()).not.toThrow();
  });
  
  test("lives do not go below 0 if gamrState.lives is already 0", () => {
    gameState.lives = 0; // Set lives to 0 before calling handleLevelLose

    const restartContainer = document.createElement('div');
    const restartBtn = document.createElement('button');
    const nextLevelBtn = document.createElement('button');
    restartContainer.classList.add('hidden');
    restartBtn.classList.add('hidden');
    nextLevelBtn.classList.remove('hidden');

    handleLevelLose(restartContainer, restartBtn, nextLevelBtn);

    expect(gameState.lives).toBe(0); // Lives should not go below 0
  });

  test('livesDisplay is updated if present in the DOM when handleLevelLose is called', () => {
    gameState.lives = 2; // Set lives to 2 before calling handleLevelLose

    const livesDisplay = document.createElement('div');
    livesDisplay.id = 'livesDisplay';
    document.body.appendChild(livesDisplay);

    const restartContainer = document.createElement('div');
    const restartBtn = document.createElement('button');
    const nextLevelBtn = document.createElement('button');
    restartContainer.classList.add('hidden');
    restartBtn.classList.add('hidden');
    nextLevelBtn.classList.remove('hidden');

    handleLevelLose(restartContainer, restartBtn, nextLevelBtn);

    expect(livesDisplay.textContent).toBe(`❤️ Lives: ${gameState.lives}`);

    // Clean up
    document.body.removeChild(livesDisplay);
  });

  test('should not throw if nextLevelModal is not in the DOM', () => {
    // Ensure the modal is not in the DOM
    const existingModal = document.getElementById('nextLevelModal');
    if (existingModal) {
      document.body.removeChild(existingModal);
    }

    // Call handleLevelWin and ensure no errors are thrown
    expect(() => handleLevelWin()).not.toThrow();
  });
});