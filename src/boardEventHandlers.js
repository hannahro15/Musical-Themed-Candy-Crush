import { handleDragStart, handleDrop, handleTouchStart, handleTouchEnd } from './interaction.js';
import { gameState, setDraggedCell, setTouchStartCell, setTouchStartX, setTouchStartY } from './gameState.js';
import { areAdjacent } from './game.js';
import { trySwap } from './boardController.js';
import { BOARD_SIZE } from './constants.js';

let gameBoard;
export function setGameBoardRef(ref) {
  gameBoard = ref;
}

export const boardEventHandlers = {
  onDragStart: function (event) {
    handleDragStart(
      event,
      gameState,
      setDraggedCell
    );
  },
  onDrop: function (event) {
    handleDrop(
      event,
      gameState,
      gameState.draggedCell,
      setDraggedCell,
      function (a, b) {
        return areAdjacent(a, b, gameBoard, BOARD_SIZE);
      },
      trySwap
    );
  },
  onTouchStart: function (event) {
    handleTouchStart(
      event,
      gameState,
      setTouchStartCell,
      setTouchStartX,
      setTouchStartY,
      gameBoard
    );
  },
  onTouchEnd: function (event) {
    handleTouchEnd(
      event,
      gameState,
      gameState.touchStartCell,
      gameState.touchStartX,
      gameState.touchStartY,
      setTouchStartCell,
      BOARD_SIZE,
      gameBoard,
      trySwap
    );
  }
};