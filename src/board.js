// Board and match logic
import { swapCellContents } from './game.js';

export function getCellGrid(gameBoard, BOARD_SIZE) {
  const allCells = Array.from(gameBoard.children);
  const grid = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    grid.push(allCells.slice(row * BOARD_SIZE, (row + 1) * BOARD_SIZE));
  }
  return grid;
}

export function findMatches(gameBoard, BOARD_SIZE) {
  const grid = getCellGrid(gameBoard, BOARD_SIZE);
  const matchedGroups = [];
  const visited = new Set();
  function scanLineForMatches(line) {
    let startIndex = 0;
    while (startIndex <= line.length - 3) {
      const symbol = line[startIndex].textContent;
      if (!symbol) { startIndex++; continue; }
      let endIndex = startIndex + 1;
      while (endIndex < line.length && line[endIndex].textContent === symbol) endIndex++;
      if (endIndex - startIndex >= 3) {
        const group = [];
        for (let i = startIndex; i < endIndex; i++) {
          if (!visited.has(line[i])) {
            group.push(line[i]);
            visited.add(line[i]);
          }
        }
        if (group.length > 0) matchedGroups.push(group);
      }
      startIndex = endIndex;
    }
  }
  for (let row = 0; row < BOARD_SIZE; row++) scanLineForMatches(grid[row]);
  for (let col = 0; col < BOARD_SIZE; col++) scanLineForMatches(grid.map(row => row[col]));
  return matchedGroups;
}

export function getSafeSymbol(grid, row, col, SYMBOLS) {
  const forbiddenSymbols = new Set();
  if (col >= 2 && grid[row][col - 1] === grid[row][col - 2]) forbiddenSymbols.add(grid[row][col - 1]);
  if (row >= 2 && grid[row - 1][col] === grid[row - 2][col]) forbiddenSymbols.add(grid[row - 1][col]);
  const availableSymbols = SYMBOLS.filter(symbol => !forbiddenSymbols.has(symbol));
  return availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
}

export function generateGameBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol, hasPossibleMoves, wireUpCellEvents) {
  let attempts = 0;
  let hasMove = false;
  do {
    gameBoard.innerHTML = '';
    const grid = Array.from({ length: BOARD_SIZE }, () => []);
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const symbol = getSafeSymbol(grid, row, col, SYMBOLS);
        grid[row][col] = symbol;
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = symbol;
        cell.draggable = true;
        gameBoard.appendChild(cell);
      }
    }
    // Check for at least one possible move
    hasMove = hasPossibleMoves(gameBoard, BOARD_SIZE);
    attempts++;
  } while (!hasMove && attempts < 20);
  // Always re-attach listeners after board generation
  if (typeof wireUpCellEvents === 'function') {
    wireUpCellEvents();
  }
}

export function hasPossibleMoves(gameBoard, BOARD_SIZE) {
  const allCells = Array.from(gameBoard.children);
  for (let i = 0; i < allCells.length; i++) {
    const cell = allCells[i];
    const row = Math.floor(i / BOARD_SIZE);
    const col = i % BOARD_SIZE;
    // Try swapping with right neighbor
    if (col < BOARD_SIZE - 1) {
      swapCellContents(cell, allCells[i + 1]);
      if (findMatches(gameBoard, BOARD_SIZE).length > 0) {
        swapCellContents(cell, allCells[i + 1]);
        return true;
      }
      swapCellContents(cell, allCells[i + 1]);
    }
    // Try swapping with bottom neighbor
    if (row < BOARD_SIZE - 1) {
      swapCellContents(cell, allCells[i + BOARD_SIZE]);
      if (findMatches(gameBoard, BOARD_SIZE).length > 0) {
        swapCellContents(cell, allCells[i + BOARD_SIZE]);
        return true;
      }
      swapCellContents(cell, allCells[i + BOARD_SIZE]);
    }
  }
  return false;
}

export function reshuffleBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol, hasPossibleMoves, wireUpCellEvents) {
  let allCells = Array.from(gameBoard.children);
  let symbols = allCells.map(cell => cell.textContent).filter(Boolean);
  let attempts = 0;
  do {
    for (let i = symbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
    }
    allCells.forEach((cell, idx) => {
      cell.textContent = symbols[idx] || '';
    });
    attempts++;
    if (attempts > 20) {
      generateGameBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol, hasPossibleMoves, wireUpCellEvents);
      break;
    }
  } while (!hasPossibleMoves(gameBoard, BOARD_SIZE));
  if (typeof wireUpCellEvents === 'function') {
    wireUpCellEvents();
  }
}

export function dropAndRefill(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol) {
  const grid = [];
  const allCells = Array.from(gameBoard.children);
  for (let row = 0; row < BOARD_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      grid[row][col] = allCells[row * BOARD_SIZE + col];
    }
  }
  for (let col = 0; col < BOARD_SIZE; col++) {
    let emptySpots = 0;
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (!grid[row][col].textContent) {
        emptySpots++;
      } else if (emptySpots > 0) {
        grid[row + emptySpots][col].textContent = grid[row][col].textContent;
        grid[row][col].textContent = '';
      }
    }
    for (let row = 0; row < emptySpots; row++) {
      grid[row][col].textContent = getSafeSymbol(
        grid.map(r => r.map(c => c.textContent)),
        row,
        col,
        SYMBOLS
      );
    }
  }
}

// Deprecated: use swapCellContents from game.js
// function swapCellContents(cellA, cellB) {
//   const temp = cellA.textContent;
//   cellA.textContent = cellB.textContent;
//   cellB.textContent = temp;
// }

