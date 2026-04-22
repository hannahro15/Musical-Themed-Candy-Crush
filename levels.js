// Level configuration and level-related logic
export const LEVELS = [
  {
    moves: 15,
    objectives: [
      { symbol: '🎻', label: 'violin', count: 6 },
      { symbol: '🎹', label: 'piano', count: 6 }
    ],
    timer: 60,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
  },
  {
    moves: 20,
    objectives: [
      { symbol: '🎸', label: 'guitar', count: 8 },
      { symbol: '🥁', label: 'drum', count: 8 }
    ],
    timer: 75,
    winCondition: (state) => state.objectives.every(obj => state[obj.label + 'Left'] === 0),
  },
];

export function getLevelConfig(levelNum) {
  return LEVELS[levelNum - 1];
}
