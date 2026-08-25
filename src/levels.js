// Level configuration and level-related logic
export const LEVELS = [
  // Level 1: Intro - two objectives, simple
  {
    moves: 15,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 5 },
      { symbol: '🎹', label: 'piano', count: 5 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎺', '🥁', '🎷', '🎵'],
    note: 'Intro level - easy start'
  },

  // Level 2: Three objectives, moderate
  {
    moves: 16,
    objectives: [
      { symbol: '🎺', label: 'trumpet', count: 6 },
      { symbol: '🥁', label: 'drum', count: 4 },
      { symbol: '🎻', label: 'violin', count: 4 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎹', '🎷', '🎵'],
    note: 'Three objectives introduced'
  },

  // Level 3: Three objectives, moderate
  {
    moves: 16,
    objectives: [
      { symbol: '🎷', label: 'saxophone', count: 8 },
      { symbol: '🎺', label: 'trumpet', count: 6 },
      { symbol: '🎹', label: 'piano', count: 5 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🥁', '🎵'],
    note: 'Higher counts introduced'
  },

  // Level 4: Three objectives, new symbol
  {
    moves: 18,
    objectives: [
      { symbol: '🎵', label: 'musicalNote', count: 8 },
      { symbol: '🎷', label: 'saxophone', count: 6 },
      { symbol: '🥁', label: 'drum', count: 6 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎹', '🎺'],
    note: 'Musical note introduced as objective'
  },

  // Level 5: Three objectives, higher counts
  {
    moves: 20,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 8 },
      { symbol: '🎹', label: 'piano', count: 8 },
      { symbol: '🎺', label: 'trumpet', count: 6 }
    ],
    timer: 70,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎷', '🥁', '🎵'],
    note: 'Timer tightens slightly'
  },

  // Level 6: Three objectives, distractor symbols
  {
    moves: 20,
    objectives: [
      { symbol: '🎺', label: 'trumpet', count: 10 },
      { symbol: '🥁', label: 'drum', count: 8 },
      { symbol: '🎵', label: 'musicalNote', count: 6 }
    ],
    timer: 70,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎹', '🎷'],
    note: 'Higher counts, more distractors'
  },

  // Level 7: Three objectives, lower moves
  {
    moves: 22,
    objectives: [
      { symbol: '🎷', label: 'saxophone', count: 10 },
      { symbol: '🎵', label: 'musicalNote', count: 8 },
      { symbol: '🥁', label: 'drum', count: 6 }
    ],
    timer: 65,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎹', '🎺'],
    note: 'Timer getting tighter'
  },

  // Level 8: Timed rush with distractors
  {
    moves: 24,
    objectives: [
      { symbol: '🎹', label: 'piano', count: 10 },
      { symbol: '🎻', label: 'violin', count: 10 },
      { symbol: '🎺', label: 'trumpet', count: 8 }
    ],
    timer: 60,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎷', '🥁', '🎵'],
    note: 'Short timer, more distractors, fast-paced'
  },

  // Level 9: Four objectives
  {
    moves: 26,
    objectives: [
      { symbol: '🎷', label: 'saxophone', count: 12 },
      { symbol: '🥁', label: 'drum', count: 10 },
      { symbol: '🎵', label: 'musicalNote', count: 8 },
      { symbol: '🎺', label: 'trumpet', count: 6 }
    ],
    timer: 55,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: [],
    comboChallenge: true,
    note: 'Four objectives, tight timer'
  },

  // Level 10: Five objectives, ultimate challenge
  {
    moves: 28,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 12 },
      { symbol: '🎹', label: 'piano', count: 10 },
      { symbol: '🎷', label: 'saxophone', count: 8 },
      { symbol: '🥁', label: 'drum', count: 8 },
      { symbol: '🎵', label: 'musicalNote', count: 6 }
    ],
    timer: 50,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: [],
    comboChallenge: true,
    note: 'Five objectives - end of act one!'
  },

  // Level 11: Fresh start, two objectives, easier
  {
    moves: 25,
    objectives: [
      { symbol: '🎺', label: 'trumpet', count: 10 },
      { symbol: '🎵', label: 'musicalNote', count: 8 }
    ],
    timer: 90,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎹', '🎷', '🥁'],
    note: 'Act two begins - breathing room before ramp'
  },

  // Level 12: Three objectives
  {
    moves: 26,
    objectives: [
      { symbol: '🎹', label: 'piano', count: 12 },
      { symbol: '🥁', label: 'drum', count: 10 },
      { symbol: '🎺', label: 'trumpet', count: 6 }
    ],
    timer: 85,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎷', '🎵'],
    note: 'Three objectives, higher counts'
  },

  // Level 13: Three objectives
  {
    moves: 28,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 12 },
      { symbol: '🎵', label: 'musicalNote', count: 10 },
      { symbol: '🥁', label: 'drum', count: 8 }
    ],
    timer: 85,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎹', '🎺', '🎷'],
    note: 'Difficulty ramping again'
  },

  // Level 14: Four objectives
  {
    moves: 28,
    objectives: [
      { symbol: '🎹', label: 'piano', count: 12 },
      { symbol: '🎺', label: 'trumpet', count: 10 },
      { symbol: '🎵', label: 'musicalNote', count: 8 },
      { symbol: '🥁', label: 'drum', count: 6 }
    ],
    timer: 80,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎷'],
    note: 'Four objectives return'
  },

  // Level 15: Three objectives, higher counts
  {
    moves: 30,
    objectives: [
      { symbol: '🎷', label: 'saxophone', count: 14 },
      { symbol: '🎻', label: 'violin', count: 10 },
      { symbol: '🥁', label: 'drum', count: 8 }
    ],
    timer: 80,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎹', '🎺', '🎵'],
    note: 'High saxophone count challenge'
  },

  // Level 16: Four objectives
  {
    moves: 30,
    objectives: [
      { symbol: '🎹', label: 'piano', count: 12 },
      { symbol: '🎵', label: 'musicalNote', count: 12 },
      { symbol: '🎻', label: 'violin', count: 10 },
      { symbol: '🥁', label: 'drum', count: 8 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎺', '🎷'],
    note: 'Four objectives, balanced counts'
  },

  // Level 17: Four objectives, tighter
  {
    moves: 32,
    objectives: [
      { symbol: '🎺', label: 'trumpet', count: 14 },
      { symbol: '🎷', label: 'saxophone', count: 12 },
      { symbol: '🎵', label: 'musicalNote', count: 10 },
      { symbol: '🎹', label: 'piano', count: 8 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🥁'],
    note: 'High counts across four objectives'
  },

  // Level 18: Five objectives
  {
    moves: 32,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 14 },
      { symbol: '🥁', label: 'drum', count: 12 },
      { symbol: '🎺', label: 'trumpet', count: 10 },
      { symbol: '🎵', label: 'musicalNote', count: 8 },
      { symbol: '🎹', label: 'piano', count: 6 }
    ],
    timer: 70,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎷'],
    note: 'Five objectives, tight timer'
  },

  // Level 19: Five objectives, very tight
  {
    moves: 34,
    objectives: [
      { symbol: '🎷', label: 'saxophone', count: 14 },
      { symbol: '🎹', label: 'piano', count: 14 },
      { symbol: '🥁', label: 'drum', count: 12 },
      { symbol: '🎺', label: 'trumpet', count: 10 },
      { symbol: '🎵', label: 'musicalNote', count: 8 }
    ],
    timer: 65,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻'],
    comboChallenge: true,
    note: 'Five objectives, very tight timer'
  },

  // Level 20: Ultimate - all six instruments
  {
    moves: 35,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 14 },
      { symbol: '🎹', label: 'piano', count: 14 },
      { symbol: '🎺', label: 'trumpet', count: 12 },
      { symbol: '🥁', label: 'drum', count: 10 },
      { symbol: '🎷', label: 'saxophone', count: 10 },
      { symbol: '🎵', label: 'musicalNote', count: 8 }
    ],
    timer: 60,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: [],
    comboChallenge: true,
    note: 'All six instruments - the grand finale!'
  },

  // Level 21: Encore - three objectives, very high counts
  {
    moves: 28,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 16 },
      { symbol: '🎹', label: 'piano', count: 14 },
      { symbol: '🎷', label: 'saxophone', count: 12 }
    ],
    timer: 70,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎺', '🥁', '🎵'],
    comboChallenge: true,
    note: 'Encore - high counts, three objectives'
  },

  // Level 22: Speed Run - four objectives, tight timer
  {
    moves: 30,
    objectives: [
      { symbol: '🎺', label: 'trumpet', count: 12 },
      { symbol: '🥁', label: 'drum', count: 12 },
      { symbol: '🎵', label: 'musicalNote', count: 10 },
      { symbol: '🎷', label: 'saxophone', count: 10 }
    ],
    timer: 55,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎹'],
    comboChallenge: true,
    note: 'Speed run - four objectives, tight timer'
  },

  // Level 23: Precision - five objectives, limited moves
  {
    moves: 26,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 10 },
      { symbol: '🎹', label: 'piano', count: 10 },
      { symbol: '🎺', label: 'trumpet', count: 8 },
      { symbol: '🥁', label: 'drum', count: 8 },
      { symbol: '🎷', label: 'saxophone', count: 6 }
    ],
    timer: 70,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎵'],
    comboChallenge: true,
    note: 'Precision - five objectives, limited moves'
  },

  // Level 24: Double Down - two objectives, very high counts
  {
    moves: 32,
    objectives: [
      { symbol: '🎵', label: 'musicalNote', count: 20 },
      { symbol: '🥁', label: 'drum', count: 18 }
    ],
    timer: 65,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🎹', '🎺', '🎷'],
    comboChallenge: true,
    note: 'Double down - two objectives, massive counts'
  },

  // Level 25: Rush - six objectives, very tight timer
  {
    moves: 36,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 10 },
      { symbol: '🎹', label: 'piano', count: 10 },
      { symbol: '🎺', label: 'trumpet', count: 8 },
      { symbol: '🥁', label: 'drum', count: 8 },
      { symbol: '🎷', label: 'saxophone', count: 8 },
      { symbol: '🎵', label: 'musicalNote', count: 6 }
    ],
    timer: 50,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: [],
    comboChallenge: true,
    note: 'Rush - all six instruments, very tight timer'
  },

  // Level 26: Blitz - four objectives, minimal moves
  {
    moves: 24,
    objectives: [
      { symbol: '🎹', label: 'piano', count: 14 },
      { symbol: '🎺', label: 'trumpet', count: 12 },
      { symbol: '🎵', label: 'musicalNote', count: 12 },
      { symbol: '🎷', label: 'saxophone', count: 10 }
    ],
    timer: 60,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎻', '🥁'],
    comboChallenge: true,
    note: 'Blitz - four objectives, minimal moves'
  },

  // Level 27: Marathon - five objectives, high counts, generous moves
  {
    moves: 40,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 16 },
      { symbol: '🎹', label: 'piano', count: 14 },
      { symbol: '🎷', label: 'saxophone', count: 14 },
      { symbol: '🎺', label: 'trumpet', count: 12 },
      { symbol: '🥁', label: 'drum', count: 10 }
    ],
    timer: 55,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: ['🎵'],
    comboChallenge: true,
    note: 'Marathon - five objectives, high counts'
  },

  // Level 28: Gauntlet - six objectives, fewest moves yet
  {
    moves: 30,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 10 },
      { symbol: '🎹', label: 'piano', count: 10 },
      { symbol: '🎺', label: 'trumpet', count: 10 },
      { symbol: '🥁', label: 'drum', count: 10 },
      { symbol: '🎷', label: 'saxophone', count: 10 },
      { symbol: '🎵', label: 'musicalNote', count: 10 }
    ],
    timer: 55,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: [],
    comboChallenge: true,
    note: 'Gauntlet - balanced six instruments, tight limits'
  },

  // Level 29: Crescendo - six objectives, escalating counts
  {
    moves: 38,
    objectives: [
      { symbol: '🎵', label: 'musicalNote', count: 16 },
      { symbol: '🎷', label: 'saxophone', count: 14 },
      { symbol: '🎺', label: 'trumpet', count: 14 },
      { symbol: '🥁', label: 'drum', count: 12 },
      { symbol: '🎹', label: 'piano', count: 12 },
      { symbol: '🎻', label: 'violin', count: 10 }
    ],
    timer: 50,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: [],
    comboChallenge: true,
    note: 'Crescendo - escalating six-instrument challenge'
  },

  // Level 30: Magnum Opus - all six, maximum counts, ultimate test
  {
    moves: 45,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 18 },
      { symbol: '🎹', label: 'piano', count: 18 },
      { symbol: '🎺', label: 'trumpet', count: 16 },
      { symbol: '🥁', label: 'drum', count: 14 },
      { symbol: '🎷', label: 'saxophone', count: 14 },
      { symbol: '🎵', label: 'musicalNote', count: 12 }
    ],
    timer: 45,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
    distractors: [],
    comboChallenge: true,
    note: 'Magnum Opus - the ultimate 30-level finale!'
  }
];

export function getLevelConfig(levelNum) {
  return LEVELS[levelNum - 1];
}
