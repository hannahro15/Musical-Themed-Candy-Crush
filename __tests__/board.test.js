// board.test.js - Unit tests for board.js
// Add your tests here
import { getSafeSymbol, findMatches, dropAndRefill, hasPossibleMoves, generateGameBoard } from '../src/board.js';
import { BOARD_SIZE, SYMBOLS } from '../src/constants.js';

describe('board', () => {
  test('findMatches identifies horizontal and vertical matches', () => {
    const gameBoard = document.createElement('div');
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const cell = document.createElement('div');
      cell.textContent = 'A';
      gameBoard.appendChild(cell);
    }
    const matches = findMatches(gameBoard, BOARD_SIZE);
    expect(matches.length).toBeGreaterThan(0);
  });

  test('dropAndRefill drops symbols and refills the board', () => {
    const gameBoard = document.createElement('div');
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const cell = document.createElement('div');
      cell.textContent = i < BOARD_SIZE ? 'A' : '';
      gameBoard.appendChild(cell);
    }
    dropAndRefill(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol);
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      expect(gameBoard.children[i].textContent).not.toBe('');
    }
  });

  test('hasPossibleMoves returns true when moves are available', () => {
    const gameBoard = document.createElement('div');
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const cell = document.createElement('div');
      cell.textContent = 'A';
      gameBoard.appendChild(cell);
    }
    expect(hasPossibleMoves(gameBoard, BOARD_SIZE)).toBe(true);
  });

  test('generateGameBoard creates a board with no initial matches', () => {
    const gameBoard = document.createElement('div');
    generateGameBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol, hasPossibleMoves, () => {});
    const matches = findMatches(gameBoard, BOARD_SIZE);
    expect(matches.length).toBe(0);
  });

  test ('dropAndRefill fills empty cells with new symbols', () => {
    const gameBoard = document.createElement('div');
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const cell = document.createElement('div');
      cell.textContent = i < BOARD_SIZE ? 'A' : '';
      gameBoard.appendChild(cell);
    }
    dropAndRefill(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol);
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      expect(gameBoard.children[i].textContent).not.toBe('');
    }
  });

  test ('hasPossibleMoves returns false when no moves are available', () => {
    const gameBoard = document.createElement('div');
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const cell = document.createElement('div');
      cell.textContent = 'A';
      gameBoard.appendChild(cell);
    }
    // Manually create a board with no possible moves
    // Fill the board in a checkerboard pattern to avoid any possible matches or moves
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const idx = row * BOARD_SIZE + col;
        // Alternate symbols so no two adjacent are the same
        gameBoard.children[idx].textContent = SYMBOLS[(row + col) % SYMBOLS.length];
      }
    }
    expect(hasPossibleMoves(gameBoard, BOARD_SIZE)).toBe(false);
  }); 

});
