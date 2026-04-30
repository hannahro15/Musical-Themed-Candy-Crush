// gameState.test.js - Unit tests for gameState.js
// Add your tests here
import { gameState, resetGameState, setDraggedCell, setTouchStartCell, setTouchStartX, setTouchStartY } from '../src/gameState.js';


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
  
  test ('draggedCell can be reset to null', () => {
    const cell = { id: 'cell3' };
    setDraggedCell(cell);
    expect(gameState.draggedCell).toBe(cell);
    setDraggedCell(null);
    expect(gameState.draggedCell).toBeNull();
  });
  
  test('touchStartCell can be reset to null', () => {
    const cell = { id: 'cell4' };
    setTouchStartCell(cell);
    expect(gameState.touchStartCell).toBe(cell);
    setTouchStartCell(null);
    expect(gameState.touchStartCell).toBeNull();
  });

  test('touchStartX can be reset to null', () => {
    setTouchStartX(123);
    expect(gameState.touchStartX).toBe(123);
    setTouchStartX(null);
    expect(gameState.touchStartX).toBeNull();
  });

  test('touchStartY can be reset to null', () => {
    setTouchStartY(456);
    expect(gameState.touchStartY).toBe(456);
    setTouchStartY(null);
    expect(gameState.touchStartY).toBeNull();
  });

  test('resetGameState sets movesLeft and score correctly', () => {
    const config = {
      moves: 20,
      objectives: [{ label: 'red', count: 10 }, { label: 'blue', count: 5 }],
      timer: 60,
    };
    resetGameState(config);
    expect(gameState.movesLeft).toBe(20);
    expect(gameState.score).toBe(0);
    expect(gameState.redLeft).toBe(10);
    expect(gameState.blueLeft).toBe(5);
    expect(gameState.levelComplete).toBe(false);
    expect(gameState.timer).toBe(60);
    expect(gameState.timerActive).toBe(true);
  });

  test ('resetGameState removes old objective counters', () => {
    gameState.redLeft = 10;
    gameState.blueLeft = 5;
    const config = {
      moves: 15,
      objectives: [{ label: 'green', count: 8 }],
      timer: 30,
    };
    resetGameState(config);
    expect(gameState.redLeft).toBeUndefined();
    expect(gameState.blueLeft).toBeUndefined();
    expect(gameState.greenLeft).toBe(8);
  });

  test ('restetGameState when config.objectives is missing or not an array', () => {
    const config = {
      moves: 10,
      timer: 20,
    };
    resetGameState(config);
    expect(gameState.movesLeft).toBe(10);
    expect(gameState.score).toBe(0);
    expect(gameState.levelComplete).toBe(false);
    expect(gameState.timer).toBe(20);
    expect(gameState.timerActive).toBe(true);
  });
});