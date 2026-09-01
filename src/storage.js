// storage.js - localStorage utilities for game data persistence
import { isObjectiveKey } from './gameState.js';

const STORAGE_KEY = 'musicalMatchSaga';

function readStore() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return {};
  }
}

function writeStore(parsed) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return true;
  } catch (e) {
    console.error('Error writing to localStorage:', e);
    return false;
  }
}

export function getHighScore() {
  return readStore().highScore || 0;
}

export function saveHighScore(score) {
  const parsed = readStore();

  // Only update if new score is higher
  if (score > (parsed.highScore || 0)) {
    parsed.highScore = score;
    return writeStore(parsed); // true indicates new high score
  }
  return false;
}

export function getHighestLevel() {
  return readStore().highestLevel || 0;
}

export function saveHighestLevel(level) {
  const parsed = readStore();

  // Only update if new level is higher
  if (level > (parsed.highestLevel || 0)) {
    parsed.highestLevel = level;
    return writeStore(parsed);
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
  const parsed = readStore();

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

  // Save objective counters (e.g., violinLeft, pianoLeft, etc.)
  const objectives = {};
  for (const key in gameState) {
    if (isObjectiveKey(key)) {
      objectives[key] = gameState[key];
    }
  }
  parsed.savedProgress.objectives = objectives;

  return writeStore(parsed);
}

export function loadGameProgress() {
  return readStore().savedProgress || null;
}

export function clearGameProgress() {
  const parsed = readStore();
  if (parsed.savedProgress) {
    delete parsed.savedProgress;
    return writeStore(parsed);
  }
  return false;
}
