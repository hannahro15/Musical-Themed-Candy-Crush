// timer.test.js - Unit tests for timer.js
// Add your tests here

import { startTimer, stopTimer } from '../src/timer.js';
import { gameState } from '../src/gameState.js';


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
});