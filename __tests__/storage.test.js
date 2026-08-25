// add tests to storage.js

import {
  getHighScore,
  saveHighScore,
  getHighestLevel,
  saveHighestLevel,
  clearStorage,
  saveGameProgress,
  loadGameProgress,
  clearGameProgress,
  getLeaderboard,
  addLeaderboardEntry
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
});

describe('saveGameProgress and loadGameProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saveGameProgress stores progress and returns true', () => {
    const state = {
      level: 3,
      lives: 2,
      score: 500,
      totalScore: 1200,
      movesLeft: 8,
      timer: 45,
      violinLeft: 2,
      pianoLeft: 0
    };
    const board = [['🎻', '🎹'], ['🎺', '🥁']];
    expect(saveGameProgress(state, board)).toBe(true);
  });

  test('loadGameProgress returns null when nothing saved', () => {
    expect(loadGameProgress()).toBeNull();
  });

  test('saveGameProgress then loadGameProgress round-trips level and lives', () => {
    const state = {
      level: 5,
      lives: 3,
      score: 800,
      totalScore: 2000,
      movesLeft: 12,
      timer: 50,
      trumpetLeft: 3
    };
    saveGameProgress(state, []);
    const loaded = loadGameProgress();
    expect(loaded.level).toBe(5);
    expect(loaded.lives).toBe(3);
    expect(loaded.score).toBe(800);
    expect(loaded.movesLeft).toBe(12);
    expect(loaded.boardState).toEqual([]);
  });

  test('saveGameProgress stores objective counters', () => {
    const state = {
      level: 2,
      lives: 4,
      score: 300,
      totalScore: 600,
      movesLeft: 10,
      timer: 60,
      violinLeft: 2,
      saxophoneLeft: 5
    };
    saveGameProgress(state, []);
    const loaded = loadGameProgress();
    expect(loaded.objectives.violinLeft).toBe(2);
    expect(loaded.objectives.saxophoneLeft).toBe(5);
  });

  test('saveGameProgress preserves existing highScore', () => {
    saveHighScore(999);
    const state = { level: 1, lives: 5, score: 0, totalScore: 0, movesLeft: 15, timer: 75 };
    saveGameProgress(state, []);
    expect(getHighScore()).toBe(999);
  });

  test('loadGameProgress handles invalid JSON gracefully', () => {
    localStorage.setItem('musicalMatchSaga', 'not-json');
    expect(loadGameProgress()).toBeNull();
  });
});

describe('clearGameProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('clearGameProgress removes savedProgress and returns true', () => {
    const state = { level: 2, lives: 3, score: 100, totalScore: 200, movesLeft: 5, timer: 30 };
    saveGameProgress(state, []);
    expect(clearGameProgress()).toBe(true);
    expect(loadGameProgress()).toBeNull();
  });

  test('clearGameProgress returns false when nothing to clear', () => {
    expect(clearGameProgress()).toBe(false);
  });

  test('clearGameProgress preserves highScore', () => {
    saveHighScore(500);
    const state = { level: 2, lives: 3, score: 100, totalScore: 200, movesLeft: 5, timer: 30 };
    saveGameProgress(state, []);
    clearGameProgress();
    expect(getHighScore()).toBe(500);
  });
});

describe('clearStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('clearStorage removes musicalMatchSaga key', () => {
    saveHighScore(100);
    clearStorage();
    expect(localStorage.getItem('musicalMatchSaga')).toBeNull();
  });

  test('clearStorage does not throw when key is absent', () => {
    expect(() => clearStorage()).not.toThrow();
  });

  test('getHighScore returns 0 after clearStorage', () => {
    saveHighScore(250);
    clearStorage();
    expect(getHighScore()).toBe(0);
  });

  test('getHighestLevel returns 0 after clearStorage', () => {
    saveHighestLevel(10);
    clearStorage();
    expect(getHighestLevel()).toBe(0);
  });
});
describe('leaderboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('getLeaderboard returns empty array when nothing saved', () => {
    expect(getLeaderboard()).toEqual([]);
  });

  test('addLeaderboardEntry saves entry and returns rank 1', () => {
    const rank = addLeaderboardEntry(500, 3);
    expect(rank).toBe(1);
    const board = getLeaderboard();
    expect(board.length).toBe(1);
    expect(board[0].score).toBe(500);
    expect(board[0].level).toBe(3);
  });

  test('addLeaderboardEntry sorts by score descending', () => {
    addLeaderboardEntry(300, 2);
    addLeaderboardEntry(700, 5);
    addLeaderboardEntry(100, 1);
    const board = getLeaderboard();
    expect(board[0].score).toBe(700);
    expect(board[1].score).toBe(300);
    expect(board[2].score).toBe(100);
  });

  test('addLeaderboardEntry returns correct rank for new entry', () => {
    addLeaderboardEntry(800, 6);
    addLeaderboardEntry(600, 4);
    const rank = addLeaderboardEntry(700, 5);
    expect(rank).toBe(2);
  });

  test('leaderboard keeps only top 10 entries', () => {
    for (let i = 1; i <= 12; i++) {
      addLeaderboardEntry(i * 100, i);
    }
    const board = getLeaderboard();
    expect(board.length).toBe(10);
    expect(board[0].score).toBe(1200);
  });

  test('addLeaderboardEntry includes a date string', () => {
    addLeaderboardEntry(200, 2);
    const board = getLeaderboard();
    expect(typeof board[0].date).toBe('string');
    expect(board[0].date.length).toBeGreaterThan(0);
  });

  test('getLeaderboard handles invalid JSON gracefully', () => {
    localStorage.setItem('musicalMatchSaga', 'bad-json');
    expect(getLeaderboard()).toEqual([]);
  });

  test('leaderboard persists highScore independently', () => {
    saveHighScore(999);
    addLeaderboardEntry(500, 3);
    expect(getHighScore()).toBe(999);
  });
});
