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

  test('handleDrop tries swap when cells are adjacent', async () => {
    const draggedCell = document.createElement('div');
    draggedCell.classList.add('cell');
    const targetCell = document.createElement('div');
    targetCell.classList.add('cell');
    const event = { target: targetCell, preventDefault: jest.fn() };
    setDraggedCell(draggedCell);

    const areAdjacent = jest.fn().mockReturnValue(true);
    const trySwap = jest.fn().mockResolvedValue();

    await handleDrop(event, gameState, draggedCell, setDraggedCell, areAdjacent, trySwap);
    expect(areAdjacent).toHaveBeenCalledWith(draggedCell, targetCell);
    expect(trySwap).toHaveBeenCalledWith(draggedCell, targetCell);
    expect(gameState.draggedCell).toBeNull();
  });

  test('handleDrop does not try swap when cells are not adjacent', async () => {
    const draggedCell = document.createElement('div');
    draggedCell.classList.add('cell');
    const targetCell = document.createElement('div');
    targetCell.classList.add('cell');
    const event = { target: targetCell, preventDefault: jest.fn() };
    setDraggedCell(draggedCell);

    const areAdjacent = jest.fn().mockReturnValue(false);
    const trySwap = jest.fn().mockResolvedValue();

    await handleDrop(event, gameState, draggedCell, setDraggedCell, areAdjacent, trySwap);
    expect(areAdjacent).toHaveBeenCalledWith(draggedCell, targetCell);
    expect(trySwap).not.toHaveBeenCalled();
    expect(gameState.draggedCell).toBeNull();
  });

  test ('handleTouchStart sets touch start cell and coordinates', () => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const touch = { clientX: 100, clientY: 200 };
    const event = { touches: [touch] };
    document.elementFromPoint = jest.fn().mockReturnValue(cell);

    handleTouchStart(event, gameState, setTouchStartCell, setTouchStartX, setTouchStartY);
    expect(gameState.touchStartCell).toBe(cell);
    expect(gameState.touchStartX).toBe(100);
    expect(gameState.touchStartY).toBe(200);
  });
});