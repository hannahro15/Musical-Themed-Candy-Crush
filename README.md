
# Musical-Themed Candy Crush

![Game Screenshot](images/game-screenshot.png)

A musical twist on the classic match-3 game!
Match musical instrument symbols to complete level objectives.

---

**Note:** This is a solo project. Much of the game logic and code was generated with the help of AI (GitHub Copilot), especially the core mechanics and modular structure. The project was originally started by following a YouTube tutorial for a basic match-3 game, then heavily customised and extended with AI assistance.

---

Play it here: https://hannahro15.github.io/Musical-Themed-Candy-Crush/

# How to Play

1. Click **Play Game** to start Level 1.  
   - When you start a new game from the menu, your lives are reset to 5.
2. Match 3 or more of the same musical symbols by swapping adjacent tiles.
3. Complete the level objectives within the move and time limits.
4. The info bar above the game board (showing level, lives, moves, score, timer, and counters) is always visible during play.
5. If you run out of moves or time, you lose a life.
6. When all lives are lost, you are returned to the menu and can restart with 5 lives.
7. The Play button always starts Level 1 and resets all counters and lives.

 Drag or swipe adjacent tiles to create matches

- Match **3** tiles → 10 points
- Match **4** tiles → 20 points
- Match **5** tiles → 40 points
- Match at least 6 tiles - 60 points


## Features

- Musical-themed match-3 gameplay
- 5-lives system with automatic reset
- Move and timer limits
- Touch and mouse controls
- Responsive info bar above the board
- Modular JavaScript codebase for easy maintenance and extension
- Flexible level logic (easy to add new levels/objectives)

# Technologies Used

- HTML5
- CSS3
- JavaScript (modular ES modules)
- [GitHub Copilot](https://github.com/features/copilot) for AI-assisted development

---

## Project Structure

The codebase is split into modular files for clarity and maintainability:

- `constants.js` – Core constants (board size, symbols, lives)
- `ui.js` – UI helper functions (show/hide screens, update displays)
- `game.js` – Core game logic (swapping, scoring, adjacency)
- `board.js` – Board/grid logic, match finding, possible moves, reshuffling, and refill logic
- `interaction.js` – Event handlers for drag/touch/mouse interactions
- `levels.js` – Level configuration and objectives
- `timer.js` – Timer logic for level countdowns
- `events.js` – Centralised event wiring and management
- `gameState.js` – Game state management (lives, moves, current level, etc.)
- `gameStatus.js` – Win/lose logic and end-of-level handling
- `script.js` – Main orchestrator (initializes game, wires up modules, no helpers/constants)

This modular structure makes it easy to maintain, test, and extend the game. Each file is responsible for a specific aspect of the game logic or UI.

# Getting Started


1. Clone the repository:
   ```bash
   git clone https://github.com/hannahro15/Musical-Themed-Candy-Crush.git
   ```

2. Open `index.html` in your web browser


# Credits

Developed by Hannah Olbrich (solo project).
Emoji icons from [Unicode](https://unicode.org/emoji/).
AI-assisted development with GitHub Copilot.


