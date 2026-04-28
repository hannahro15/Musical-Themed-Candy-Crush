// timer.test.js - Unit tests for timer.js
// Add your tests here

import { startTimer, stopTimer } from '../src/timer.js';
import { gameState } from '../src/gameState.js';
import { jest } from '@jest/globals';
import * as ui from '../src/ui.js';


describe('timer', () => {
  afterEach(() => {
    stopTimer(gameState);
    gameState.timerActive = true;
    gameState.levelComplete = false;
    gameState.movesLeft = 0;
    gameState.timer = 0;
  });

  test('startTimer is a function', () => {
    expect(typeof startTimer).toBe('function');
  });

  test('the timer decrements every second when started', (done) => {
    gameState.timer = 2;
    startTimer(gameState, undefined, () => {});
    setTimeout(() => {
      expect(gameState.timer).toBe(1);
      done();
    }, 1100);
  });

  test('handelLevelLose is called when timer reaches 0 and moves are left', (done) => {
    gameState.timer = 1;
    gameState.movesLeft = 1;
    const handleLevelLose = jest.fn();
    startTimer(gameState, undefined, handleLevelLose);
    setTimeout(() => {
      expect(handleLevelLose).toHaveBeenCalled();
      done();
    }, 1100);
  });

  test('timer does not go below 0', (done) => {
    gameState.timer = 1;
    startTimer(gameState, undefined, () => {});
    setTimeout(() => {
      expect(gameState.timer).toBe(0);
      done();
    }, 1100);
  });

  test('startTimer does not call handleLevelLose if moves are left when timer reaches 0', (done) => {
    gameState.timer = 1;
    gameState.movesLeft = 5;
    const handleLevelLose = jest.fn();
    startTimer(gameState, undefined, handleLevelLose);
    setTimeout(() => {
      expect(handleLevelLose).not.toHaveBeenCalled();
      done();
    }, 1100);
  });

  test('stopTimer clears the timer interval', () => {
    gameState.timer = 2;
    startTimer(gameState, undefined, () => {});
    stopTimer(gameState);
    expect(gameState.timerInterval).toBeNull();
  });

  test('updateTimerDisplay updates the timer display element', (done) => {
    document.body.innerHTML = '<div id="timer"></div>';
    const timerDisplay = document.getElementById('timer');
    gameState.timer = 2;
    startTimer(gameState, timerDisplay, () => {});
    setTimeout(() => {
      expect(timerDisplay.textContent).toBe(String(gameState.timer));
      done();
    }, 1100);
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
    startTimer(gameState, timerDisplay, () => {});
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