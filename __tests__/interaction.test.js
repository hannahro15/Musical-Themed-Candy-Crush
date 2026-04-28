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

  test('handleDragStart does nothing when not a cell', () => {
    const nonCell = document.createElement('div');
    const event = { target: nonCell, preventDefault: jest.fn() };

    handleDragStart(event, gameState, setDraggedCell);
    expect(gameState.draggedCell).toBeNull();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  test('handleDrop does nothing when not a cell', async () => {
    const draggedCell = document.createElement('div');
    draggedCell.classList.add('cell');
    const nonCell = document.createElement('div');
    const event = { target: nonCell, preventDefault: jest.fn() };
    setDraggedCell(draggedCell);

    const areAdjacent = jest.fn();
    const trySwap = jest.fn();

    await handleDrop(event, gameState, draggedCell, setDraggedCell, areAdjacent, trySwap);
    expect(areAdjacent).not.toHaveBeenCalled();
    expect(trySwap).not.toHaveBeenCalled();
    expect(gameState.draggedCell).toBeNull();
  });

  test('handleDrop does not call trySwap if cells are not adjacent', async () => {
    const draggedCell = document.createElement('div');
    draggedCell.classList.add('cell');
    const targetCell = document.createElement('div');
    targetCell.classList.add('cell');
    const event = { target: targetCell, preventDefault: jest.fn() };
    setDraggedCell(draggedCell);

    const areAdjacent = jest.fn().mockReturnValue(false);
    const trySwap = jest.fn();

    await handleDrop(event, gameState, draggedCell, setDraggedCell, areAdjacent, trySwap);
    expect(areAdjacent).toHaveBeenCalledWith(draggedCell, targetCell);
    expect(trySwap).not.toHaveBeenCalled();
    expect(gameState.draggedCell).toBeNull();
  });

  test ('handleTouchStart does nothing when not a cell or a cell is not found', () => {
    const touch = { clientX: 100, clientY: 200 };
    const event = { touches: [touch] };
    document.elementFromPoint = jest.fn().mockReturnValue(null);

    handleTouchStart(event, gameState, setTouchStartCell, setTouchStartX, setTouchStartY);
    expect(gameState.touchStartCell).toBeNull();
    expect(gameState.touchStartX).toBeNull();
    expect(gameState.touchStartY).toBeNull();
  });

  test ('handleTouchEnd does nothing if swipe is too short or indices are invalid', () => {
    const touchStartCell = document.createElement('div');
    touchStartCell.classList.add('cell');
    const touch = { clientX: 100, clientY: 200 };
    const event = { changedTouches: [touch] };
    setTouchStartCell(touchStartCell);
    setTouchStartX(100);
    setTouchStartY(200);

    const BOARD_SIZE = 8;
    const gameBoard = document.createElement('div');
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      gameBoard.appendChild(cell);
    }
    document.elementFromPoint = jest.fn().mockReturnValue(touchStartCell);

    const trySwap = jest.fn();

    // Test short swipe
    handleTouchEnd(event, gameState, touchStartCell, 100, 200, setTouchStartCell, BOARD_SIZE, gameBoard, trySwap);
    expect(trySwap).not.toHaveBeenCalled();

    // Test invalid indices
    setTouchStartX(0);
    setTouchStartY(0);
    handleTouchEnd(event, gameState, touchStartCell, 0, 0, setTouchStartCell, BOARD_SIZE, gameBoard, trySwap);
    expect(trySwap).not.toHaveBeenCalled();
  });
});