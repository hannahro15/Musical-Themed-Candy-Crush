// gameController.flow.test.js - Covers the game-flow/state-transition logic
// in gameController.js (startGame, continueGame, startLevel, restartLevel,
// nextLevel, autoSaveProgress) that gameController.test.js does not exercise.
// Dependency modules are mocked so gameController's own branching is what's
// under test, while dom.* elements are real jsdom nodes so classList/
// textContent assertions reflect actual behavior.

// Defined inline (not hoisted out) so the mock factory is self-contained -
// referencing an outer "mock"-prefixed const here resolves to undefined
// under Jest's module hoisting, even though jest.fn() closures over it work.
jest.mock('../src/levels.js', () => {
  const LEVELS = [
    { moves: 10, timer: 30, objectives: [{ symbol: 'A', label: 'alpha', count: 2 }] },
    { moves: 12, timer: 40, objectives: [{ symbol: 'B', label: 'beta', count: 3 }] },
  ];
  return {
    LEVELS,
    getLevelConfig: jest.fn((n) => LEVELS[n - 1]),
  };
});

jest.mock('../src/storage.js', () => ({
  getHighScore: jest.fn(() => 0),
  saveHighScore: jest.fn(),
  getHighestLevel: jest.fn(() => 0),
  saveHighestLevel: jest.fn(),
  loadGameProgress: jest.fn(() => null),
  clearGameProgress: jest.fn(),
  saveGameProgress: jest.fn(),
}));

jest.mock('../src/board.js', () => ({
  getSafeSymbol: jest.fn(),
  hasPossibleMoves: jest.fn(() => true),
  generateGameBoard: jest.fn(),
  updateCellClass: jest.fn(),
}));

jest.mock('../src/timer.js', () => ({
  startTimer: jest.fn(),
  stopTimer: jest.fn(),
}));

jest.mock('../src/events.js', () => ({
  wireUpCellEvents: jest.fn(),
  attachEventListeners: jest.fn(),
}));

jest.mock('../src/boardEventHandlers.js', () => ({
  setGameBoardRef: jest.fn(),
  boardEventHandlers: {
    onDragStart: jest.fn(),
    onDrop: jest.fn(),
    onTouchStart: jest.fn(),
    onTouchEnd: jest.fn(),
    onActivate: jest.fn(),
  },
}));

jest.mock('../src/ui.js', () => ({
  showMenuPage: jest.fn(),
  updateLivesDisplay: jest.fn(),
  updateMovesDisplay: jest.fn(),
  updateScoreDisplay: jest.fn(),
  updateTotalScoreDisplay: jest.fn(),
  updateHighScoreDisplay: jest.fn(),
  updateObjectiveCounters: jest.fn(),
}));

jest.mock('../src/levelOutcomes.js', () => ({
  handleLevelWin: jest.fn(),
  handleLevelLose: jest.fn(),
}));

import * as storageMock from '../src/storage.js';
import * as boardMock from '../src/board.js';
import * as timerMock from '../src/timer.js';
import { LEVELS as mockLevels } from '../src/levels.js';
import { gameState } from '../src/gameState.js';
import { INITIAL_LIVES } from '../src/constants.js';
import * as dom from '../src/domElements.js';
import {
  resetGame,
  startGame,
  restartGameFromBeginning,
  continueGame,
  startLevel,
  restartLevel,
  nextLevel,
  autoSaveProgress,
} from '../src/gameController.js';

function el(startHidden = false) {
  const e = document.createElement('div');
  if (startHidden) e.classList.add('hidden');
  return e;
}

describe('gameController flow', () => {
  beforeEach(() => {
    // Fresh real DOM nodes each test, mirroring index.html's initial classes.
    dom.container = el();
    dom.heading = el();
    dom.subtitle = el();
    dom.menu = el();
    dom.gameBoard = el();
    dom.gameBoardContainer = el(true);
    dom.scoreMovesWrapper = el();
    dom.levelDisplay = el(true);
    dom.movesDisplay = el(true);
    dom.scoreDisplay = el(true);
    dom.timerDisplay = el(true);
    dom.livesDisplay = el();
    dom.totalScoreDisplay = el(true);
    dom.objectiveCounters = el();
    dom.highScoreDisplay = el(true);
    dom.highestLevelDisplay = el(true);
    dom.continueButton = el(true);
    dom.restartGameBtn = el(true);
    dom.playButton = el();
    dom.homeBtn = el(true);
    dom.restartContainer = el(true);
    dom.restartLevelModal = el(true);
    dom.confirmRestartBtn = el();
    dom.nextLevelModal = el(true);
    dom.confirmNextLevelBtn = el();
    dom.gameOverModal = el(true);
    dom.congratsModal = el(true);
    dom.congratsFinalScore = el();

    // Reset the shared gameState singleton to a known baseline.
    Object.assign(gameState, {
      movesLeft: 0,
      score: 0,
      totalScore: 0,
      isResolving: false,
      level: 1,
      levelComplete: false,
      timer: 0,
      timerInterval: null,
      timerActive: false,
      lives: INITIAL_LIVES,
      draggedCell: null,
      touchStartCell: null,
      touchStartX: null,
      touchStartY: null,
      selectedCell: null,
      alphaLeft: undefined,
      betaLeft: undefined,
    });
    delete gameState.alphaLeft;
    delete gameState.betaLeft;

    jest.clearAllMocks();
    storageMock.loadGameProgress.mockReturnValue(null);
  });

  test('resetGame resets level, lives, score, and totalScore', () => {
    gameState.level = 5;
    gameState.lives = 1;
    gameState.score = 999;
    gameState.totalScore = 500;
    resetGame();
    expect(gameState.level).toBe(1);
    expect(gameState.lives).toBe(INITIAL_LIVES);
    expect(gameState.score).toBe(0);
    expect(gameState.totalScore).toBe(0);
  });

  test('startLevel configures gameState and renders the level', () => {
    startLevel(1);
    expect(gameState.level).toBe(1);
    expect(gameState.levelComplete).toBe(false);
    expect(gameState.movesLeft).toBe(mockLevels[0].moves);
    expect(gameState.timer).toBe(mockLevels[0].timer);
    expect(gameState.timerActive).toBe(true);
    expect(gameState.score).toBe(0);
    expect(gameState.alphaLeft).toBe(2);
    expect(dom.levelDisplay.textContent).toBe('LEVEL 1');
    expect(boardMock.generateGameBoard).toHaveBeenCalled();
    expect(timerMock.startTimer).toHaveBeenCalled();
  });

  test('startLevel falls back to the menu when the level config is missing', () => {
    dom.container.classList.add('game-active');
    startLevel(999);
    expect(dom.container.classList.contains('game-active')).toBe(false);
    // No saved progress -> Play shown, Continue/Restart hidden.
    expect(dom.playButton.classList.contains('hidden')).toBe(false);
    expect(dom.continueButton.classList.contains('hidden')).toBe(true);
  });

  test('startGame resets state, clears saved progress, and starts level 1', () => {
    gameState.level = 3;
    startGame();
    expect(storageMock.clearGameProgress).toHaveBeenCalled();
    expect(gameState.level).toBe(1);
    expect(dom.gameBoardContainer.classList.contains('hidden')).toBe(false);
  });

  test('restartGameFromBeginning clears progress then starts a new game', () => {
    gameState.level = 2;
    restartGameFromBeginning();
    expect(storageMock.clearGameProgress).toHaveBeenCalled();
    expect(gameState.level).toBe(1);
  });

  test('continueGame starts a new game when there is no saved progress', () => {
    gameState.level = 5;
    continueGame();
    expect(gameState.level).toBe(1);
  });

  test('continueGame restores saved state and generates a fresh board when none was saved', () => {
    storageMock.loadGameProgress.mockReturnValueOnce({
      level: 2,
      lives: 2,
      score: 40,
      totalScore: 100,
      movesLeft: 5,
      timer: 20,
      objectives: { betaLeft: 1 },
      boardState: [],
    });
    continueGame();
    expect(gameState.level).toBe(2);
    expect(gameState.lives).toBe(2);
    expect(gameState.totalScore).toBe(100);
    // Config default (3) is overwritten by the saved progress value (1).
    expect(gameState.betaLeft).toBe(1);
    expect(boardMock.generateGameBoard).toHaveBeenCalled();
    expect(timerMock.startTimer).toHaveBeenCalled();
  });

  test('continueGame falls back to a new game when the saved level no longer exists', () => {
    storageMock.loadGameProgress.mockReturnValueOnce({
      level: 999,
      lives: 1,
      score: 0,
      totalScore: 0,
      movesLeft: 0,
      timer: 0,
      objectives: {},
      boardState: [],
    });
    continueGame();
    expect(gameState.level).toBe(1);
    expect(storageMock.clearGameProgress).toHaveBeenCalled();
  });

  test('continueGame recreates the board from saved cell content instead of generating a new one', () => {
    storageMock.loadGameProgress.mockReturnValueOnce({
      level: 1,
      lives: 3,
      score: 10,
      totalScore: 10,
      movesLeft: 8,
      timer: 0,
      objectives: {},
      boardState: [['A', 'B'], ['', 'C']],
    });
    continueGame();
    expect(boardMock.generateGameBoard).not.toHaveBeenCalled();
    expect(dom.gameBoard.children.length).toBe(4);
    expect(dom.gameBoard.children[0].textContent).toBe('A');
    // Saved timer is 0, so the timer should not restart.
    expect(timerMock.startTimer).not.toHaveBeenCalled();
  });

  test('restartLevel hides modals and restarts the current level', () => {
    gameState.level = 2;
    dom.gameOverModal.classList.remove('hidden');
    restartLevel();
    expect(dom.gameOverModal.classList.contains('hidden')).toBe(true);
    expect(dom.restartLevelModal.classList.contains('hidden')).toBe(true);
    expect(gameState.level).toBe(2);
    expect(gameState.movesLeft).toBe(mockLevels[1].moves);
  });

  test('nextLevel advances to the next level and saves the highest level reached', () => {
    gameState.level = 1;
    gameState.score = 50;
    gameState.totalScore = 0;
    dom.nextLevelModal.classList.remove('hidden');
    nextLevel();
    expect(gameState.totalScore).toBe(50);
    expect(storageMock.saveHighestLevel).toHaveBeenCalledWith(1);
    expect(gameState.level).toBe(2);
    expect(dom.nextLevelModal.classList.contains('hidden')).toBe(true);
    expect(storageMock.saveHighScore).not.toHaveBeenCalled();
  });

  test('nextLevel finishes the game after the last level', () => {
    gameState.level = mockLevels.length;
    gameState.score = 30;
    gameState.totalScore = 70;
    dom.nextLevelModal.classList.remove('hidden');
    nextLevel();
    expect(gameState.totalScore).toBe(100);
    expect(storageMock.saveHighScore).toHaveBeenCalledWith(100);
    expect(storageMock.saveHighestLevel).toHaveBeenCalledWith(mockLevels.length);
    expect(storageMock.clearGameProgress).toHaveBeenCalled();
    expect(dom.congratsFinalScore.textContent).toBe('Total Score: 100');
    expect(dom.congratsModal.classList.contains('hidden')).toBe(false);
    expect(dom.nextLevelModal.classList.contains('hidden')).toBe(true);
  });

  test('autoSaveProgress saves while a level is in progress', () => {
    gameState.level = 1;
    gameState.levelComplete = false;
    autoSaveProgress();
    expect(storageMock.saveGameProgress).toHaveBeenCalled();
  });

  test('autoSaveProgress does not save once the level is complete', () => {
    gameState.level = 1;
    gameState.levelComplete = true;
    autoSaveProgress();
    expect(storageMock.saveGameProgress).not.toHaveBeenCalled();
  });

  test('autoSaveProgress does not save at the menu (level 0)', () => {
    gameState.level = 0;
    gameState.levelComplete = false;
    autoSaveProgress();
    expect(storageMock.saveGameProgress).not.toHaveBeenCalled();
  });
});
