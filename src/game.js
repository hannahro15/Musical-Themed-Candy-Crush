// Core game logic functions
export function swapCellContents(cellA, cellB) {
  console.log('[swapCellContents] Swapping', cellA, cellB, 'values:', cellA.textContent, cellB.textContent);
  [cellA.textContent, cellB.textContent] = [cellB.textContent, cellA.textContent];
  console.log('[swapCellContents] After swap:', cellA.textContent, cellB.textContent);
}

export function areAdjacent(cellA, cellB, gameBoard, BOARD_SIZE) {
    const cells = Array.from(gameBoard.children);
    const indexA = cells.indexOf(cellA);
    const indexB = cells.indexOf(cellB);

    console.log('[areAdjacent] indexA:', indexA, 'indexB:', indexB);
    if (indexA === -1 || indexB === -1) return false;

    const rowA = Math.floor(indexA / BOARD_SIZE);
    const rowB = Math.floor(indexB / BOARD_SIZE);

    const adjacent = (
      Math.abs(indexA - indexB) === BOARD_SIZE ||
      (rowA === rowB && Math.abs(indexA - indexB) === 1)
    );
    console.log('[areAdjacent] rowA:', rowA, 'rowB:', rowB, 'adjacent:', adjacent);
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
