// events.js - Handles event listeners and event-related logic
import { areAdjacent } from './game.js';

export function wireUpCellEvents(gameBoard, boardSize, onDragStart, onDrop, onTouchStart, onTouchEnd) {
  const cells = Array.from(gameBoard.querySelectorAll('.cell'));
  cells.forEach(cell => {
    const newCell = cell.cloneNode(true);
    newCell.draggable = true;
    cell.replaceWith(newCell);
  });

  Array.from(gameBoard.querySelectorAll('.cell')).forEach(cell => {
    cell.draggable = true;
    cell.addEventListener('dragstart', onDragStart);
    cell.addEventListener('dragover', e => e.preventDefault());
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
  playButton?.addEventListener('click', handlePlayClick);
  restartBtn?.addEventListener('click', handleRestartLevel);
  
  howToPlayBtn?.addEventListener('click', () => {
    howToPlayModal?.classList.remove('hidden');
  });
  
  closeHowToPlay?.addEventListener('click', () => {
    howToPlayModal?.classList.add('hidden');
  });
  
  howToPlayModal?.addEventListener('click', (e) => {
    if (e.target === howToPlayModal) {
      howToPlayModal.classList.add('hidden');
    }
  });
}
