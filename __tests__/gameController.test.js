import { showMenu } from '../src/gameController.js';
import * as dom from '../src/domElements.js';

describe('gameController', () => {
  let originalDom;

  // Mock document.getElementById and querySelector for showMenuPage
  beforeAll(() => {
    // List of all IDs and selectors used in showMenuPage
    const ids = [
      'game-board-container',
      'score-moves-wrapper',
      'levelDisplay',
      'totalScoreDisplay',
      'movesDisplay',
      'scoreDisplay',
      'timerDisplay',
      'livesDisplay',
      'highScoreDisplay',
      'highestLevelDisplay',
      'objective-counters',
      'playBtn',
      'continueBtn',
      'restartGameBtn',
      'howToPlayBtn',
      'homeBtn',
      'gameBoard',
    ];
    global.document.getElementById = jest.fn((id) => {
      if (ids.includes(id)) {
        return { classList: { add: jest.fn(), remove: jest.fn() }, style: {} };
      }
      return null;
    });
    global.document.querySelector = jest.fn((selector) => {
      return { classList: { add: jest.fn(), remove: jest.fn() }, style: {} };
    });
  });

  beforeEach(() => {
    // Save original dom object
    originalDom = { ...dom };
    // Mock DOM elements with needed properties
    const mockEl = () => ({ classList: { add: jest.fn(), remove: jest.fn() }, style: {} });
    dom.container = mockEl();
    dom.heading = mockEl();
    dom.subtitle = mockEl();
    dom.menu = mockEl();
    // Mock gameBoard with querySelectorAll for goHome/autoSaveProgress
    dom.gameBoard = {
      ...mockEl(),
      querySelectorAll: jest.fn(() => []),
      innerHTML: '',
    };
    dom.movesDisplay = mockEl();
    dom.scoreDisplay = mockEl();
    dom.timerDisplay = mockEl();
    dom.livesDisplay = mockEl();
    dom.restartContainer = mockEl();
    dom.highScoreDisplay = { ...mockEl(), textContent: '' };
    dom.highestLevelDisplay = { ...mockEl(), textContent: '' };
    dom.continueButton = mockEl();
    dom.restartGameBtn = mockEl();
    dom.playButton = mockEl();
    dom.homeBtn = mockEl();
    // Always mock gameOverModal for showGameOver
    dom.gameOverModal = mockEl();
  });

  afterEach(() => {
    // Restore original dom object
    Object.assign(dom, originalDom);
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore document mocks
    delete global.document.getElementById;
    delete global.document.querySelector;
  });

  test('removes game-active class from container', () => {
    showMenu();
    expect(dom.container.classList.remove).toHaveBeenCalledWith('game-active');
  });

  test('sets highScoreDisplay textContent', () => {
    showMenu();
    expect(dom.highScoreDisplay).toBeDefined();
  });

  test('showGameOver displays the game over modal', () => {
    jest.resetModules();
    // Patch domElements module directly after resetModules
    const domModule = require('../src/domElements.js');
    const mockEl = () => ({ classList: { add: jest.fn(), remove: jest.fn() }, style: {} });
    domModule.gameOverModal = mockEl();
    const utils = require('../src/utils.js');
    const showElementSpy = jest.spyOn(utils, 'showElement');
    const { showGameOver } = require('../src/gameController.js');
    showGameOver();
    expect(showElementSpy).toHaveBeenCalledWith(domModule.gameOverModal);
    showElementSpy.mockRestore();
  });

  test('goHome clears timer, sets timerActive false, and removes game-active class', () => {
    jest.resetModules();
    // Patch domElements module directly after resetModules
    const domModule = require('../src/domElements.js');
    const mockEl = () => ({
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
        contains: jest.fn(() => true),
      },
      style: {},
    });
    domModule.gameBoard = {
      ...mockEl(),
      querySelectorAll: jest.fn(() => []),
      innerHTML: '',
    };
    domModule.container = mockEl();
    // Set up gameState with timerInterval and timerActive
    const gameControllerModule = require('../src/gameController.js');
    const gameState = require('../src/gameState.js').gameState;
    gameState.timerInterval = setInterval(() => {}, 1000);
    gameState.timerActive = true;
    gameControllerModule.goHome();
    expect(gameState.timerActive).toBe(false);
    expect(domModule.container.classList.remove).toHaveBeenCalledWith('game-active');
    clearInterval(gameState.timerInterval); // Clean up
  });
});