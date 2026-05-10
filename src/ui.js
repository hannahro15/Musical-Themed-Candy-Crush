export function showMenuPage(heading, subtitle, menu, gameBoard, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer) {
  const elementsToShow = [heading, subtitle, menu];
  const elementsToHide = [
    gameBoard,
    movesDisplay,
    scoreDisplay,
    timerDisplay,
    livesDisplay,
    restartContainer,
    document.getElementById('game-board-container'),
    document.getElementById('score-moves-wrapper'),
    document.getElementById('levelDisplay'),
    document.getElementById('totalScoreDisplay')
  ];

  elementsToShow.forEach(el => el?.classList.remove('hidden'));
  elementsToHide.forEach(el => el?.classList.add('hidden'));
}

export function updateLivesDisplay(livesDisplay, lives) {
  livesDisplay.textContent = `❤️ Lives: ${lives}`;
}

export function updateMovesDisplay(movesDisplay, movesLeft) {
  movesDisplay.textContent = `Moves: ${movesLeft}`;
}

export function updateScoreDisplay(scoreDisplay, score) {
  scoreDisplay.textContent = `Score: ${score}`;
}

export function updateTotalScoreDisplay(totalScoreDisplay, totalScore) {
  if (totalScoreDisplay) {
    totalScoreDisplay.textContent = `Total: ${totalScore}`;
  }
}

export function updateHighScoreDisplay(highScoreDisplay, highScore) {
  if (highScoreDisplay) {
    highScoreDisplay.textContent = `Best Score: ${highScore}`;
    highScoreDisplay.classList.remove('hidden');
  }
}


export function updateObjectiveCounters(objectiveCountersContainer, objectives, state) {
  if (!objectiveCountersContainer) return;
  objectiveCountersContainer.innerHTML = objectives
    .map(obj => {
      const left = state[obj.label + 'Left'] ?? obj.count;
      return `<span>${obj.symbol}: ${left}</span>`;
    })
    .join('');
}

export function updateTimerDisplay(timerDisplay, timer) {
  timerDisplay.textContent = `Time: ${timer}s`;
}

// Add these UI functions for testing and export them
export function updateScore(score) {
  const scoreElement = document.getElementById('score');
  if (scoreElement) scoreElement.textContent = String(score);
}

export function updateLevel(level) {
  const levelElement = document.getElementById('level');
  if (levelElement) levelElement.textContent = String(level);
}

export function updateTimer(timer) {
  const timerElement = document.getElementById('timer');
  if (timerElement) timerElement.textContent = String(timer);
}

export function showGameOver() {
  const gameOverElement = document.getElementById('game-over');
  if (gameOverElement) gameOverElement.classList.remove('hidden');
}

export function hideGameOver() {
  const gameOverElement = document.getElementById('game-over');
  if (gameOverElement) gameOverElement.classList.add('hidden');
}
