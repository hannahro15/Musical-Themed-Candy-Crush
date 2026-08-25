export const SYMBOL_CLASS_MAP = Object.freeze({
  '🎻': 'cell-violin',
  '🎹': 'cell-piano',
  '🎺': 'cell-trumpet',
  '🥁': 'cell-drum',
  '🎷': 'cell-saxophone',
  '🎵': 'cell-musicalnote'
});

const SYMBOL_CLASSES = Object.values(SYMBOL_CLASS_MAP);

function buildCellAriaLabel(symbol, row, col) {
  return `Game tile: ${symbol}, row ${row + 1}, column ${col + 1}`;
}

export function updateCellAppearance(cell) {
  SYMBOL_CLASSES.forEach((className) => cell.classList.remove(className));

  const symbolClass = SYMBOL_CLASS_MAP[cell.textContent];
  if (symbolClass) {
    cell.classList.add(symbolClass);
  }

  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  if (cell.textContent && Number.isInteger(row) && Number.isInteger(col)) {
    cell.setAttribute('aria-label', buildCellAriaLabel(cell.textContent, row, col));
  } else {
    cell.removeAttribute('aria-label');
  }
}

export function setCellSymbol(cell, symbol) {
  cell.textContent = symbol;
  updateCellAppearance(cell);
}

export function createGameCell(symbol, row, col) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.dataset.row = row;
  cell.dataset.col = col;
  cell.draggable = true;
  cell.tabIndex = 0;
  cell.setAttribute('role', 'button');
  setCellSymbol(cell, symbol);
  return cell;
}
