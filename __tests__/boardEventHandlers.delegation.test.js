// boardEventHandlers.delegation.test.js - Verifies each boardEventHandlers.*
// entry point wires its event through to the right interaction.js handler
// with the right arguments (gameState, the relevant setter(s), an adjacency
// check bound to the current board, and trySwap). interaction.js's own
// branching logic is already covered by interaction.test.js; this file is
// about the wiring, which boardEventHandlers.test.js only exercises for
// onDragStart.

jest.mock('../src/interaction.js', () => ({
  handleDragStart: jest.fn(),
  handleDrop: jest.fn(),
  handleTouchStart: jest.fn(),
  handleTouchEnd: jest.fn(),
  handleCellActivate: jest.fn(),
}));

jest.mock('../src/boardController.js', () => ({
  trySwap: jest.fn(),
}));

import * as interactionMock from '../src/interaction.js';
import { trySwap } from '../src/boardController.js';
import { boardEventHandlers, setGameBoardRef } from '../src/boardEventHandlers.js';
import { gameState } from '../src/gameState.js';
import { BOARD_SIZE } from '../src/constants.js';

describe('boardEventHandlers delegation', () => {
  let board;

  beforeEach(() => {
    jest.clearAllMocks();
    board = document.createElement('div');
    setGameBoardRef(board);
    gameState.draggedCell = null;
    gameState.touchStartCell = null;
    gameState.touchStartX = null;
    gameState.touchStartY = null;
  });

  test('onDrop delegates to handleDrop with gameState, the dragged cell, and trySwap', () => {
    gameState.draggedCell = 'DRAGGED_CELL';
    const event = { type: 'drop' };
    boardEventHandlers.onDrop(event);

    expect(interactionMock.handleDrop).toHaveBeenCalledTimes(1);
    const [evt, state, draggedCell, setDraggedCellArg, areAdjacentArg, trySwapArg] =
      interactionMock.handleDrop.mock.calls[0];
    expect(evt).toBe(event);
    expect(state).toBe(gameState);
    expect(draggedCell).toBe('DRAGGED_CELL');
    expect(typeof setDraggedCellArg).toBe('function');
    expect(typeof areAdjacentArg).toBe('function');
    expect(trySwapArg).toBe(trySwap);
  });

  test("onDrop's adjacency check is bound to the current board", () => {
    const cellA = document.createElement('div');
    const cellB = document.createElement('div');
    const cellC = document.createElement('div');
    board.append(cellA, cellB, cellC); // indexes 0, 1, 2 -> A/B adjacent, A/C are not

    boardEventHandlers.onDrop({});
    const areAdjacentArg = interactionMock.handleDrop.mock.calls[0][4];

    expect(areAdjacentArg(cellA, cellB)).toBe(true);
    expect(areAdjacentArg(cellA, cellC)).toBe(false);
  });

  test('onTouchStart delegates to handleTouchStart with gameState, the touch setters, and the board', () => {
    const event = { type: 'touchstart' };
    boardEventHandlers.onTouchStart(event);

    expect(interactionMock.handleTouchStart).toHaveBeenCalledTimes(1);
    const [evt, state, setTouchStartCellArg, setTouchStartXArg, setTouchStartYArg] =
      interactionMock.handleTouchStart.mock.calls[0];
    expect(evt).toBe(event);
    expect(state).toBe(gameState);
    expect(typeof setTouchStartCellArg).toBe('function');
    expect(typeof setTouchStartXArg).toBe('function');
    expect(typeof setTouchStartYArg).toBe('function');
  });

  test('onTouchEnd delegates to handleTouchEnd with the saved touch state, BOARD_SIZE, the board, and trySwap', () => {
    gameState.touchStartCell = 'TOUCH_CELL';
    gameState.touchStartX = 12;
    gameState.touchStartY = 34;
    const event = { type: 'touchend' };
    boardEventHandlers.onTouchEnd(event);

    expect(interactionMock.handleTouchEnd).toHaveBeenCalledWith(
      event,
      gameState,
      'TOUCH_CELL',
      12,
      34,
      expect.any(Function),
      BOARD_SIZE,
      board,
      trySwap
    );
  });

  test('onActivate delegates to handleCellActivate with gameState, the selection setter, an adjacency check, and trySwap', () => {
    const event = { type: 'click' };
    boardEventHandlers.onActivate(event);

    expect(interactionMock.handleCellActivate).toHaveBeenCalledTimes(1);
    const [evt, state, setSelectedCellArg, areAdjacentArg, trySwapArg] =
      interactionMock.handleCellActivate.mock.calls[0];
    expect(evt).toBe(event);
    expect(state).toBe(gameState);
    expect(typeof setSelectedCellArg).toBe('function');
    expect(typeof areAdjacentArg).toBe('function');
    expect(trySwapArg).toBe(trySwap);
  });
});
