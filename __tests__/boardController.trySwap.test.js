// boardController.trySwap.test.js - Covers trySwap's actual swap/match/
// resolve flow, which boardController.test.js's guard-clause tests don't
// reach. game.js (swapCellContents, scoreForMatch), ui.js, and gameState.js
// are left real so the score/objective bookkeeping is genuinely exercised;
// board.js, levels.js, events.js, boardEventHandlers.js, gameController.js,
// and levelOutcomes.js are mocked to isolate boardController's own
// orchestration from the rest of the board mechanics.

jest.mock('../src/board.js', () => ({
  findMatches: jest.fn(),
  dropAndRefill: jest.fn(),
  hasPossibleMoves: jest.fn(() => true),
  getSafeSymbol: jest.fn(),
  reshuffleBoard: jest.fn(),
}));

jest.mock('../src/levels.js', () => ({
  getLevelConfig: jest.fn(),
}));

jest.mock('../src/events.js', () => ({
  wireUpCellEvents: jest.fn(),
}));

jest.mock('../src/boardEventHandlers.js', () => ({
  boardEventHandlers: {
    onDragStart: jest.fn(),
    onDrop: jest.fn(),
    onTouchStart: jest.fn(),
    onTouchEnd: jest.fn(),
    onActivate: jest.fn(),
  },
}));

jest.mock('../src/gameController.js', () => ({
  autoSaveProgress: jest.fn(),
}));

jest.mock('../src/levelOutcomes.js', () => ({
  handleLevelWin: jest.fn(),
  handleLevelLose: jest.fn(),
}));

import * as boardMock from '../src/board.js';
import * as levelsMock from '../src/levels.js';
import * as levelOutcomesMock from '../src/levelOutcomes.js';
import { autoSaveProgress } from '../src/gameController.js';
import { trySwap, setBoardControllerDeps } from '../src/boardController.js';
import { gameState } from '../src/gameState.js';

const LEVEL_CONFIG = {
  objectives: [{ symbol: '🎻', label: 'violin', count: 5 }],
};

function makeCell(symbol) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.textContent = symbol;
  return cell;
}

describe('trySwap', () => {
  let gameBoard, sourceCell, targetCell;

  beforeEach(() => {
    jest.clearAllMocks();
    levelsMock.getLevelConfig.mockReturnValue(LEVEL_CONFIG);

    gameBoard = document.createElement('div');
    sourceCell = makeCell('🎵');
    targetCell = makeCell('🎻');
    gameBoard.append(sourceCell, targetCell);

    setBoardControllerDeps({
      gameBoard,
      movesDisplay: document.createElement('div'),
      scoreDisplay: document.createElement('div'),
      totalScoreDisplay: document.createElement('div'),
    });

    Object.assign(gameState, {
      isResolving: false,
      levelComplete: false,
      timerActive: true,
      movesLeft: 5,
      timer: 30,
      level: 1,
      score: 0,
      totalScore: 0,
    });
    delete gameState.violinLeft;
  });

  test('reverts the swap and does nothing else when it creates no match', async () => {
    boardMock.findMatches.mockReturnValueOnce([]); // swapAndCheckMatch's check

    await trySwap(sourceCell, targetCell);

    expect(sourceCell.textContent).toBe('🎵');
    expect(targetCell.textContent).toBe('🎻');
    expect(gameState.movesLeft).toBe(5);
    expect(gameState.isResolving).toBe(false);
    expect(autoSaveProgress).not.toHaveBeenCalled();
  });

  test('resolves a match: scores it, updates objectives, saves, and clears isResolving', async () => {
    // 1st call: swapAndCheckMatch's post-swap check (must include source/target).
    // 2nd call: resolveAllMatchesAndDrop's initial read of the same matched state.
    // 3rd call: the re-check after the match is cleared and the board refilled.
    const group = [sourceCell, targetCell, makeCell('🎻')];
    boardMock.findMatches
      .mockReturnValueOnce([group])
      .mockReturnValueOnce([group])
      .mockReturnValueOnce([]);

    await trySwap(sourceCell, targetCell);

    // One valid move spent on the swap itself.
    expect(gameState.movesLeft).toBe(4);
    // 3-cell match = 10 points (game.js scoreForMatch), no combo (single wave, single group).
    expect(gameState.score).toBe(10);
    expect(gameState.totalScore).toBe(10);
    // Only 2 of the 3 matched cells actually carry the objective's symbol
    // ('🎻'); sourceCell was swapped to '🎻' as part of the match itself.
    expect(gameState.violinLeft).toBe(3);
    expect(boardMock.dropAndRefill).toHaveBeenCalled();
    expect(boardMock.hasPossibleMoves).toHaveBeenCalled();
    expect(autoSaveProgress).toHaveBeenCalled();
    expect(levelOutcomesMock.handleLevelWin).not.toHaveBeenCalled();
    expect(gameState.isResolving).toBe(false);
  });

  test('does nothing when already resolving, level complete, or the timer is inactive', async () => {
    gameState.isResolving = true;
    await trySwap(sourceCell, targetCell);
    expect(boardMock.findMatches).not.toHaveBeenCalled();

    gameState.isResolving = false;
    gameState.levelComplete = true;
    await trySwap(sourceCell, targetCell);
    expect(boardMock.findMatches).not.toHaveBeenCalled();

    gameState.levelComplete = false;
    gameState.timerActive = false;
    await trySwap(sourceCell, targetCell);
    expect(boardMock.findMatches).not.toHaveBeenCalled();
  });
});
