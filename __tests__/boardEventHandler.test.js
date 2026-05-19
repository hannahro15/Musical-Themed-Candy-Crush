//add tests for boardEventHandlers.js

import { boardEventHandlers, setGameBoardRef } from '../src/boardEventHandlers.js';
import { gameState, setDraggedCell, setTouchStartCell, setTouchStartX, setTouchStartY } from '../src/gameState.js';

describe('boardEventHandlers', () => {
  beforeEach(() => {
    gameState.isResolving = false;
    setDraggedCell(null);
    setTouchStartCell(null);
    setTouchStartX(null);
    setTouchStartY(null);
  });

  test('onDragStart sets dragged cell when interaction is allowed', () => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const event = { target: cell, preventDefault: jest.fn() };
    boardEventHandlers.onDragStart(event);
    expect(gameState.draggedCell).toBe(cell);
  });

  test('onDragStart does nothing if gameState.isResolving is true', () => {
    gameState.isResolving = true;
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const event = { target: cell, preventDefault: jest.fn() };
    boardEventHandlers.onDragStart(event);
    expect(gameState.draggedCell).toBeNull();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('onDragStart does nothing if target is not a cell', () => {
    const nonCell = document.createElement('div');
    const event = { target: nonCell, preventDefault: jest.fn() };
    boardEventHandlers.onDragStart(event);
    expect(gameState.draggedCell).toBeNull();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  test('setGameBoardRef sets the gameBoard reference', () => {
    const fakeBoard = {};
    setGameBoardRef(fakeBoard);
    expect(typeof setGameBoardRef).toBe('function');
  });
});