// timer.test.js - Unit tests for timer.js
// Add your tests here

import { startTimer, stopTimer } from '../src/timer.js';
import { gameState } from '../src/gameState.js';
import { jest } from '@jest/globals';
import * as ui from '../src/ui.js';


describe('timer', () => {
    test('startTimer is a function', () => {
  expect(typeof startTimer).toBe('function');
});

  test('the timer decrements every second when started', () => {
    startTimer(gameState);
    expect(gameState.timerInterval).not.toBeNull();
  });

  test('handelLevelLose is called when timer reaches 0 and no moves are left', () => {
    gameState.timer = 1;
    gameState.movesLeft = 0;
    const handleLevelLose = jest.fn();
    startTimer(gameState, handleLevelLose);
    setTimeout(() => {
      expect(handleLevelLose).toHaveBeenCalled();
    }, 1100); // Wait a bit longer than 1 second to ensure the timer has decremented
  });

  test('timer does not go below 0', () => {
    gameState.timer = 1;
    startTimer(gameState);
    setTimeout(() => {
      expect(gameState.timer).toBe(0);
    }, 1100); // Wait a bit longer than 1 second to ensure the timer has decremented
  });

  test('startTimer does not call handleLevelLose if moves are left when timer reaches 0', () => {
    gameState.timer = 1;
    gameState.movesLeft = 5;
    const handleLevelLose = jest.fn();
    startTimer(gameState, handleLevelLose);
    setTimeout(() => {
      expect(handleLevelLose).not.toHaveBeenCalled();
    }, 1100); // Wait a bit longer than 1 second to ensure the timer has decremented
  });

  test('stopTimer clears the timer interval', () => {
    startTimer(gameState);
    stopTimer(gameState);
    expect(gameState.timerInterval).toBeNull();
  });

  test('updateTimerDisplay updates the timer display element', () => {
    document.body.innerHTML = '<div id="timer"></div>';
    const timerDisplay = document.getElementById('timer');
    startTimer(gameState, timerDisplay);
    setTimeout(() => {
      expect(timerDisplay.textContent).toBe(String(gameState.timer));
    }, 1100); // Wait a bit longer than 1 second to ensure the timer has decremented
  });

  test('does not decrement timer or call updateTimerDisplay if timerActive is false', (done) => {
    const timerDisplay = {};
    const spy = jest.spyOn(ui, 'updateTimerDisplay');
    const handleLevelLose = jest.fn();
    gameState.timer = 5;
    gameState.timerActive = false;
    startTimer(gameState, timerDisplay, handleLevelLose);
    setTimeout(() => {
      expect(gameState.timer).toBe(5);
      expect(spy).not.toHaveBeenCalled();
      expect(handleLevelLose).not.toHaveBeenCalled();
      spy.mockRestore();
      done();
    }, 1100);
  });

  test('does not call handleLevelLose if levelComplete is true', (done) => {
    const timerDisplay = {};
    const handleLevelLose = jest.fn();
    gameState.timer = 1;
    gameState.movesLeft = 5;
    gameState.levelComplete = true;
    gameState.timerActive = true;
    startTimer(gameState, timerDisplay, handleLevelLose);
    setTimeout(() => {
      expect(handleLevelLose).not.toHaveBeenCalled();
      done();
    }, 1100);
  });

  test('calls updateTimerDisplay with correct arguments', (done) => {
    const timerDisplay = {};
    const spy = jest.spyOn(ui, 'updateTimerDisplay');
    gameState.timer = 2;
    gameState.timerActive = true;
    startTimer(gameState, timerDisplay);
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(timerDisplay, 1);
      spy.mockRestore();
      done();
    }, 1100);
  });

  test('does not throw if handleLevelLose is not provided', (done) => {
    const timerDisplay = {};
    gameState.timer = 1;
    gameState.movesLeft = 5;
    gameState.levelComplete = false;
    gameState.timerActive = true;
    expect(() => {
      startTimer(gameState, timerDisplay);
    }).not.toThrow();
    setTimeout(done, 1100);
  });

  test('multiple calls to startTimer clear previous interval', (done) => {
    const timerDisplay = {};
    const handleLevelLose = jest.fn();
    gameState.timer = 2;
    gameState.timerActive = true;
    startTimer(gameState, timerDisplay, handleLevelLose);
    const firstInterval = gameState.timerInterval;
    startTimer(gameState, timerDisplay, handleLevelLose);
    expect(gameState.timerInterval).not.toBe(firstInterval);
    setTimeout(done, 1100);
  });
});