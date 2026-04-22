// Board and match logic
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

export function generateGameBoard(gameBoard, BOARD_SIZE, SYMBOLS, getSafeSymbol) {
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
  // Defensive: always re-attach listeners after board generation
  if (typeof window !== 'undefined' && window.wireUpCellEvents) {
    window.wireUpCellEvents();
  }
}
