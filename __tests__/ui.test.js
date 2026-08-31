// ui.test.js - Unit tests for ui.js
// Add your tests here

import { updateScore, updateLevel, updateTimer, showGameOver, hideGameOver, updateObjectiveCounters, updateMovesDisplay, updateLivesDisplay, updateScoreDisplay, updateTimerDisplay, showMenuPage, updateHighScoreDisplay, updateTotalScoreDisplay } from '../src/ui.js';

describe('UI functions', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="score">0</div>
      <div id="level">1</div>
      <div id="timer">60</div>
      <div id="game-over" class="hidden">Game Over</div>
      <div id="score-moves-wrapper"></div>
      <div id="levelDisplay"></div>
    `;
  });

  test('updateScore updates #score element text', () => {
    document.body.innerHTML = '<div id="score"></div>';
    updateScore(123);
    expect(document.getElementById('score').textContent).toBe('123');
  });

  test('updateScore does nothing if #score element missing', () => {
    document.body.innerHTML = '';
    expect(() => updateScore(123)).not.toThrow();
  });

  test('updateLevel updates #level element text', () => {
    document.body.innerHTML = '<div id="level"></div>';
    updateLevel(5);
    expect(document.getElementById('level').textContent).toBe('5');
  });

  test('updateLevel does nothing if #level element missing', () => {
    document.body.innerHTML = '';
    expect(() => updateLevel(5)).not.toThrow();
  });

  test('updateTimer updates #timer element text', () => {
    document.body.innerHTML = '<div id="timer"></div>';
    updateTimer(42);
    expect(document.getElementById('timer').textContent).toBe('42');
  });

  test('updateTimer does nothing if #timer element missing', () => {
    document.body.innerHTML = '';
    expect(() => updateTimer(42)).not.toThrow();
  });

  test('showGameOver removes hidden from #game-over', () => {
    showGameOver();
    expect(document.getElementById('game-over').classList.contains('hidden')).toBe(false);
  });

  test('showGameOver does nothing if #game-over missing', () => {
    document.body.innerHTML = '';
    expect(() => showGameOver()).not.toThrow();
  });

  test('hideGameOver adds hidden to #game-over', () => {
    document.body.innerHTML = '<div id="game-over"></div>';
    hideGameOver();
    expect(document.getElementById('game-over').classList.contains('hidden')).toBe(true);
  });

  test('hideGameOver does nothing if #game-over missing', () => {
    document.body.innerHTML = '';
    expect(() => hideGameOver()).not.toThrow();
  });

  test('updateObjectiveCounters handles null container gracefully', () => {
    expect(() => updateObjectiveCounters(null, [{ label: 'a', symbol: 'A', count: 1 }], { aLeft: 1 })).not.toThrow();
  });

  test('updateObjectiveCounters renders correct spans and values', () => {
    const container = document.createElement('div');
    const objectives = [
      { label: 'red', symbol: '🔴', count: 5 },
      { label: 'blue', symbol: '🔵', count: 3 }
    ];
    const state = { redLeft: 2, blueLeft: 1 };
    updateObjectiveCounters(container, objectives, state);
    expect(container.children.length).toBe(2);
    expect(container.children[0].textContent).toBe('🔴: 2');
    expect(container.children[1].textContent).toBe('🔵: 1');
  });

  test('updateObjectiveCounters uses obj.count as fallback if state key missing', () => {
    const container = document.createElement('div');
    const objectives = [
      { label: 'red', symbol: '🔴', count: 5 },
      { label: 'blue', symbol: '🔵', count: 3 }
    ];
    const state = { redLeft: undefined };
    updateObjectiveCounters(container, objectives, state);
    expect(container.children[0].textContent).toBe('🔴: 5'); // fallback to count
    expect(container.children[1].textContent).toBe('🔵: 3'); // fallback to count
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
  
  test('showMenuPage shows menu elements and hides game elements', () => {
    document.body.innerHTML = `
      <div id="game-board-container"></div>
      <div id="score-moves-wrapper"></div>
      <div id="levelDisplay"></div>
      <div id="totalScoreDisplay"></div>
    `;

    const heading = document.createElement('h1');
    const subtitle = document.createElement('h2');
    const menu = document.createElement('div');
    const gameBoard = document.createElement('div');
    const movesDisplay = document.createElement('div');
    const scoreDisplay = document.createElement('div');
    const timerDisplay = document.createElement('div');
    const livesDisplay = document.createElement('div');
    const restartContainer = document.createElement('div');

    [heading, subtitle, menu, gameBoard, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer].forEach(el => {
      el.classList.add('hidden');
    });

    showMenuPage(
      heading,
      subtitle,
      menu,
      gameBoard,
      movesDisplay,
      scoreDisplay,
      timerDisplay,
      livesDisplay,
      restartContainer
    );

    expect(heading.classList.contains('hidden')).toBe(false);
    expect(subtitle.classList.contains('hidden')).toBe(false);
    expect(menu.classList.contains('hidden')).toBe(false);
    expect(gameBoard.classList.contains('hidden')).toBe(true);
    expect(movesDisplay.classList.contains('hidden')).toBe(true);
    expect(scoreDisplay.classList.contains('hidden')).toBe(true);
    expect(timerDisplay.classList.contains('hidden')).toBe(true);
    expect(livesDisplay.classList.contains('hidden')).toBe(true);
    expect(restartContainer.classList.contains('hidden')).toBe(true);
    expect(document.getElementById('game-board-container').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('score-moves-wrapper').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('levelDisplay').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('totalScoreDisplay').classList.contains('hidden')).toBe(true);
  });

  test('timer warning class is toggled correctly based on timer value', () => {
    const timerDisplay = document.createElement('div');
    updateTimerDisplay(timerDisplay, 15);
    expect(timerDisplay.classList.contains('low-time')).toBe(false);
    updateTimerDisplay(timerDisplay, 10);
    expect(timerDisplay.classList.contains('low-time')).toBe(true);
    updateTimerDisplay(timerDisplay, 5);
    expect(timerDisplay.classList.contains('low-time')).toBe(true);
    updateTimerDisplay(timerDisplay, 0);
    expect(timerDisplay.classList.contains('low-time')).toBe(false); // No warning at 0
  });

  test('updateHighScoreDisplay updates the high score display text and shows it', () => {
    const highScoreDisplay = document.createElement('div');
    highScoreDisplay.classList.add('hidden');
    updateHighScoreDisplay(highScoreDisplay, 200);
    expect(highScoreDisplay.textContent).toBe('Best Score: 200');
    expect(highScoreDisplay.classList.contains('hidden')).toBe(false);
  });

  test('updateTotalScoreDisplay updates the total score display text correctly', () => {
    const totalScoreDisplay = document.createElement('div');
    updateTotalScoreDisplay(totalScoreDisplay, 500);
    expect(totalScoreDisplay.textContent).toBe('Total Score: 500');
  });
});