// Touch and drag event handlers
export function handleDragStart(event, gameState, setDraggedCell) {
  if (gameState.isResolving) { event.preventDefault(); return; }
  if (!event.target.classList.contains('cell')) return;
  setDraggedCell(event.target);
}

export async function handleDrop(event, gameState, draggedCell, setDraggedCell, areAdjacent, trySwap) {
  event.preventDefault();
  if (gameState.isResolving || !draggedCell) return;
  const targetCell = event.target;
  if (targetCell.classList.contains('cell') && areAdjacent(draggedCell, targetCell)) {
    await trySwap(draggedCell, targetCell);
  }
  setDraggedCell(null);
}

export function handleTouchStart(event, gameState, setTouchStartCell, setTouchStartX, setTouchStartY, gameBoard) {
  if (gameState.isResolving) return;
  const touch = event.touches[0];
  const cell = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!cell?.classList.contains('cell')) return;
  setTouchStartCell(cell);
  setTouchStartX(touch.clientX);
  setTouchStartY(touch.clientY);
}

export async function handleTouchEnd(event, gameState, touchStartCell, touchStartX, touchStartY, setTouchStartCell, BOARD_SIZE, gameBoard, trySwap) {
  if (gameState.isResolving || !touchStartCell) return;
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  const sourceCell = touchStartCell;
  setTouchStartCell(null);
  const MIN_SWIPE_DISTANCE = 20;
  if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE && Math.abs(deltaY) < MIN_SWIPE_DISTANCE) return;
  const allCells = [...gameBoard.children];
  const sourceIndex = allCells.indexOf(sourceCell);
  if (sourceIndex === -1) return;
  const column = sourceIndex % BOARD_SIZE;
  const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
  let indexOffset;
  if (isHorizontalSwipe) {
    const swipeRight = deltaX > 0 && column < BOARD_SIZE - 1;
    const swipeLeft = deltaX < 0 && column > 0;
    indexOffset = swipeRight ? 1 : swipeLeft ? -1 : 0;
  } else {
    indexOffset = deltaY > 0 ? BOARD_SIZE : -BOARD_SIZE;
  }
  const targetIndex = sourceIndex + indexOffset;
  if (indexOffset !== 0 && targetIndex >= 0 && targetIndex < allCells.length) {
    await trySwap(sourceCell, allCells[targetIndex]);
  }
}
