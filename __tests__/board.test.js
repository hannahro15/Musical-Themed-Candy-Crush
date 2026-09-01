// board.test.js - Unit tests for board.js
// Add your tests here
import { getSafeSymbol, findMatches, dropAndRefill, hasPossibleMoves, generateGameBoard, updateCellClass, reshuffleBoard } from '../src/board.js';
import { BOARD_SIZE, SYMBOLS, SYMBOL_TO_CLASS } from '../src/constants.js';

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

  test('board rendering and cell classes are correct after generateGameBoard', () => {
    const gameBoard = document.createElement('div');
    generateGameBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol, hasPossibleMoves, () => {});
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const cell = gameBoard.children[i];
      expect(SYMBOLS).toContain(cell.textContent);
      // Check that the correct class is applied based on the symbol
      const symbolClassMap = {
        '🎻': 'cell-violin',
        '🎹': 'cell-piano',
        '🎺': 'cell-trumpet',
        '🥁': 'cell-drum',
        '🎷': 'cell-saxophone',
        '🎵': 'cell-musicalnote'
      };
      const expectedClass = symbolClassMap[cell.textContent];
      if (expectedClass) {
        expect(cell.classList.contains(expectedClass)).toBe(true);
      }
    }
  });

  test('cells have correct aria labels for accessibility', () => {
    const gameBoard = document.createElement('div');    
    generateGameBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol, hasPossibleMoves, () => {});
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const idx = row * BOARD_SIZE + col;
        const cell = gameBoard.children[idx];
        const expectedLabel = `Game tile: ${cell.textContent}, row ${row + 1}, column ${col + 1}`;
        expect(cell.getAttribute('aria-label')).toBe(expectedLabel);
      }
    }
  });
});

describe('updateCellClass', () => {
  test('adds the matching symbol class', () => {
    const cell = document.createElement('div');
    cell.textContent = '🎻';
    updateCellClass(cell);
    expect(cell.classList.contains(SYMBOL_TO_CLASS['🎻'])).toBe(true);
  });

  test('removes a stale symbol class before applying the new one', () => {
    const cell = document.createElement('div');
    cell.classList.add(SYMBOL_TO_CLASS['🎻']);
    cell.textContent = '🥁';
    updateCellClass(cell);
    expect(cell.classList.contains(SYMBOL_TO_CLASS['🎻'])).toBe(false);
    expect(cell.classList.contains(SYMBOL_TO_CLASS['🥁'])).toBe(true);
  });

  test('leaves no symbol class for an empty cell', () => {
    const cell = document.createElement('div');
    cell.classList.add(SYMBOL_TO_CLASS['🎷']);
    cell.textContent = '';
    updateCellClass(cell);
    expect(Object.values(SYMBOL_TO_CLASS).some(cls => cell.classList.contains(cls))).toBe(false);
  });
});

describe('reshuffleBoard', () => {
  function buildBoard(symbols) {
    const gameBoard = document.createElement('div');
    symbols.forEach(symbol => {
      const cell = document.createElement('div');
      cell.textContent = symbol;
      gameBoard.appendChild(cell);
    });
    return gameBoard;
  }

  test('shuffles the existing symbols in place once a possible move exists', () => {
    const symbols = ['A', 'B', 'C', 'D', 'E', 'F'];
    const gameBoard = buildBoard(symbols);
    const wireUpCellEvents = jest.fn();
    const alwaysHasMoves = jest.fn(() => true);

    reshuffleBoard(gameBoard, 2, SYMBOLS, getSafeSymbol, alwaysHasMoves, wireUpCellEvents);

    // Same multiset of symbols, just reordered - not regenerated.
    const after = Array.from(gameBoard.children).map(c => c.textContent);
    expect(after.slice().sort()).toEqual(symbols.slice().sort());
    expect(wireUpCellEvents).toHaveBeenCalledTimes(1);
    expect(alwaysHasMoves).toHaveBeenCalledTimes(1);
  });

  test('falls back to generating a fresh board after 20 failed shuffle attempts', () => {
    const gameBoard = buildBoard(['A', 'B', 'C', 'D']);
    const neverHasMoves = jest.fn(() => false);

    reshuffleBoard(gameBoard, 2, SYMBOLS, getSafeSymbol, neverHasMoves, () => {});

    // generateGameBoard replaces the board with a fresh 2x2 grid drawn from
    // SYMBOLS, not the original placeholder letters - proof the fallback ran.
    expect(gameBoard.children.length).toBe(4);
    Array.from(gameBoard.children).forEach(cell => {
      expect(SYMBOLS).toContain(cell.textContent);
    });
  });

  test('does not throw when no wireUpCellEvents callback is provided', () => {
    const gameBoard = buildBoard(['A', 'B', 'C', 'D']);
    expect(() => {
      reshuffleBoard(gameBoard, 2, SYMBOLS, getSafeSymbol, () => true, undefined);
    }).not.toThrow();
  });
});
