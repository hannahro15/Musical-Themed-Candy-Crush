// game.test.js - Unit tests for game.js
// Add your tests here

import { swapCellContents, scoreForMatch, areAdjacent } from '../src/game.js';  

describe('game', () => {
  test('swapCellContents correctly swaps text content of two cells', () => {
    const cellA = document.createElement('div');
    const cellB = document.createElement('div');
    cellA.textContent = 'A';
    cellB.textContent = 'B';

    swapCellContents(cellA, cellB);

    expect(cellA.textContent).toBe('B');
    expect(cellB.textContent).toBe('A');
  });

  test('areAdjacent returns true for adjacent cells', () => {
    const cellA = { row: 0, col: 0 };
    const cellB = { row: 0, col: 1 };
    const cellC = { row: 1, col: 0 };
    const cellD = { row: 1, col: 1 };

    const gameBoard = {
      children: [cellA, cellB, cellC, cellD]
    };
    const BOARD_SIZE = 2;

    expect(areAdjacent(cellA, cellB, gameBoard, BOARD_SIZE)).toBe(true);
    expect(areAdjacent(cellA, cellC, gameBoard, BOARD_SIZE)).toBe(true);
    expect(areAdjacent(cellB, cellD, gameBoard, BOARD_SIZE)).toBe(true);
    expect(areAdjacent(cellC, cellD, gameBoard, BOARD_SIZE)).toBe(true);
  });

  test('areAdjacent returns false for non-adjacent cells', () => {
    const cellA = { row: 0, col: 0 };
    const cellB = { row: 0, col: 1 };
    const cellC = { row: 1, col: 0 };
    const cellD = { row: 1, col: 1 };

    const gameBoard = {
      children: [cellA, cellB, cellC, cellD]
    };
    const BOARD_SIZE = 2;

    expect(areAdjacent(cellA, cellD, gameBoard, BOARD_SIZE)).toBe(false);
    expect(areAdjacent(cellB, cellC, gameBoard, BOARD_SIZE)).toBe(false);
  });
});