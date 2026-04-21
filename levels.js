// Level configuration and level-related logic
export const LEVELS = [
  {
    moves: 15,
    violins: 6,
    pianos: 6,
    timer: 60,
    winCondition: (state) => state.violinsLeft === 0 && state.pianosLeft === 0,
  },
  // Example for a future level:
  // {
  //   moves: 20,
  //   scoreTarget: 200,
  //   timer: 45,
  //   winCondition: (state) => state.score >= 200,
  // },
];

export function getLevelConfig(levelNum) {
  return LEVELS[levelNum - 1];
}
