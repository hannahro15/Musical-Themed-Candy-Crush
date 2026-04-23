// gameState.test.js - Unit tests for gameState.js
// Add your tests here
import { gameState, setDraggedCell, setTouchStartCell, setTouchStartX, setTouchStartY } from '../src/gameState.js';

describe('gameState', () => {
  beforeEach(() => {
    // Reset gameState before each test
    gameState.movesLeft = 0;
    gameState.score = 0;
    gameState.isResolving = false;
    gameState.level = 1;
    gameState.levelComplete = false;
    gameState.timer = 0;
    gameState.timerInterval = null;
    gameState.timerActive = false;
    gameState.lives = 3; // Assuming INITIAL_LIVES is 3
    setDraggedCell(null);
    setTouchStartCell(null);
    setTouchStartX(null);
    setTouchStartY(null);
  });

  test('initial state is correct', () => {
    expect(gameState.movesLeft).toBe(0);
    expect(gameState.score).toBe(0);
    expect(gameState.isResolving).toBe(false);
    expect(gameState.level).toBe(1);
    expect(gameState.levelComplete).toBe(false);
    expect(gameState.timer).toBe(0);
    expect(gameState.timerInterval).toBeNull();
    expect(gameState.timerActive).toBe(false);
    expect(gameState.lives).toBe(3); // Assuming INITIAL_LIVES is 3
    expect(gameState.draggedCell).toBeNull();
    expect(gameState.touchStartCell).toBeNull();
    expect(gameState.touchStartX).toBeNull();
    expect(gameState.touchStartY).toBeNull();
  });

  test('setDraggedCell updates draggedCell', () => {
    const cell = { id: 'cell1' };
    setDraggedCell(cell);
    expect(gameState.draggedCell).toBe(cell);
  });

  test('setTouchStartCell updates touchStartCell', () => {
    const cell = { id: 'cell2' };
    setTouchStartCell(cell);
    expect(gameState.touchStartCell).toBe(cell);
  });

  test('setTouchStartX updates touchStartX', () => {
    setTouchStartX(42);
    expect(gameState.touchStartX).toBe(42);
  });

  test('setTouchStartY updates touchStartY', () => {
    setTouchStartY(99);
    expect(gameState.touchStartY).toBe(99);
  });

  test ('setDraggedCell update the correct property in gameState', () => {
    const cell = { id: 'cell3' };
    setDraggedCell(cell);
    expect(gameState.draggedCell).toBe(cell);
  });

  test('setTouchStartCell updates the correct property in gameState', () => {
    const cell = { id: 'cell4' };
    setTouchStartCell(cell);
    expect(gameState.touchStartCell).toBe(cell);
  });

  test('setTouchStartX updates the correct property in gameState', () => {
    setTouchStartX(150);
    expect(gameState.touchStartX).toBe(150);
  });

  test('setTouchStartY updates the correct property in gameState', () => {
    setTouchStartY(250);
    expect(gameState.touchStartY).toBe(250);
  });   
});