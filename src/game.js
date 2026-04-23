// Core game logic functions
export function swapCellContents(cellA, cellB) {
  [cellA.textContent, cellB.textContent] = [cellB.textContent, cellA.textContent];
}

export function areAdjacent(cellA, cellB, gameBoard, BOARD_SIZE) {
    const cells = Array.from(gameBoard.children);
    const indexA = cells.indexOf(cellA);
    const indexB = cells.indexOf(cellB);

    if (indexA === -1 || indexB === -1) return false;

    const rowA = Math.floor(indexA / BOARD_SIZE);
    const rowB = Math.floor(indexB / BOARD_SIZE);

    const adjacent = (
      Math.abs(indexA - indexB) === BOARD_SIZE ||
      (rowA === rowB && Math.abs(indexA - indexB) === 1)
    );
    return adjacent;
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
