// Touch and drag event handlers
export function handleDragStart(event, gameState, setDraggedCell) {
    if (gameState.isResolving) { event.preventDefault(); return; }
    if (!event.target.classList.contains('cell')) return;
    console.log('dragstart', event.target);
    setDraggedCell(event.target);
}

export async function handleDrop(event, gameState, draggedCell, setDraggedCell, areAdjacent, trySwap) {
    event.preventDefault();
    if (gameState.isResolving || !draggedCell) return;
    const targetCell = event.target;
    console.log('drop', targetCell);
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

export async function handleTouchEnd(
    event,
    gameState,
    touchStartCell,
    touchStartX,
    touchStartY,
    setTouchStartCell,
    BOARD_SIZE,
    gameBoard,
    trySwap
) {
    if (gameState.isResolving || !touchStartCell) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    setTouchStartCell(null);

    const MIN_SWIPE_DISTANCE = 20;
    if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE && Math.abs(deltaY) < MIN_SWIPE_DISTANCE) return;

    const allCells = Array.from(gameBoard.children);
    const sourceIndex = allCells.indexOf(touchStartCell);
    if (sourceIndex === -1) return;

    let targetIndex = -1;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && sourceIndex % BOARD_SIZE < BOARD_SIZE - 1) {
            targetIndex = sourceIndex + 1;
        } else if (deltaX < 0 && sourceIndex % BOARD_SIZE > 0) {
            targetIndex = sourceIndex - 1;
        }
    } else {
        // Vertical swipe
        if (deltaY > 0 && sourceIndex + BOARD_SIZE < allCells.length) {
            targetIndex = sourceIndex + BOARD_SIZE;
        } else if (deltaY < 0 && sourceIndex - BOARD_SIZE >= 0) {
            targetIndex = sourceIndex - BOARD_SIZE;
        }
    }

    if (targetIndex !== -1) {
        await trySwap(touchStartCell, allCells[targetIndex]);
    }
}
