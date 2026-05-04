// UI helper functions
export function showMenuPage(heading, subtitle, menu, gameBoard, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer) {
  heading.classList.remove('hidden');
  if (subtitle) subtitle.classList.remove('hidden');
  menu.classList.remove('hidden');
  document.getElementById('game-board-container').classList.add('hidden');
  gameBoard.classList.add('hidden');
  document.getElementById('score-moves-wrapper').classList.add('hidden');
  movesDisplay.classList.add('hidden');
  scoreDisplay.classList.add('hidden');
  timerDisplay.classList.add('hidden');
  document.getElementById('levelDisplay').classList.add('hidden');
  livesDisplay.classList.add('hidden');
  if (restartContainer) restartContainer.classList.add('hidden');
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


// Dynamically update counters for any objectives
export function updateObjectiveCounters(objectiveCountersContainer, objectives, state) {
  if (!objectiveCountersContainer) return;
  objectiveCountersContainer.innerHTML = '';
  objectives.forEach(obj => {
    const span = document.createElement('span');
    const left = state[obj.label + 'Left'] ?? obj.count;
    span.textContent = `${obj.symbol}: ${left}`;
    objectiveCountersContainer.appendChild(span);
  });
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
