import { announce } from './utils.js';

/**
 * Determines the swipe direction and target index for a swipe gesture.
 * @param {number} sourceIndex - Index of the starting cell.
 * @param {number} deltaX - Horizontal movement.
 * @param {number} deltaY - Vertical movement.
 * @param {number} BOARD_SIZE - Number of cells per row.
 * @param {number} allCellsLength - Total number of cells.
 * @returns {number} The target cell index, or -1 if invalid.
 */
function getSwipeTargetIndex(sourceIndex, deltaX, deltaY, BOARD_SIZE, allCellsLength) {
    const MIN_SWIPE_DISTANCE = 20;
    if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE && Math.abs(deltaY) < MIN_SWIPE_DISTANCE) return -1;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && sourceIndex % BOARD_SIZE < BOARD_SIZE - 1) return sourceIndex + 1;
        if (deltaX < 0 && sourceIndex % BOARD_SIZE > 0) return sourceIndex - 1;
    } else {
        // Vertical swipe
        if (deltaY > 0 && sourceIndex + BOARD_SIZE < allCellsLength) return sourceIndex + BOARD_SIZE;
        if (deltaY < 0 && sourceIndex - BOARD_SIZE >= 0) return sourceIndex - BOARD_SIZE;
    }
    return -1;
}

/**
 * Handles drag start event for a cell.
 */
export function handleDragStart(event, gameState, setDraggedCell) {
    if (gameState.isResolving) { event.preventDefault(); return; }
    if (!event.target.classList.contains('cell')) return;
    setDraggedCell(event.target);
}

/**
 * Handles drop event for a cell.
 */
export async function handleDrop(event, gameState, draggedCell, setDraggedCell, areAdjacent, trySwap) {
    event.preventDefault();
    if (gameState.isResolving || !draggedCell) return;
    const targetCell = event.target;
    if (targetCell.classList.contains('cell') && areAdjacent(draggedCell, targetCell)) {
        await trySwap(draggedCell, targetCell);
    }
    setDraggedCell(null);
}

/**
 * Handles touch start event for a cell.
 */
export function handleTouchStart(event, gameState, setTouchStartCell, setTouchStartX, setTouchStartY) {
    if (gameState.isResolving) return;
    const touch = event.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!cell?.classList.contains('cell')) return;
    setTouchStartCell(cell);
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
}

/**
 * Handles touch end event for a cell.
 */
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

    const allCells = Array.from(gameBoard.querySelectorAll('.cell'));
    const sourceIndex = allCells.indexOf(touchStartCell);
    if (sourceIndex === -1) return;

    const targetIndex = getSwipeTargetIndex(sourceIndex, deltaX, deltaY, BOARD_SIZE, allCells.length);
    if (targetIndex !== -1) {
        // A real swipe was handled here — suppress the synthetic click most
        // mobile browsers fire after touchend, so tap-to-select doesn't
        // double-fire on the same gesture.
        event.preventDefault?.();
        await trySwap(touchStartCell, allCells[targetIndex]);
    }
}

/**
 * Handles a tap/click/keyboard activation on a cell: selects it, or — if
 * another cell is already selected and this one is adjacent — swaps them.
 * This is the accessible counterpart to drag/swipe: it's what fires for a
 * plain tap, a mouse click, Enter/Space on a focused cell, and (critically
 * for the Android build) a TalkBack double-tap, none of which reliably
 * produce the raw touchmove-based swipe gesture above.
 * @param {Event} event
 * @param {Object} gameState
 * @param {Function} setSelectedCell
 * @param {Function} areAdjacent
 * @param {Function} trySwap
 */
export async function handleCellActivate(event, gameState, setSelectedCell, areAdjacent, trySwap) {
    if (gameState.isResolving) return;
    const cell = event.currentTarget;
    if (!cell?.classList?.contains('cell')) return;

    const selectedCell = gameState.selectedCell;

    if (!selectedCell) {
        cell.classList.add('selected');
        setSelectedCell(cell);
        announce(`Selected ${cell.textContent || 'tile'}. Choose an adjacent tile to swap.`);
        return;
    }

    if (selectedCell === cell) {
        selectedCell.classList.remove('selected');
        setSelectedCell(null);
        announce('Deselected.');
        return;
    }

    selectedCell.classList.remove('selected');
    setSelectedCell(null);

    if (areAdjacent(selectedCell, cell)) {
        await trySwap(selectedCell, cell);
    } else {
        // Not adjacent — move the selection to the newly tapped cell instead
        // of forcing the player to deselect first.
        cell.classList.add('selected');
        setSelectedCell(cell);
        announce(`${cell.textContent || 'Tile'} is not adjacent to the previous selection. Selected ${cell.textContent || 'tile'} instead.`);
    }
}
