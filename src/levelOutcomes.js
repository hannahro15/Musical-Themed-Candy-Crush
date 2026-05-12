// levelOutcomes.js - Handles win/lose outcomes for levels
import { gameState } from './gameState.js';
import { LEVELS } from './levels.js';
import { saveHighScore, saveHighestLevel, clearGameProgress } from './storage.js';


export function handleLevelWin() {
    gameState.levelComplete = true;
    gameState.timerActive = false;
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    const isFinalLevel = gameState.level >= LEVELS.length;

    if (isFinalLevel) {
        const finalScore = gameState.totalScore + gameState.score;
        gameState.totalScore = finalScore;
        gameState.score = 0;

        saveHighScore(finalScore);
        saveHighestLevel(LEVELS.length);
        clearGameProgress();

        const congratsModal = document.getElementById('congratsModal');
        const congratsFinalScore = document.getElementById('congratsFinalScore');
        if (congratsFinalScore) {
            congratsFinalScore.textContent = `Total Score: ${finalScore.toLocaleString()}`;
        }
        if (congratsModal) congratsModal.classList.remove('hidden');
        return;
    }

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

    // If out of lives, show game over modal instead of restart modal
    if (gameState.lives <= 0) {
        const finalScore = gameState.totalScore + gameState.score;
        gameState.totalScore = finalScore;
        gameState.score = 0;

        // Save high score if it's a new record and clear saved progress
        saveHighScore(finalScore);
        clearGameProgress();

        const gameOverModal = document.getElementById('gameOverModal');
        const gameOverFinalScore = document.getElementById('gameOverFinalScore');
        if (gameOverFinalScore) {
            gameOverFinalScore.textContent = `Total Score: ${finalScore.toLocaleString()}`;
        }
        if (gameOverModal) {
            gameOverModal.classList.remove('hidden');
        }
        return;
    }

    // Toggle UI elements for restart
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
