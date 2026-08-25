// constants.test.js - Unit tests for constants.js

import { BOARD_SIZE, SYMBOLS, INITIAL_LIVES } from '../src/constants.js';

describe('constants', () => {
  test('BOARD_SIZE is a positive integer', () => {
    expect(typeof BOARD_SIZE).toBe('number');
    expect(Number.isInteger(BOARD_SIZE)).toBe(true);
    expect(BOARD_SIZE).toBeGreaterThan(0);
  });

  test('BOARD_SIZE is 7', () => {
    expect(BOARD_SIZE).toBe(7);
  });

  test('SYMBOLS is a non-empty array of strings', () => {
    expect(Array.isArray(SYMBOLS)).toBe(true);
    expect(SYMBOLS.length).toBeGreaterThan(0);
    SYMBOLS.forEach(s => expect(typeof s).toBe('string'));
  });

  test('SYMBOLS contains exactly 6 entries', () => {
    expect(SYMBOLS.length).toBe(6);
  });

  test('SYMBOLS contains all expected musical emojis', () => {
    expect(SYMBOLS).toContain('🎵');
    expect(SYMBOLS).toContain('🎹');
    expect(SYMBOLS).toContain('🎻');
    expect(SYMBOLS).toContain('🎷');
    expect(SYMBOLS).toContain('🎺');
    expect(SYMBOLS).toContain('🥁');
  });

  test('SYMBOLS has no duplicate entries', () => {
    const unique = new Set(SYMBOLS);
    expect(unique.size).toBe(SYMBOLS.length);
  });

  test('INITIAL_LIVES is a positive integer', () => {
    expect(typeof INITIAL_LIVES).toBe('number');
    expect(Number.isInteger(INITIAL_LIVES)).toBe(true);
    expect(INITIAL_LIVES).toBeGreaterThan(0);
  });

  test('INITIAL_LIVES is 5', () => {
    expect(INITIAL_LIVES).toBe(5);
  });
});
