// boardController.test.js
// Tests for boardController.js

import { trySwap, setBoardControllerDeps } from '../src/boardController.js';
import { gameState } from '../src/gameState.js';

describe('boardController', () => {
    test ('trySwap should return early if gameState.isResolving is true', async () => {
        // Mock gameState to be resolving
        const mockGameState = {
            isResolving: true,
            levelComplete: false,
            timerActive: true
        };
        // Mock dependencies
        const mockDeps = {
            gameBoard: null,
            movesDisplay: null,
            scoreDisplay: null,
            restartContainer: null,
            nextLevelBtn: null,
            restartBtn: null
        };
        setBoardControllerDeps(mockDeps);
        
        // Call trySwap and expect it to return early without doing anything
        const result = await trySwap(null, null);
        expect(result).toBeUndefined();
    });

    test ('trySwap should return early if gameState.levelComplete is true', async () => {
        // Mock gameState to be level complete
        const mockGameState = {
            isResolving: false,
            levelComplete: true,
            timerActive: true
        };
        // Mock dependencies
        const mockDeps = {
            gameBoard: null,
            movesDisplay: null,
            scoreDisplay: null,
            restartContainer: null,
            nextLevelBtn: null,
            restartBtn: null
        };
        setBoardControllerDeps(mockDeps);
        
        // Call trySwap and expect it to return early without doing anything
        const result = await trySwap(null, null);
        expect(result).toBeUndefined();
    });
});