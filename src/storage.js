// storage.js - localStorage utilities for game data persistence

const STORAGE_KEY = 'musicalMatchSaga';
const LEADERBOARD_MAX_ENTRIES = 10;

export function getHighScore() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.highScore || 0;
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return 0;
}

export function saveHighScore(score) {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : {};
    
    // Only update if new score is higher
    if (score > (parsed.highScore || 0)) {
      parsed.highScore = score;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return true; // Indicates new high score
    }
  } catch (e) {
    console.error('Error writing to localStorage:', e);
  }
  return false;
}

export function getHighestLevel() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.highestLevel || 0;
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return 0;
}

export function saveHighestLevel(level) {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : {};
    
    // Only update if new level is higher
    if (level > (parsed.highestLevel || 0)) {
      parsed.highestLevel = level;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return true;
    }
  } catch (e) {
    console.error('Error writing to localStorage:', e);
  }
  return false;
}

export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
}

export function saveGameProgress(gameState, boardState) {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : {};
    
    parsed.savedProgress = {
      level: gameState.level,
      lives: gameState.lives,
      score: gameState.score,
      totalScore: gameState.totalScore,
      movesLeft: gameState.movesLeft,
      timer: gameState.timer,
      boardState: boardState,
      timestamp: Date.now()
    };
    
    // Save objective counters (e.g., 🎵Left, 🎸Left, etc.)
    const objectives = {};
    for (const key in gameState) {
      if (key.endsWith('Left')) {
        objectives[key] = gameState[key];
      }
    }
    parsed.savedProgress.objectives = objectives;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return true;
  } catch (e) {
    console.error('Error saving game progress:', e);
  }
  return false;
}

export function loadGameProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.savedProgress || null;
    }
  } catch (e) {
    console.error('Error loading game progress:', e);
  }
  return null;
}

export function clearGameProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      delete parsed.savedProgress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return true;
    }
  } catch (e) {
    console.error('Error clearing game progress:', e);
  }
  return false;
}

/**
 * Returns the leaderboard array, sorted by score descending.
 * Each entry: { score, level, date }
 */
export function getLeaderboard() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.leaderboard || [];
    }
  } catch (e) {
    console.error('Error reading leaderboard:', e);
  }
  return [];
}

/**
 * Adds a new entry to the leaderboard, keeps only top LEADERBOARD_MAX_ENTRIES scores.
 * @param {number} score
 * @param {number} level - highest level reached
 * @returns {number} rank (1-based) of the new entry, or -1 if not in top list
 */
export function addLeaderboardEntry(score, level) {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : {};
    const board = parsed.leaderboard || [];

    const entry = { score, level, date: new Date().toLocaleDateString() };
    board.push(entry);
    board.sort((a, b) => b.score - a.score);

    const rank = board.findIndex(e => e === entry) + 1;
    parsed.leaderboard = board.slice(0, LEADERBOARD_MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return rank <= LEADERBOARD_MAX_ENTRIES ? rank : -1;
  } catch (e) {
    console.error('Error saving leaderboard entry:', e);
  }
  return -1;
}
