// UI helper functions
export function showMenuPage(heading, menu, gameBoard, level1Counters, movesDisplay, scoreDisplay, timerDisplay, livesDisplay, restartContainer) {
  heading.classList.remove('hidden');
  menu.classList.remove('hidden');
  document.getElementById('game-board-container').classList.add('hidden');
  gameBoard.classList.add('hidden');
  document.getElementById('score-moves-wrapper').classList.add('hidden');
  level1Counters.classList.add('hidden');
  movesDisplay.classList.add('hidden');
  scoreDisplay.classList.add('hidden');
  timerDisplay.classList.add('hidden');
  document.getElementById('levelDisplay').classList.add('hidden');
  livesDisplay.classList.add('hidden');
  restartContainer.classList.add('hidden');
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

export function updateLevel1Counters(violinCounter, pianoCounter, violinsLeft, pianosLeft) {
  violinCounter.textContent = `🎻: ${violinsLeft}`;
  pianoCounter.textContent = `🎹: ${pianosLeft}`;
}

export function updateTimerDisplay(timerDisplay, timer) {
  timerDisplay.textContent = `Time: ${timer}s`;
}
