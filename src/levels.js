// Level configuration and level-related logic
export const LEVELS = [
  {
    moves: 20,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 6 },
      { symbol: '🎹', label: 'piano', count: 6 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
  },
  {
    moves: 20,
    objectives: [
      { symbol: '🎸', label: 'guitar', count: 8 },
      { symbol: '🥁', label: 'drum', count: 8 },
      { symbol: '🎻', label: 'violin', count: 4 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
  },
  {
    moves: 20,
    objectives: [
      { symbol: '🎷', label: 'saxophone', count: 10 },
      { symbol: '🎺', label: 'trumpet', count: 10 },
      { symbol: '🎹', label: 'piano', count: 6 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
  },
  {
    moves: 20,
    objectives: [
      { symbol: '🎵', label: 'musicalNote', count: 12 },
      { symbol: '🎸', label: 'guitar', count: 8 },
      { symbol: '🥁', label: 'drum', count: 8 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
  },
  {
    moves: 35,
    objectives: [
      { symbol: '🎶', label: 'multipleNotes', count: 15 },
    ],
    timer: 120,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
  }
];

export function getLevelConfig(levelNum) {
  return LEVELS[levelNum - 1];
}
