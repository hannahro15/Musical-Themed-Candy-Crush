// add tests to storage.js

import { getHighScore, saveHighScore, getHighestLevel, saveHighestLevel } from '../src/storage.js';

describe('storage.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('getHighScore returns 0 if no score saved', () => {
    expect(getHighScore()).toBe(0);
  });

  test('saveHighScore saves a new high score', () => {
    expect(saveHighScore(100)).toBe(true);
    expect(getHighScore()).toBe(100);
  });

  test('saveHighScore does not update if score is lower', () => {
    saveHighScore(100);
    expect(saveHighScore(50)).toBe(false);
    expect(getHighScore()).toBe(100);
  });

  test('getHighestLevel returns 0 if no level saved', () => {
    expect(getHighestLevel()).toBe(0);
  });

  test('saveHighestLevel saves a new highest level', () => {
    expect(saveHighestLevel(5)).toBe(true);
    expect(getHighestLevel()).toBe(5);
  });

  test('saveHighestLevel does not update if level is lower', () => {
    saveHighestLevel(5);
    expect(saveHighestLevel(3)).toBe(false);
    expect(getHighestLevel()).toBe(5);
  });

  test('saveHighScore updates localStorage correctly', () => {
    saveHighScore(150);
    const storedData = JSON.parse(localStorage.getItem('musicalMatchSaga'));
    expect(storedData.highScore).toBe(150);
  });

  test('saveHighestLevel updates localStorage correctly', () => {
    saveHighestLevel(10);
    const storedData = JSON.parse(localStorage.getItem('musicalMatchSaga'));
    expect(storedData.highestLevel).toBe(10);
  });    

  test('getHighScore handles invalid JSON gracefully', () => {
    localStorage.setItem('musicalMatchSaga', 'invalid json');
    expect(getHighScore()).toBe(0);
  });

  test('getHighestLevel handles invalid JSON gracefully', () => {
    localStorage.setItem('musicalMatchSaga', 'invalid json');
    expect(getHighestLevel()).toBe(0);
  });

  test('clearStorage from storage.js clears localStorage', () => {
    saveHighScore(200);
    saveHighestLevel(15);
    localStorage.clear();
    expect(getHighScore()).toBe(0);
    expect(getHighestLevel()).toBe(0);
  });

  test('savedProgress is cleared after game over', () => {
    saveHighScore(250);
    saveHighestLevel(20);
    localStorage.clear();
    expect(getHighScore()).toBe(0);
    expect(getHighestLevel()).toBe(0);
  });

  test('clearStorage removes the musicalMatchSaga key from localStorage', () => {
    saveHighScore(300);
    saveHighestLevel(25);
    localStorage.clear();
    expect(localStorage.getItem('musicalMatchSaga')).toBeNull();
  });

  test('savedGameProgress stores savedProgress and objectives correctly', () => {
    const savedProgress = {
      level: 3,
      score: 500,
      lives: 2,
      objectives: {
        collectRedLeft: 1,
        collectBlueLeft: 0
      }
    };
    localStorage.setItem('musicalMatchSaga', JSON.stringify({ savedProgress }));
    const storedData = JSON.parse(localStorage.getItem('musicalMatchSaga'));
    expect(storedData.savedProgress).toEqual(savedProgress);
  });

  test ('clearStorage clears savedProgress and objectives', () => {
    const savedProgress = {
      level: 4,
      score: 600,
      lives: 1,
      objectives: {
        collectRedLeft: 0,
        collectBlueLeft: 2
      }
    };
    localStorage.setItem('musicalMatchSaga', JSON.stringify({ savedProgress }));
    localStorage.clear();
    const storedData = JSON.parse(localStorage.getItem('musicalMatchSaga'));
    expect(storedData).toBeNull();
  });

  test('clearStorage does not throw error if localStorage is already empty', () => {
    expect(() => localStorage.clear()).not.toThrow();
  });
});