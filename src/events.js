// events.js - Handles event listeners and event-related logic
import { areAdjacent } from './game.js';

export function wireUpCellEvents(gameBoard, BOARD_SIZE, onDragStart, onDrop, onTouchStart, onTouchEnd) {
  const cells = Array.from(gameBoard.children);
  cells.forEach(cell => {
    // Remove previous listeners by cloning the node
    const newCell = cell.cloneNode(true);
    newCell.draggable = true;
    cell.replaceWith(newCell);
  });
  // Ensure all .cell elements are draggable after replacement
  Array.from(gameBoard.children).forEach(cell => {
    cell.draggable = true;
  });
  // Re-query after replacement
  const updatedCells = Array.from(gameBoard.children);
  updatedCells.forEach(cell => {
    cell.addEventListener('dragstart', onDragStart);
    cell.addEventListener('dragover', e => e.preventDefault()); // Allow drop
    cell.addEventListener('drop', onDrop);
    cell.addEventListener('touchstart', onTouchStart);
    cell.addEventListener('touchend', onTouchEnd);
  });
}

export function attachEventListeners({
  playButton,
  restartBtn,
  howToPlayBtn,
  howToPlayModal,
  closeHowToPlay,
  handlePlayClick,
  handleRestartLevel
}) {
  if (playButton) playButton.addEventListener('click', handlePlayClick);
  if (restartBtn) restartBtn.addEventListener('click', handleRestartLevel);
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
  // Close modal if clicking outside modal content
  if (howToPlayModal) {
    howToPlayModal.addEventListener('click', (e) => {
      if (e.target === howToPlayModal) {
        howToPlayModal.classList.add('hidden');
      }
    });
  }
}
