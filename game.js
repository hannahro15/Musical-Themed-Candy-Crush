// Core game logic functions
export function swapCellContents(cellA, cellB) {
  [cellA.textContent, cellB.textContent] = [cellB.textContent, cellA.textContent];
}

export function areAdjacent(cellA, cellB, gameBoard, BOARD_SIZE) {
  const allCells = [...gameBoard.children];
  const [indexA, indexB] = [allCells.indexOf(cellA), allCells.indexOf(cellB)];
  const indexDiff = Math.abs(indexA - indexB);
  const sameRow = Math.floor(indexA / BOARD_SIZE) === Math.floor(indexB / BOARD_SIZE);
  return indexDiff === BOARD_SIZE || (indexDiff === 1 && sameRow);
}

export function getRandomSymbol(SYMBOLS) {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export function scoreForMatch(matchSize) {
  if (matchSize === 3) return 10;
  if (matchSize === 4) return 20;
  if (matchSize === 5) return 40;
  if (matchSize > 5) return 60;
  return 0;
}
