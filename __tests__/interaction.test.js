// interaction.test.js - Unit tests for interaction.js
// Add your tests here

import { handleDragStart, handleDrop, handleTouchStart, handleTouchEnd, handleCellActivate } from '../src/interaction.js';
import { gameState, setDraggedCell, setTouchStartCell, setTouchStartX, setTouchStartY, setSelectedCell } from '../src/gameState.js';


beforeEach(() => {
  // Reset gameState and related variables before each test
  gameState.isResolving = false;
  setDraggedCell(null);
  setTouchStartCell(null);
  setTouchStartX(null);
  setTouchStartY(null);
  setSelectedCell(null);
});

describe('handleDragStart', () => {
  test('sets dragged cell when not resolving', () => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const event = { target: cell, preventDefault: jest.fn() };

    handleDragStart(event, gameState, setDraggedCell);
    expect(gameState.draggedCell).toBe(cell);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  test('prevents default when resolving', () => {
    gameState.isResolving = true;
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const event = { target: cell, preventDefault: jest.fn() };

    handleDragStart(event, gameState, setDraggedCell);
    expect(gameState.draggedCell).toBeNull();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('does nothing when not a cell', () => {
    const nonCell = document.createElement('div');
    const event = { target: nonCell, preventDefault: jest.fn() };

    handleDragStart(event, gameState, setDraggedCell);
    expect(gameState.draggedCell).toBeNull();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});

describe('handleDrop', () => {
  test('tries swap when cells are adjacent', async () => {
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

  test('does not try swap when cells are not adjacent', async () => {
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

  test('does nothing when not a cell', async () => {
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

  test('does not call trySwap if cells are not adjacent', async () => {
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

  test('Nothing happens if draggedCell is null', async () => {
    const event = { target: document.createElement('div'), preventDefault: jest.fn() };
    setDraggedCell(null);

    const areAdjacent = jest.fn();
    const trySwap = jest.fn();

    await handleDrop(event, gameState, null, setDraggedCell, areAdjacent, trySwap);
    expect(areAdjacent).not.toHaveBeenCalled();
    expect(trySwap).not.toHaveBeenCalled();
  });

  test('nothing happens if gameState.isResolvingis true', async () => {     
    const draggedCell = document.createElement('div');
    draggedCell.classList.add('cell');
    const targetCell = document.createElement('div');
    targetCell.classList.add('cell');
    const event = { target: targetCell, preventDefault: jest.fn() };
    setDraggedCell(draggedCell);
    gameState.isResolving = true;

    const areAdjacent = jest.fn();
    const trySwap = jest.fn();

    await handleDrop(event, gameState, draggedCell, setDraggedCell, areAdjacent, trySwap);
    expect(areAdjacent).not.toHaveBeenCalled();
    expect(trySwap).not.toHaveBeenCalled();
  });
});

describe('handleTouchStart', () => {
  test('sets touch start cell and coordinates', () => {
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

  test('does nothing when not a cell or a cell is not found', () => {
    const touch = { clientX: 100, clientY: 200 };
    const event = { touches: [touch] };
    document.elementFromPoint = jest.fn().mockReturnValue(null);

    handleTouchStart(event, gameState, setTouchStartCell, setTouchStartX, setTouchStartY);
    expect(gameState.touchStartCell).toBeNull();
    expect(gameState.touchStartX).toBeNull();
    expect(gameState.touchStartY).toBeNull();
  });

  test('nothing happens if gameState.isResolving is true', () => {
    gameState.isResolving = true;
    const touch = { clientX: 100, clientY: 200 };
    const event = { touches: [touch] };
    document.elementFromPoint = jest.fn().mockReturnValue(null);

    handleTouchStart(event, gameState, setTouchStartCell, setTouchStartX, setTouchStartY);
    expect(gameState.touchStartCell).toBeNull();
    expect(gameState.touchStartX).toBeNull();
    expect(gameState.touchStartY).toBeNull();
  });
});

describe('handleTouchEnd', () => {
  function buildBoard(size = 3) {
    const gameBoard = document.createElement('div');
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.textContent = String(i);
      gameBoard.appendChild(cell);
    }
    return gameBoard;
  }

  test('does nothing if swipe is too short or indices are invalid', () => {
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

  test('swipes right to adjacent target and prevents synthetic click', async () => {
    const board = buildBoard(3);
    const cells = Array.from(board.querySelectorAll('.cell'));
    const sourceCell = cells[0];
    const trySwap = jest.fn().mockResolvedValue();
    const event = {
      changedTouches: [{ clientX: 200, clientY: 100 }],
      preventDefault: jest.fn(),
    };

    await handleTouchEnd(event, gameState, sourceCell, 100, 100, setTouchStartCell, 3, board, trySwap);

    expect(trySwap).toHaveBeenCalledWith(sourceCell, cells[1]);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(gameState.touchStartCell).toBeNull();
  });

  test('swipes down to adjacent target', async () => {
    const board = buildBoard(3);
    const cells = Array.from(board.querySelectorAll('.cell'));
    const sourceCell = cells[1];
    const trySwap = jest.fn().mockResolvedValue();
    const event = {
      changedTouches: [{ clientX: 100, clientY: 250 }],
      preventDefault: jest.fn(),
    };

    await handleTouchEnd(event, gameState, sourceCell, 100, 100, setTouchStartCell, 3, board, trySwap);

    expect(trySwap).toHaveBeenCalledWith(sourceCell, cells[4]);
  });

  test('does not swap when swipe would cross left boundary', async () => {
    const board = buildBoard(3);
    const cells = Array.from(board.querySelectorAll('.cell'));
    const sourceCell = cells[0];
    const trySwap = jest.fn();
    const event = {
      changedTouches: [{ clientX: 50, clientY: 100 }],
      preventDefault: jest.fn(),
    };

    await handleTouchEnd(event, gameState, sourceCell, 100, 100, setTouchStartCell, 3, board, trySwap);

    expect(trySwap).not.toHaveBeenCalled();
  });

  test('returns early when source cell is not present in board', async () => {
    const board = buildBoard(3);
    const detachedCell = document.createElement('div');
    detachedCell.classList.add('cell');
    const trySwap = jest.fn();
    const event = {
      changedTouches: [{ clientX: 200, clientY: 100 }],
      preventDefault: jest.fn(),
    };

    await handleTouchEnd(event, gameState, detachedCell, 100, 100, setTouchStartCell, 3, board, trySwap);

    expect(trySwap).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  test('returns early when resolving or without a starting cell', async () => {
    const board = buildBoard(3);
    const event = {
      changedTouches: [{ clientX: 200, clientY: 100 }],
      preventDefault: jest.fn(),
    };
    const trySwap = jest.fn();

    gameState.isResolving = true;
    await handleTouchEnd(event, gameState, board.querySelector('.cell'), 100, 100, setTouchStartCell, 3, board, trySwap);
    expect(trySwap).not.toHaveBeenCalled();

    gameState.isResolving = false;
    await handleTouchEnd(event, gameState, null, 100, 100, setTouchStartCell, 3, board, trySwap);
    expect(trySwap).not.toHaveBeenCalled();
  });
});

describe('handleCellActivate', () => {
  test('selects a cell when nothing is selected', async () => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const event = { currentTarget: cell };

    await handleCellActivate(event, gameState, setSelectedCell, jest.fn(), jest.fn());

    expect(cell.classList.contains('selected')).toBe(true);
    expect(gameState.selectedCell).toBe(cell);
  });

  test('deselects a cell when tapped again', async () => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const event = { currentTarget: cell };

    await handleCellActivate(event, gameState, setSelectedCell, jest.fn(), jest.fn());
    await handleCellActivate(event, gameState, setSelectedCell, jest.fn(), jest.fn());

    expect(cell.classList.contains('selected')).toBe(false);
    expect(gameState.selectedCell).toBeNull();
  });

  test('swaps with the selected cell when the new cell is adjacent', async () => {
    const first = document.createElement('div');
    first.classList.add('cell');
    const second = document.createElement('div');
    second.classList.add('cell');
    const areAdjacent = jest.fn().mockReturnValue(true);
    const trySwap = jest.fn().mockResolvedValue();

    await handleCellActivate({ currentTarget: first }, gameState, setSelectedCell, areAdjacent, trySwap);
    await handleCellActivate({ currentTarget: second }, gameState, setSelectedCell, areAdjacent, trySwap);

    expect(areAdjacent).toHaveBeenCalledWith(first, second);
    expect(trySwap).toHaveBeenCalledWith(first, second);
    expect(first.classList.contains('selected')).toBe(false);
    expect(gameState.selectedCell).toBeNull();
  });

  test('moves selection to the new cell when it is not adjacent', async () => {
    const first = document.createElement('div');
    first.classList.add('cell');
    const second = document.createElement('div');
    second.classList.add('cell');
    const areAdjacent = jest.fn().mockReturnValue(false);
    const trySwap = jest.fn();

    await handleCellActivate({ currentTarget: first }, gameState, setSelectedCell, areAdjacent, trySwap);
    await handleCellActivate({ currentTarget: second }, gameState, setSelectedCell, areAdjacent, trySwap);

    expect(trySwap).not.toHaveBeenCalled();
    expect(first.classList.contains('selected')).toBe(false);
    expect(second.classList.contains('selected')).toBe(true);
    expect(gameState.selectedCell).toBe(second);
  });

  test('does nothing while a move is resolving', async () => {
    gameState.isResolving = true;
    const cell = document.createElement('div');
    cell.classList.add('cell');

    await handleCellActivate({ currentTarget: cell }, gameState, setSelectedCell, jest.fn(), jest.fn());

    expect(cell.classList.contains('selected')).toBe(false);
    expect(gameState.selectedCell).toBeNull();
  });
});