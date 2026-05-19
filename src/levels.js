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
    distractors: ['🎺', '🥁', '🎷', '🎵']
  },
  {
    moves: 20,
    objectives: [
      { symbol: '🎺', label: 'trumpet', count: 8 },
      { symbol: '🥁', label: 'drum', count: 8 },
      { symbol: '🎻', label: 'violin', count: 4 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎹', '🎷', '🎵']
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
    distractors: ['🎻', '🥁', '🎵']
  },
  {
    moves: 20,
    objectives: [
      { symbol: '🎵', label: 'musicalNote', count: 12 },
      { symbol: '🎷', label: 'saxophone', count: 8 },
      { symbol: '🥁', label: 'drum', count: 8 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎹', '🎺']
  },
  // Level 4: Multi-objective, higher counts
  {
    moves: 32,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 10 },
      { symbol: '🎹', label: 'piano', count: 10 },
      { symbol: '🎷', label: 'saxophone', count: 8 }
    ],
    timer: 110,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎺', '🥁', '🎵']
  },
  // Level 5: Distractor symbol, higher counts
  {
    moves: 34,
    objectives: [
      { symbol: '🎺', label: 'trumpet', count: 12 },
      { symbol: '🥁', label: 'drum', count: 12 }
    ],
    timer: 110,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎵', '🎻', '🎹', '🎷']
  },
  // Level 6: Three objectives, lower moves
  {
    moves: 28,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 8 },
      { symbol: '🎹', label: 'piano', count: 8 },
      { symbol: '🎷', label: 'saxophone', count: 8 }
    ],
    timer: 100,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🥁', '🎵', '🎺']
  },
  // Level 7: High count, two objectives
  {
    moves: 36,
    objectives: [
      { symbol: '🎺', label: 'trumpet', count: 18 },
      { symbol: '🎵', label: 'musicalNote', count: 10 }
    ],
    timer: 120,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎹', '🥁', '🎷']
  },

  // Level 8: Combo challenge (all symbols, higher counts)
  {
    moves: 40,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 10 },
      { symbol: '🎹', label: 'piano', count: 10 },
      { symbol: '🎺', label: 'trumpet', count: 10 },
      { symbol: '🥁', label: 'drum', count: 10 },
      { symbol: '🎷', label: 'saxophone', count: 10 },
      { symbol: '🎵', label: 'musicalNote', count: 10 }
    ],
    timer: 140,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    comboChallenge: true,
    distractors: []
  },

  // Level 9: Timed rush with distractors
  {
    moves: 24,
    objectives: [
      { symbol: '🎷', label: 'saxophone', count: 12 },
      { symbol: '🎵', label: 'musicalNote', count: 12 },
      { symbol: '🥁', label: 'drum', count: 8 }
    ],
    timer: 60,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎹', '🎺'],
    note: 'Short timer, more distractors, fast-paced.'
  },

  // Level 10: Ultimate musical mix
  {
    moves: 45,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 12 },
      { symbol: '🎹', label: 'piano', count: 12 },
      { symbol: '🎺', label: 'trumpet', count: 12 },
      { symbol: '🥁', label: 'drum', count: 12 },
      { symbol: '🎷', label: 'saxophone', count: 12 },
      { symbol: '🎵', label: 'musicalNote', count: 12 }
    ],
    timer: 160,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: [],
    comboChallenge: true,
    note: 'All symbols, high counts, all distractors. The ultimate test!'
  }
];

export function getLevelConfig(levelNum) {
  return LEVELS[levelNum - 1];
}
