//add tests for boardEventHandlers.js

import { boardEventHandlers, setGameBoardRef } from '../src/boardEventHandlers.js';
import { gameState, setDraggedCell, setTouchStartCell, setTouchStartX, setTouchStartY } from '../src/gameState.js';

describe('boardEventHandlers', () => {
  beforeEach(() => {
    // Reset gameState and related variables before each test
    gameState.isResolving = false;
    setDraggedCell(null);
    setTouchStartCell(null);
    setTouchStartX(null);
    setTouchStartY(null);
  });

  test('onDragStart calls handleDragStart with correct parameters', () => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const event = { target: cell, preventDefault: jest.fn() };

    boardEventHandlers.onDragStart(event);
    expect(gameState.draggedCell).toBe(cell);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  test('set the dragged cell in gameState on drag start', () => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const event = { target: cell, preventDefault: jest.fn() };

    boardEventHandlers.onDragStart(event);
    expect(gameState.draggedCell).toBe(cell);
  });
});