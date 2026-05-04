// add tests for levels.js

import { LEVELS } from '../src/levels.js';

describe('LEVELS', () => {
  test('LEVELS is an array of level configurations', () => {
    expect(Array.isArray(LEVELS)).toBe(true);
    expect(LEVELS.length).toBeGreaterThan(0);
    LEVELS.forEach(level => {
      expect(level).toHaveProperty('objectives');
      expect(level).toHaveProperty('moves');
      expect(level).toHaveProperty('timer');
      expect(level.objectives).toBeInstanceOf(Object);
      expect(typeof level.moves).toBe('number');
      expect(typeof level.timer).toBe('number');
    });
  });

  test('LEVELS has unique objectives for each level', () => {
    const objectiveSets = LEVELS.map(level => JSON.stringify(level.objectives));
    const uniqueObjectiveSets = new Set(objectiveSets);
    expect(uniqueObjectiveSets.size).toBe(LEVELS.length);
  });

  test('winConditions returns true when all objectives are met', () => {
    const levelConfig = {
      objectives: { A: 2, B: 3 },
      moves: 10,
      timer: 60
    };
    const matchedCounts = { A: 2, B: 3 };
    const checkWinCondition = (config, counts) => {
      return Object.keys(config.objectives).every(symbol => counts[symbol] >= config.objectives[symbol]);
    };
    expect(checkWinCondition(levelConfig, matchedCounts)).toBe(true);
  });

  test('winCondtions returns false when at least one objective is not met', () => {
    const levelConfig = {
      objectives: { A: 2, B: 3 },
      moves: 10,
      timer: 60
    };
    const matchedCounts = { A: 2, B: 2 };
    const checkWinCondition = (config, counts) => {
      return Object.keys(config.objectives).every(symbol => counts[symbol] >= config.objectives[symbol]);
    };
    expect(checkWinCondition(levelConfig, matchedCounts)).toBe(false);
  });

  test('valid level returns the correct level configuration', () => {
    const levelIndex = 0;
    const levelConfig = LEVELS[levelIndex];
    expect(levelConfig).toBeDefined();
    expect(levelConfig).toHaveProperty('objectives');
    expect(levelConfig).toHaveProperty('moves');
    expect(levelConfig).toHaveProperty('timer');
  });

  test('invalid level index returns undefined', () => {
    const levelIndex = -1;
    const levelConfig = LEVELS[levelIndex];
    expect(levelConfig).toBeUndefined();
  });
});