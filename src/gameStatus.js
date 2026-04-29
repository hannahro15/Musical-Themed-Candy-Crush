// gameStatus.js - Handles win/lose logic for the game
import { gameState } from './gameState.js';


export function handleLevelWin() {
    gameState.levelComplete = true;
    gameState.timerActive = false;
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    // Show next level modal
    const nextLevelModal = document.getElementById('nextLevelModal');
    if (nextLevelModal) nextLevelModal.classList.remove('hidden');
}

export function handleLevelLose(restartContainer, restartBtn, nextLevelBtn) {
    gameState.levelComplete = true;
    gameState.timerActive = false;
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);

    // Decrement lives and update display
    if (Number.isFinite(gameState.lives) && gameState.lives > 0) {
        gameState.lives--;
        const livesDisplay = document.getElementById('livesDisplay');
        if (livesDisplay) {
            livesDisplay.textContent = `❤️ Lives: ${gameState.lives}`;
        }
    }

    // Toggle UI elements
    restartContainer?.classList.remove('hidden');
    restartBtn?.classList.remove('hidden');
    nextLevelBtn?.classList.add('hidden');
}
