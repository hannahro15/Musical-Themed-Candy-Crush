// storage.js - localStorage utilities for game data persistence

const STORAGE_KEY = 'musicalMatchSaga';

function readStorageData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function writeStorageData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getHighScore() {
  try {
    return readStorageData().highScore || 0;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return 0;
}

export function saveHighScore(score) {
  try {
    const parsed = readStorageData();
    
    // Only update if new score is higher
    if (score > (parsed.highScore || 0)) {
      parsed.highScore = score;
      writeStorageData(parsed);
      return true; // Indicates new high score
    }
  } catch (e) {
    console.error('Error writing to localStorage:', e);
  }
  return false;
}

export function getHighestLevel() {
  try {
    return readStorageData().highestLevel || 0;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return 0;
}

export function saveHighestLevel(level) {
  try {
    const parsed = readStorageData();
    
    // Only update if new level is higher
    if (level > (parsed.highestLevel || 0)) {
      parsed.highestLevel = level;
      writeStorageData(parsed);
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
    const parsed = readStorageData();
    
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
    
    writeStorageData(parsed);
    return true;
  } catch (e) {
    console.error('Error saving game progress:', e);
  }
  return false;
}

export function loadGameProgress() {
  try {
    return readStorageData().savedProgress || null;
  } catch (e) {
    console.error('Error loading game progress:', e);
  }
  return null;
}

export function clearGameProgress() {
  try {
    const parsed = readStorageData();
    if (Object.keys(parsed).length > 0) {
      delete parsed.savedProgress;
      writeStorageData(parsed);
      return true;
    }
  } catch (e) {
    console.error('Error clearing game progress:', e);
  }
  return false;
}
