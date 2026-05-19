
// events.js - Handles event listeners and event-related logic

/**
 * Wires up drag and touch events for all .cell elements in the game board.
 * Removes previous listeners by cloning each cell, then attaches new listeners.
 * @param {HTMLElement} gameBoard - The game board container.
 * @param {number} boardSize - The size of the board (unused, for API compatibility).
 * @param {Function} onDragStart - Handler for dragstart.
 * @param {Function} onDrop - Handler for drop.
 * @param {Function} onTouchStart - Handler for touchstart.
 * @param {Function} onTouchEnd - Handler for touchend.
 */
export function wireUpCellEvents(gameBoard, boardSize, onDragStart, onDrop, onTouchStart, onTouchEnd) {
  // Replace each cell with a clone to remove old listeners
  const cells = Array.from(gameBoard.querySelectorAll('.cell'));
  cells.forEach(cell => {
    const newCell = cell.cloneNode(true);
    newCell.draggable = true;
    cell.replaceWith(newCell);
  });

  // Attach new listeners to all cells
  const updatedCells = Array.from(gameBoard.querySelectorAll('.cell'));
  updatedCells.forEach(cell => {
    cell.draggable = true;
    cell.addEventListener('dragstart', onDragStart);
    cell.addEventListener('dragover', e => e.preventDefault());
    cell.addEventListener('drop', onDrop);
    cell.addEventListener('touchstart', onTouchStart);
    cell.addEventListener('touchend', onTouchEnd);
  });
}


/**
 * Attaches event listeners for menu and modal controls.
 * @param {Object} params
 * @param {HTMLElement} params.playButton
 * @param {HTMLElement} params.restartBtn
 * @param {HTMLElement} params.howToPlayBtn
 * @param {HTMLElement} params.howToPlayModal
 * @param {HTMLElement} params.closeHowToPlay
 * @param {Function} params.handlePlayClick
 * @param {Function} params.handleRestartLevel
 */
export function attachEventListeners({
  playButton,
  restartBtn,
  howToPlayBtn,
  howToPlayModal,
  closeHowToPlay,
  handlePlayClick,
  handleRestartLevel
}) {
  playButton?.addEventListener('click', handlePlayClick);
  restartBtn?.addEventListener('click', handleRestartLevel);

  if (howToPlayBtn && howToPlayModal) {
    howToPlayBtn.addEventListener('click', () => {
      howToPlayModal.classList.remove('hidden');
    });
  }

  if (closeHowToPlay && howToPlayModal) {
    closeHowToPlay.addEventListener('click', () => {
      howToPlayModal.classList.add('hidden');
    });
  }

  if (howToPlayModal) {
    howToPlayModal.addEventListener('click', (e) => {
      if (e.target === howToPlayModal) {
        howToPlayModal.classList.add('hidden');
      }
    });
  }
}
