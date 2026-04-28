// ui.test.js - Unit tests for ui.js
// Add your tests here

import { updateScore, updateLevel, updateTimer, showGameOver, hideGameOver, updateObjectiveCounters, updateMovesDisplay, updateLivesDisplay, updateScoreDisplay, updateTimerDisplay, showMenuPage } from '../src/ui.js';

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

  test('updateObjectiveCounters renders the correct number of counters', () => {
    const objectiveCountersContainer = document.createElement('div'); 
    const objectives = [
      { label: 'collectRed', symbol: '🔴', count: 5 },
      { label: 'collectBlue', symbol: '🔵', count: 3 }
    ];
    const state = {
      collectRedLeft: 2,
      collectBlueLeft: 1
    };

    // Call the function to update objective counters
    updateObjectiveCounters(objectiveCountersContainer, objectives, state);

    // Check if the correct number of counters are rendered
    expect(objectiveCountersContainer.children.length).toBe(2);
    expect(objectiveCountersContainer.children[0].textContent).toBe('🔴: 2');
    expect(objectiveCountersContainer.children[1].textContent).toBe('🔵: 1');
  });

  test('updateLivesDisplay updates the lives display text with the correct value', () => {
    const livesDisplay = document.createElement('div');
    updateLivesDisplay(livesDisplay, 3);
    expect(livesDisplay.textContent).toBe('❤️ Lives: 3');
  });
  
  test('updateMovesDisplay updates the moves display element correctly', () => {
    const movesDisplay = document.createElement('div');
    updateMovesDisplay(movesDisplay, 10);
    expect(movesDisplay.textContent).toBe('Moves: 10');
  });

  test('updateScoreDisplay updates the score display element correctly', () => {
    const scoreDisplay = document.createElement('div');
    updateScoreDisplay(scoreDisplay, 150);
    expect(scoreDisplay.textContent).toBe('Score: 150');
  });

  test('updateTimerDisplay updates the timer display element correctly', () => {
    const timerDisplay = document.createElement('div');
    updateTimerDisplay(timerDisplay, 30);
    expect(timerDisplay.textContent).toBe('Time: 30s');
  });
  
  test('showMenuPage are hidden/shown as expected for initial states', () => {
      const movesDisplay = document.createElement('div');
      const scoreDisplay = document.createElement('div');
      const timerDisplay = document.createElement('div');
      const livesDisplay = document.createElement('div');
      const restartContainer = document.createElement('div');
      document.body.appendChild(movesDisplay);
      document.body.appendChild(scoreDisplay);
      document.body.appendChild(timerDisplay);
      document.body.appendChild(livesDisplay);
      document.body.appendChild(restartContainer);

      document.body.innerHTML = `
  <div id="game-board-container"></div>
  <div id="score-moves-wrapper"></div>
  <div id="levelDisplay"></div>
`;

      showMenuPage(movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer);

      expect(document.getElementById('score-moves-wrapper').classList.contains('hidden')).toBe(true);
      expect(movesDisplay.classList.contains('hidden')).toBe(true);
      expect(scoreDisplay.classList.contains('hidden')).toBe(true);
      expect(timerDisplay.classList.contains('hidden')).toBe(true);
      expect(document.getElementById('levelDisplay').classList.contains('hidden')).toBe(true);
      expect(livesDisplay.classList.contains('hidden')).toBe(true);
      expect(restartContainer.classList.contains('hidden')).toBe(true);
  });
});