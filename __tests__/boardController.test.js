import { trySwap, setBoardControllerDeps } from '../src/boardController.js';
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