// interaction.test.js - Unit tests for interaction.js
// Add your tests here

import { handleDragStart, handleDrop, handleTouchStart, handleTouchEnd } from '../src/interaction.js';
import { gameState, setDraggedCell, setTouchStartCell, setTouchStartX, setTouchStartY } from '../src/gameState.js';

describe('interaction', () => {
  beforeEach(() => {
    // Reset gameState and related variables before each test
    gameState.isResolving = false;
    setDraggedCell(null);
    setTouchStartCell(null);
    setTouchStartX(null);
    setTouchStartY(null);
  });

  test('handleDragStart sets dragged cell when not resolving', () => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const event = { target: cell, preventDefault: jest.fn() };

    handleDragStart(event, gameState, setDraggedCell);
    expect(gameState.draggedCell).toBe(cell);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  test('handleDragStart prevents default when resolving', () => {
    gameState.isResolving = true;
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const event = { target: cell, preventDefault: jest.fn() };

    handleDragStart(event, gameState, setDraggedCell);
    expect(gameState.draggedCell).toBeNull();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  // Additional tests for handleDrop, handleTouchStart, and handleTouchEnd would go here
});