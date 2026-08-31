import {
    trySwap,
    setBoardControllerDeps,
    getComboLevel,
    getComboBonus,
    updateScoreAndObjectives,
    checkWinCondition,
    showScorePopup
} from '../src/boardController.js';
import { gameState } from '../src/gameState.js';

describe('boardController', () => {
    beforeEach(() => {
        gameState.isResolving = false;
        gameState.levelComplete = false;
        gameState.timerActive = true;

        setBoardControllerDeps({
            gameBoard: null,
            movesDisplay: null,
            scoreDisplay: null,
            restartContainer: null,
            nextLevelBtn: null,
            restartBtn: null
        });
    });

    test('trySwap returns early when resolving', async () => {
        gameState.isResolving = true;

        const result = await trySwap(null, null);

        expect(result).toBeUndefined();
    });

    test('trySwap returns early when level is complete', async () => {
        gameState.levelComplete = true;

        const result = await trySwap(null, null);

        expect(result).toBeUndefined();
    });

    test('trySwap returns early when timer is inactive', async () => {
        gameState.timerActive = false;

        const result = await trySwap(null, null);

        expect(result).toBeUndefined();
    });
});

describe('getComboLevel', () => {
    test('returns the match count when it exceeds the chain count', () => {
        expect(getComboLevel([[1], [2], [3]], 1)).toBe(3);
    });

    test('returns the chain count when it exceeds the match count', () => {
        expect(getComboLevel([[1]], 4)).toBe(4);
    });
});

describe('getComboBonus', () => {
    test('is zero for a single match with no chain', () => {
        expect(getComboBonus([[1]], 1)).toBe(0);
    });

    test('rewards multiple simultaneous matches', () => {
        expect(getComboBonus([[1], [2], [3]], 1)).toBe(40); // (3 - 1) * 20
    });

    test('rewards chained matches', () => {
        expect(getComboBonus([[1]], 3)).toBe(60); // 3 * 20
    });

    test('stacks the simultaneous-match and chain bonuses', () => {
        expect(getComboBonus([[1], [2]], 2)).toBe(20 + 40); // (2-1)*20 + 2*20
    });
});

describe('checkWinCondition', () => {
    test('is true when every objective is complete', () => {
        gameState.violinLeft = 0;
        gameState.pianoLeft = 0;
        const config = {
            objectives: [
                { label: 'violin', count: 5 },
                { label: 'piano', count: 5 }
            ]
        };
        expect(checkWinCondition(config)).toBe(true);
    });

    test('is false when any objective is incomplete', () => {
        gameState.violinLeft = 2;
        gameState.pianoLeft = 0;
        const config = {
            objectives: [
                { label: 'violin', count: 5 },
                { label: 'piano', count: 5 }
            ]
        };
        expect(checkWinCondition(config)).toBe(false);
    });
});

describe('updateScoreAndObjectives', () => {
    beforeEach(() => {
        gameState.score = 0;
        gameState.totalScore = 0;
        delete gameState.violinLeft;
        setBoardControllerDeps({
            scoreDisplay: document.createElement('div'),
            totalScoreDisplay: document.createElement('div')
        });
    });

    test('adds score to both the level score and running total', () => {
        updateScoreAndObjectives(30, {}, { objectives: [] });
        expect(gameState.score).toBe(30);
        expect(gameState.totalScore).toBe(30);
    });

    test('decrements objective counters by the matched amount, floored at zero', () => {
        gameState.violinLeft = 5;
        const config = { objectives: [{ label: 'violin', count: 5 }] };
        updateScoreAndObjectives(0, { violin: 2 }, config);
        expect(gameState.violinLeft).toBe(3);

        updateScoreAndObjectives(0, { violin: 10 }, config);
        expect(gameState.violinLeft).toBe(0);
    });
});

describe('showScorePopup', () => {
    let gameBoard;

    beforeEach(() => {
        gameBoard = document.createElement('div');
        document.body.appendChild(gameBoard);
        setBoardControllerDeps({ gameBoard });
    });

    afterEach(() => {
        gameBoard.remove();
    });

    test('does nothing without points or matched cells', () => {
        showScorePopup(0, [document.createElement('div')]);
        showScorePopup(10, []);
        expect(gameBoard.children.length).toBe(0);
    });

    test('renders a plain score popup', () => {
        const cell = document.createElement('div');
        showScorePopup(10, [cell]);
        expect(gameBoard.querySelector('.score-popup')).not.toBeNull();
        expect(gameBoard.querySelector('.score-popup').textContent).toBe('+10');
    });

    test('renders a combo popup with the combo label', () => {
        const cell = document.createElement('div');
        showScorePopup(40, [cell], 'combo', 3);
        const popup = gameBoard.querySelector('.combo-popup');
        expect(popup).not.toBeNull();
        expect(popup.textContent).toBe('Combo x3 +40');
    });
});