
// events.test.js - Unit tests for events.js
// Add your tests here
import { attachEventListeners, wireUpCellEvents } from '../src/events.js';

describe('events', () => {
  test('attachEventListeners attaches all expected event listeners', () => {
    const playButton = document.createElement('button');
    const restartBtn = document.createElement('button');
    const howToPlayBtn = document.createElement('button');
    const howToPlayModal = document.createElement('div');
    const closeHowToPlay = document.createElement('button');
    const handlePlayClick = jest.fn();
    const handleRestartLevel = jest.fn();

    // Attach to DOM for event listeners
    document.body.appendChild(playButton);
    document.body.appendChild(restartBtn);
    document.body.appendChild(howToPlayBtn);
    document.body.appendChild(howToPlayModal);
    document.body.appendChild(closeHowToPlay);

    attachEventListeners({
      playButton,
      restartBtn,
      howToPlayBtn,
      howToPlayModal,
      closeHowToPlay,
      handlePlayClick,
      handleRestartLevel
    });

    playButton.click();
    expect(handlePlayClick).toHaveBeenCalled();
    restartBtn.click();
    expect(handleRestartLevel).toHaveBeenCalled();
  });

  test('wireUpCellEvents wires up all expected event listeners', () => {
    const gameBoard = document.createElement('div');
    // Create mock cells
    for (let i = 0; i < 3; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      gameBoard.appendChild(cell);
    }
    const BOARD_SIZE = 3;
    const onDragStart = jest.fn();
    const onDrop = jest.fn();
    const onTouchStart = jest.fn();
    const onTouchEnd = jest.fn();

    wireUpCellEvents(gameBoard, BOARD_SIZE, onDragStart, onDrop, onTouchStart, onTouchEnd);

    const cells = Array.from(gameBoard.children);
    cells.forEach(cell => {
      // Simulate dragstart
      const dragEvent = new Event('dragstart');
      cell.dispatchEvent(dragEvent);
      expect(onDragStart).toHaveBeenCalled();
      // Simulate drop
      const dropEvent = new Event('drop');
      cell.dispatchEvent(dropEvent);
      expect(onDrop).toHaveBeenCalled();
      // Simulate touchstart
      const touchStartEvent = new Event('touchstart');
      cell.dispatchEvent(touchStartEvent);
      expect(onTouchStart).toHaveBeenCalled();
      // Simulate touchend
      const touchEndEvent = new Event('touchend');
      cell.dispatchEvent(touchEndEvent);
      expect(onTouchEnd).toHaveBeenCalled();
    });
  });

  test('wireUpCellEvents that draggable attribute is set to true after wiring', () => {
    const gameBoard = document.createElement('div');
    for (let i = 0; i < 3; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      gameBoard.appendChild(cell);
    }
    const BOARD_SIZE = 3;
    wireUpCellEvents(gameBoard, BOARD_SIZE, () => {}, () => {}, () => {}, () => {});

    const cells = Array.from(gameBoard.children);
    cells.forEach(cell => {
      expect(cell.draggable).toBe(true);
    });
  });

test ('shows/hides the how to play modal on button clicks', () => {
    const howToPlayBtn = document.createElement('button');
    const howToPlayModal = document.createElement('div');
    const closeHowToPlay = document.createElement('button');

    // Attach to DOM for event listeners
    document.body.appendChild(howToPlayBtn);
    document.body.appendChild(howToPlayModal);
    document.body.appendChild(closeHowToPlay);

    attachEventListeners({
      howToPlayBtn,
      howToPlayModal,
      closeHowToPlay,
      handlePlayClick: () => {},
      handleRestartLevel: () => {}
    });

    howToPlayBtn.click();
    expect(howToPlayModal.classList.contains('hidden')).toBe(false);
    closeHowToPlay.click();
    expect(howToPlayModal.classList.contains('hidden')).toBe(true); 
  });
  
  test('closes the modal when clicking the modal background', () => {
    const howToPlayModal = document.createElement('div');
    const modalContent = document.createElement('div');
    howToPlayModal.appendChild(modalContent);
    howToPlayModal.classList.add('modal');
    // Show the modal
    howToPlayModal.classList.remove('hidden');
    document.body.appendChild(howToPlayModal);

    attachEventListeners({
      howToPlayModal,
      howToPlayBtn: null,
      closeHowToPlay: null,
      handlePlayClick: () => {},
      handleRestartLevel: () => {}
    });

    // Simulate click on the modal background (not modalContent)
    const clickEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(clickEvent, 'target', { value: howToPlayModal, enumerable: true });
    howToPlayModal.dispatchEvent(clickEvent);
    expect(howToPlayModal.classList.contains('hidden')).toBe(true);
  });

    test('does not close the modal when clicking inside modal content', () => {
    const howToPlayModal = document.createElement('div');
    const modalContent = document.createElement('div');
    howToPlayModal.appendChild(modalContent);
    howToPlayModal.classList.add('modal');
    howToPlayModal.classList.remove('hidden');
    document.body.appendChild(howToPlayModal);

    attachEventListeners({
      howToPlayModal,
      howToPlayBtn: null,
      closeHowToPlay: null,
      handlePlayClick: () => {},
      handleRestartLevel: () => {}
    });

    // Simulate click on the modal content (child element)
    const clickEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(clickEvent, 'target', { value: modalContent, enumerable: true });
    modalContent.dispatchEvent(clickEvent);
    expect(howToPlayModal.classList.contains('hidden')).toBe(false);
  });
  
});