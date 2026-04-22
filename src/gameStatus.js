// gameStatus.js - Handles win/lose logic for the game
import { gameState } from './gameState.js';


export function handleLevelWin(restartContainer, nextLevelBtn, restartBtn) {
  gameState.levelComplete = true;
  gameState.timerActive = false;
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  if (restartContainer) restartContainer.classList.remove('hidden');
  if (nextLevelBtn) nextLevelBtn.classList.remove('hidden');
  if (restartBtn) restartBtn.classList.add('hidden'); // Hide restart button on win
}

export function handleLevelLose(restartContainer, restartBtn, nextLevelBtn) {
  gameState.levelComplete = true;
  gameState.timerActive = false;
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  // Decrement lives and update display
  if (typeof gameState.lives === 'number' && gameState.lives > 0) {
    gameState.lives -= 1;
    const livesDisplay = document.getElementById('livesDisplay');
    if (livesDisplay) livesDisplay.textContent = `❤️ Lives: ${gameState.lives}`;
  }
  // Show the restart container and button only on lose
  if (restartContainer) restartContainer.classList.remove('hidden');
  if (restartBtn) restartBtn.classList.remove('hidden');
  if (nextLevelBtn) nextLevelBtn.classList.add('hidden');
}
