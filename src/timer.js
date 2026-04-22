// timer.js - Handles timer logic for the game
import { updateTimerDisplay } from './ui.js';
import { INITIAL_LIVES } from './constants.js';

export function startTimer(gameState, timerDisplay, handleLevelLose) {
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(() => {
    if (!gameState.timerActive) return;
    gameState.timer--;
    updateTimerDisplay(timerDisplay, gameState.timer);
    if (gameState.timer <= 0) {
      gameState.timer = 0;
      updateTimerDisplay(timerDisplay, gameState.timer);
      clearInterval(gameState.timerInterval);
      gameState.timerActive = false;
      // Only trigger lose if moves are still above 0
      if (gameState.movesLeft > 0 && !gameState.levelComplete) {
        handleLevelLose();
      }
    }
  }, 1000);
}
