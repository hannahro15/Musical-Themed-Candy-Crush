// timer.js - Handles timer logic for the game
import { updateTimerDisplay } from './ui.js';
import { INITIAL_LIVES } from './constants.js';

export function startTimer(gameState, timerDisplay, handleLevelLose) {
    clearInterval(gameState.timerInterval);

    gameState.timerInterval = setInterval(() => {
        if (!gameState.timerActive) return;

        gameState.timer = Math.max(0, gameState.timer - 1);
        updateTimerDisplay(timerDisplay, gameState.timer);

        if (gameState.timer === 0) {
            clearInterval(gameState.timerInterval);
            gameState.timerActive = false;

            // Only trigger lose if moves are still above 0 and level not complete
            if (gameState.movesLeft > 0 && !gameState.levelComplete) {
                handleLevelLose();
            }
        }
    }, 1000);
}
