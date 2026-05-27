// add tests for levels.js

import { LEVELS, getLevelConfig } from '../src/levels.js';

describe('LEVELS', () => {

  test('LEVELS is an array of level configurations', () => {
    expect(Array.isArray(LEVELS)).toBe(true);
    expect(LEVELS.length).toBeGreaterThan(0);
    LEVELS.forEach(level => {
      expect(level).toHaveProperty('objectives');
      expect(level).toHaveProperty('moves');
      expect(level).toHaveProperty('timer');
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

  test('winConditions returns false when at least one objective is not met', () => {
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

  test('winCondition function works correctly for a sample level', () => {
    const levelConfig = {
      objectives: [
        { symbol: 'A', label: 'red', count: 2 },
        { symbol: 'B', label: 'blue', count: 3 }
      ],
      moves: 10,
      timer: 60,
      winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0)
    };
    const gameState = {
      objectives: levelConfig.objectives,
      redLeft: 0,
      blueLeft: 0
    };
    expect(levelConfig.winCondition(gameState)).toBe(true);
    gameState.redLeft = 1;
    expect(levelConfig.winCondition(gameState)).toBe(false);
    gameState.redLeft = 0;
    gameState.blueLeft = 1;
    expect(levelConfig.winCondition(gameState)).toBe(false);
  });

  test('distractors are defined for each level', () => {
    LEVELS.forEach(level => {
      expect(level).toHaveProperty('distractors');
      expect(Array.isArray(level.distractors)).toBe(true);
    });
  });

  test('distractors do not overlap with objectives', () => {
    LEVELS.forEach(level => {
      const objectiveSymbols = level.objectives.map(obj => obj.symbol);
      level.distractors.forEach(distractor => {
        expect(objectiveSymbols).not.toContain(distractor);
      });
    });
  });

  test('objectives have valid symbols and counts', () => {
    LEVELS.forEach(level => {
      level.objectives.forEach(obj => {
        expect(typeof obj.symbol).toBe('string');
        expect(typeof obj.label).toBe('string');
        expect(typeof obj.count).toBe('number');
        expect(obj.count).toBeGreaterThan(0);
      });
    });
  });

  test('getLevelConfig returns correct config for valid level index', () => {
    const levelNum = 1;
    const config = getLevelConfig(levelNum);
    expect(config).toBe(LEVELS[levelNum - 1]);
  });

  test('getLevelConfig returns undefined for invalid level index', () => {
    const levelNum = 999;
    const config = getLevelConfig(levelNum);
    expect(config).toBeUndefined();
  });
});