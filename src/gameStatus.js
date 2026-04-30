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
    console.log('[handleLevelLose] called', { restartContainer, restartBtn, nextLevelBtn });
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
        console.log('[handleLevelLose] restartContainer .hidden removed:', !restartContainer.classList.contains('hidden'));
    } else {
        console.warn('[handleLevelLose] restartContainer is null/undefined');
    }
    if (restartBtn) {
        restartBtn.classList.remove('hidden');
        console.log('[handleLevelLose] restartBtn .hidden removed:', !restartBtn.classList.contains('hidden'));
    } else {
        console.warn('[handleLevelLose] restartBtn is null/undefined');
    }
    if (nextLevelBtn) {
        nextLevelBtn.classList.add('hidden');
        console.log('[handleLevelLose] nextLevelBtn .hidden added:', nextLevelBtn.classList.contains('hidden'));
    } else {
        console.warn('[handleLevelLose] nextLevelBtn is null/undefined');
    }
}
