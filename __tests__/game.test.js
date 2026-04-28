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

  test('scoreForMatch returns correct score based on match size', () => {   
    expect(scoreForMatch(3)).toBe(10);
    expect(scoreForMatch(4)).toBe(20);
    expect(scoreForMatch(5)).toBe(40);
    expect(scoreForMatch(6)).toBe(60);
    expect(scoreForMatch(2)).toBe(0);
    expect(scoreForMatch(0)).toBe(0);
  });

  test('swapCellContents swaps values correctly', () => {
    const cell1 = document.createElement('div');
    const cell2 = document.createElement('div');
    cell1.textContent = 'X';
    cell2.textContent = 'Y';

    swapCellContents(cell1, cell2);

    expect(cell1.textContent).toBe('Y');
    expect(cell2.textContent).toBe('X');
  });
});

