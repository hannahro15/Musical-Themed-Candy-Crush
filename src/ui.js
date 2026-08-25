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

/**
 * Renders leaderboard entries into the leaderboard list element.
 * Shows the section if entries exist, hides it otherwise.
 * @param {Array<{score: number, level: number, date: string}>} entries
 */
export function renderLeaderboard(entries) {
  const section = document.getElementById('leaderboardSection');
  const list = document.getElementById('leaderboardList');
  if (!section || !list) return;

  if (!entries || entries.length === 0) {
    section.classList.add('hidden');
    return;
  }

  list.innerHTML = '';
  entries.forEach((entry, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
    const li = document.createElement('li');
    li.className = 'leaderboard-entry';

    const rankSpan = document.createElement('span');
    rankSpan.className = 'leaderboard-rank';
    rankSpan.textContent = medal;

    const scoreSpan = document.createElement('span');
    scoreSpan.className = 'leaderboard-score';
    scoreSpan.textContent = Number(entry.score).toLocaleString();

    const metaSpan = document.createElement('span');
    metaSpan.className = 'leaderboard-meta';
    metaSpan.textContent = `Lvl ${Number(entry.level)} \u2022 ${String(entry.date)}`;

    li.appendChild(rankSpan);
    li.appendChild(scoreSpan);
    li.appendChild(metaSpan);
    list.appendChild(li);
  });

  section.classList.remove('hidden');
}
