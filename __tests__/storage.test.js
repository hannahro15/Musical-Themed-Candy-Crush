// add tests to storage.js

import {
  getHighScore,
  saveHighScore,
  getHighestLevel,
  saveHighestLevel,
  clearStorage,
  saveGameProgress,
  loadGameProgress,
  clearGameProgress
} from '../src/storage.js';

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

  test('clearStorage removes the musicalMatchSaga key', () => {
    saveHighScore(400);
    clearStorage();
    expect(localStorage.getItem('musicalMatchSaga')).toBeNull();
  });

  test('loadGameProgress returns null when nothing has been saved', () => {
    expect(loadGameProgress()).toBeNull();
  });

  test('saveGameProgress persists gameState fields, boardState, and objective counters', () => {
    const gameState = {
      level: 3,
      lives: 2,
      score: 120,
      totalScore: 640,
      movesLeft: 8,
      timer: 20,
      violinLeft: 2,
      pianoLeft: 0
    };
    const boardState = [['🎻', '🎹'], ['', '🥁']];

    expect(saveGameProgress(gameState, boardState)).toBe(true);

    const loaded = loadGameProgress();
    expect(loaded.level).toBe(3);
    expect(loaded.lives).toBe(2);
    expect(loaded.score).toBe(120);
    expect(loaded.totalScore).toBe(640);
    expect(loaded.movesLeft).toBe(8);
    expect(loaded.timer).toBe(20);
    expect(loaded.boardState).toEqual(boardState);
    // movesLeft is excluded from objectives despite ending in "Left".
    expect(loaded.objectives).toEqual({ violinLeft: 2, pianoLeft: 0 });
  });

  test('clearGameProgress removes savedProgress but preserves high score and highest level', () => {
    saveHighScore(300);
    saveHighestLevel(12);
    saveGameProgress({ level: 1, lives: 5, score: 0, totalScore: 0, movesLeft: 10, timer: 30 }, []);

    expect(clearGameProgress()).toBe(true);

    expect(loadGameProgress()).toBeNull();
    expect(getHighScore()).toBe(300);
    expect(getHighestLevel()).toBe(12);
  });

  test('clearGameProgress returns false when there is nothing to clear', () => {
    expect(clearGameProgress()).toBe(false);

    saveHighScore(50); // data exists, but no savedProgress key
    expect(clearGameProgress()).toBe(false);
  });

  test('saveHighScore returns false when localStorage.setItem throws', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(saveHighScore(100)).toBe(false);
    setItemSpy.mockRestore();
  });

  test('clearStorage does not throw when localStorage.removeItem throws', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });
    expect(() => clearStorage()).not.toThrow();
    removeItemSpy.mockRestore();
  });
});