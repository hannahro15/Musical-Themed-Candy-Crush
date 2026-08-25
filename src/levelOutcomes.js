// levelOutcomes.js - Handles win/lose outcomes for levels
import { gameState } from './gameState.js';
import { LEVELS } from './levels.js';
import { saveHighScore, saveHighestLevel, clearGameProgress } from './storage.js';
import { announce, showElement, hideElement } from './utils.js';


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
        showElement(congratsModal);
        announce(`Congratulations! You completed all levels with a total score of ${finalScore.toLocaleString()}.`);
        return;
    }

    // Show next level modal and ensure Next Level button is visible
    const nextLevelModal = document.getElementById('nextLevelModal');
    const confirmNextLevelBtn = document.getElementById('confirmNextLevelBtn');
    showElement(nextLevelModal);
    showElement(confirmNextLevelBtn);
    announce(`Level ${gameState.level} complete! Ready for the next challenge.`);
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
        showElement(gameOverModal);
        announce(`Game over. You've run out of lives. Total score: ${finalScore.toLocaleString()}.`);
        return;
    }

    // Toggle UI elements for restart
    showElement(restartContainer);
    showElement(restartBtn);
    hideElement(nextLevelBtn);
    announce(`Level failed. You have ${gameState.lives} ${gameState.lives === 1 ? 'life' : 'lives'} remaining.`);
}
