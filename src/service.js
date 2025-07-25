import { DIRECTIONS } from "./constants";
import {
  validateBoard,
  validateDownMove,
  validateLeftMove,
  validateRightMove,
  validateShape,
} from "./validations";

export const move = (board, shape, direction) => {
  validateBoard(board);
  validateShape(shape.blocks);

  if (direction === DIRECTIONS.LEFT) {
    validateLeftMove(board, shape.blocks);

    const newBoard = board.map(row => [...row]);
    const newBlocks = [];

    shape.blocks.forEach(({ i, j }) => {
      if (i >= 0) {
        newBoard[i][j] = false;
        newBoard[i][j - 1] = true;
      }
      newBlocks.push({ i, j: j - 1 });
    });

    return {
      newBoard,
      newShape: {
        blocks: newBlocks,
        rotationCenter: {
          i: shape.rotationCenter.i,
          j: shape.rotationCenter.j - 1,
        }
      }
    };
  }

  if (direction === DIRECTIONS.RIGHT) {
    validateRightMove(board, shape.blocks);

    const newBoard = board.map(row => [...row]);
    const newBlocks = [];

    shape.blocks.forEach(({ i, j }) => {
      if (i >= 0) {
        newBoard[i][j] = false;
        newBoard[i][j + 1] = true;
      }
      newBlocks.push({ i, j: j + 1 });
    });

    return {
      newBoard,
      newShape: {
        blocks: newBlocks,
        rotationCenter: {
          i: shape.rotationCenter.i,
          j: shape.rotationCenter.j + 1,
        }
      }
    };
  }

  if (direction === DIRECTIONS.DOWN) {
    validateDownMove(board, shape.blocks);

    const newBoard = [...board];
    const newBlocks = [];

    const sortedBlocks = [...shape.blocks].sort((a, b) => b.i - a.i);

    sortedBlocks.forEach(({ i, j }) => {
      if (i >= 0 && i < board.length) {
        newBoard[i] = [...newBoard[i]];
        newBoard[i][j] = false;
      }

      if (i + 1 >= 0 && i + 1 < board.length) {
        newBoard[i + 1] = [...newBoard[i + 1]];
        newBoard[i + 1][j] = true;
      }

      newBlocks.push({ i: i + 1, j });
    });

    const newRotationCenter = {
      i: shape.rotationCenter.i + 1,
      j: shape.rotationCenter.j,
    };

    return {
      newBoard,
      newShape: {
        blocks: newBlocks,
        rotationCenter: newRotationCenter,
      },
    };
  }
};
