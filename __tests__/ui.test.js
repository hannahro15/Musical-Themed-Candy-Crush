// ui.test.js - Unit tests for ui.js
// Add your tests here

import { updateScore, updateLevel, updateTimer, showGameOver, hideGameOver } from '../src/ui.js';

describe('UI functions', () => {
  let scoreElement;
  let levelElement;
  let timerElement;
  let gameOverElement;

  beforeEach(() => {
    // Set up DOM elements for testing
    document.body.innerHTML = `
      <div id="score">0</div>
      <div id="level">1</div>
      <div id="timer">60</div>
      <div id="game-over" class="hidden">Game Over</div>
    `;

    scoreElement = document.getElementById('score');
    levelElement = document.getElementById('level');
    timerElement = document.getElementById('timer');
    gameOverElement = document.getElementById('game-over');
  });

  test('updateScore updates the score element', () => {
    updateScore(100);
    expect(scoreElement.textContent).toBe('100');
  });

  test('updateLevel updates the level element', () => {
    updateLevel(2);
    expect(levelElement.textContent).toBe('2');
  });

  test('updateTimer updates the timer element', () => {
    updateTimer(45);
    expect(timerElement.textContent).toBe('45');
  });

  test('showGameOver displays the game over element', () => {
    showGameOver();
    expect(gameOverElement.classList.contains('hidden')).toBe(false);
  });

  test('hideGameOver hides the game over element', () => {
    hideGameOver();
    expect(gameOverElement.classList.contains('hidden')).toBe(true);
  });
});