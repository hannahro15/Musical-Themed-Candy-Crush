
# Musical-Themed Candy Crush

![Game Screenshot](images/game-screenshot.png)

A musical twist on the classic match-3 game! Match musical instrument symbols to complete level objectives.

**Play it here:** https://hannahro15.github.io/Musical-Themed-Candy-Crush/

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [How to Play](#how-to-play)
3. [Features](#features)
4. [Technologies Used](#technologies-used)
5. [Project Structure](#project-structure)
6. [Running Unit Tests](#running-unit-tests)
7. [Test Coverage](#test-coverage)
8. [Known Issues](#known-issues)
9. [Roadmap](#roadmap)
10. [Credits](#credits)

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/hannahro15/Musical-Themed-Candy-Crush.git
   ```
2. Open `index.html` in your web browser

---

## How to Play

1. Click **Play Game** to start Level 1.  
   - When you start a new game from the menu, your lives are reset to 5.
2. Match 3 or more of the same musical symbols by swapping adjacent tiles.
3. Complete the level objectives within the move and time limits.
4. The info bar above the game board (showing level, lives, moves, score, timer, and counters) is always visible during play.
5. If you run out of moves or time, you lose a life.
6. When all lives are lost, you are returned to the menu and can restart with 5 lives.
7. The Play button always starts Level 1 and resets all counters and lives.

Drag or swipe adjacent tiles to create matches:
- Match **3** tiles → 10 points
- Match **4** tiles → 20 points
- Match **5** tiles → 40 points
- Match at least 6 tiles - 60 points

---

## Features

- Musical-themed match-3 gameplay
- 5-lives system with automatic reset
- Move and timer limits
- Touch and mouse controls
- Responsive info bar above the board
- Modular JavaScript codebase for easy maintenance and extension
- Flexible level logic (easy to add new levels/objectives)

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (modular ES modules)
- [GitHub Copilot](https://github.com/features/copilot) for AI-assisted development

---

## Project Structure

```
Musical-Themed-Candy-Crush/
│
├── src/
│   ├── board.js
│   ├── constants.js
│   ├── events.js
│   ├── game.js
│   ├── gameState.js
│   ├── gameStatus.js
│   ├── interaction.js
│   ├── levels.js
│   ├── timer.js
│   ├── ui.js
│   └── script.js
│
├── __tests__/
│   ├── board.test.js
│   ├── constants.test.js
│   ├── events.test.js
│   ├── game.test.js
│   ├── gameState.test.js
│   ├── gameStatus.test.js
│   ├── interaction.test.js
│   ├── levels.test.js
│   ├── timer.test.js
│   └── ui.test.js
│
├── index.html
├── styles.css
├── README.md
└── ...
```

This modular structure makes it easy to maintain, test, and extend the game. Each file is responsible for a specific aspect of the game logic or UI.

---

## Running Unit Tests

1. Install dependencies (if not already):
   ```bash
   npm install --save-dev jest
   ```
2. Run all tests:
   ```bash
   npx jest
   ```
3. Add your test cases in the `__tests__` folder for each module.

---

## Test Coverage

This project uses [Jest](https://jestjs.io/) for unit and component testing. Test coverage is automatically generated after running the test suite.

- To generate a coverage report, run:
  ```bash
  npx jest --coverage
  ```
- The HTML coverage report can be found at:
  ```
  coverage/lcov-report/index.html
  ```
- Open this file in your browser to view detailed coverage by file and line.

Aim for high coverage, but focus on meaningful tests for game logic, UI, and edge cases. See the coverage report for areas needing more tests.

---

## Known Issues

- No E2E (end-to-end) tests yet; user flows are not fully automated.
- Accessibility features (keyboard navigation, ARIA labels, color contrast) have not yet been started.
- SEO improvements (meta tags, alt text, semantic HTML) have not yet been started.
- UI/UX could be further polished for mobile and desktop.

---

## Roadmap

- Add Cypress E2E tests for main user journeys and regression testing.
- Improve accessibility: keyboard navigation, ARIA labels, color contrast.
- Enhance UI/UX: animations, transitions, and responsive design.
- Complete SEO improvements for better discoverability.
- Add more unit tests for uncovered logic, edge cases, and complex interactions (see coverage report for details).
- Increase integration test coverage for module interactions.
- Gather user feedback and iterate on gameplay and usability.

---

## Credits

Developed by Hannah Olbrich (solo project).
Emoji icons from [Unicode](https://unicode.org/emoji/).
AI-assisted development with GitHub Copilot.


