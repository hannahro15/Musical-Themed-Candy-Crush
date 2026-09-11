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
    totalScoreDisplay.textContent = `Total Score: ${totalScore}`;
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
  if (!timerDisplay) return;

  timerDisplay.textContent = `Time: ${timer}s`;
  if (timerDisplay.classList) {
    timerDisplay.classList.toggle('low-time', timer <= 10 && timer > 0);
  }
}
