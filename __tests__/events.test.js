
// events.test.js - Unit tests for events.js
// Add your tests here
import { wireUpCellEvents } from '../src/events.js';

describe('events', () => {
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

  test('wireUpCellEvents wires click and keyboard activation when onActivate is given', () => {
    const gameBoard = document.createElement('div');
    const cell = document.createElement('div');
    cell.className = 'cell';
    gameBoard.appendChild(cell);
    const onActivate = jest.fn();

    wireUpCellEvents(gameBoard, 1, () => {}, () => {}, () => {}, () => {}, onActivate);

    const wiredCell = gameBoard.querySelector('.cell');
    wiredCell.dispatchEvent(new MouseEvent('click'));
    expect(onActivate).toHaveBeenCalledTimes(1);

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    wiredCell.dispatchEvent(enterEvent);
    expect(onActivate).toHaveBeenCalledTimes(2);

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    wiredCell.dispatchEvent(spaceEvent);
    expect(onActivate).toHaveBeenCalledTimes(3);

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    wiredCell.dispatchEvent(tabEvent);
    expect(onActivate).toHaveBeenCalledTimes(3); // unchanged — Tab isn't an activation key
  });

  test('wireUpCellEvents omits click/keydown listeners when onActivate is not provided', () => {
    const gameBoard = document.createElement('div');
    const cell = document.createElement('div');
    cell.className = 'cell';
    gameBoard.appendChild(cell);

    expect(() => {
      wireUpCellEvents(gameBoard, 1, () => {}, () => {}, () => {}, () => {});
      gameBoard.querySelector('.cell').dispatchEvent(new MouseEvent('click'));
    }).not.toThrow();
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
});