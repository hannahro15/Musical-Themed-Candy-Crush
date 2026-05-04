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
});