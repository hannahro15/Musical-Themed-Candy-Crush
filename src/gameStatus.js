// gameStatus.js - Handles win/lose logic for the game
import { gameState } from './gameState.js';


export function handleLevelWin() {
    gameState.levelComplete = true;
    gameState.timerActive = false;
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    // Show next level modal and ensure Next Level button is visible
    const nextLevelModal = document.getElementById('nextLevelModal');
    const confirmNextLevelBtn = document.getElementById('confirmNextLevelBtn');
    if (nextLevelModal) nextLevelModal.classList.remove('hidden');
    if (confirmNextLevelBtn) confirmNextLevelBtn.classList.remove('hidden');
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
    if (restartContainer) {
        restartContainer.classList.remove('hidden');
    }
    if (restartBtn) {
        restartBtn.classList.remove('hidden');
    }
    if (nextLevelBtn) {
        nextLevelBtn.classList.add('hidden');
    }
}
