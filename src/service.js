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
  validateShape(shape);

  if (direction === DIRECTIONS.LEFT) {
    validateLeftMove(board, shape);

    const newBoard = [...board];
    const newShape = [];

    shape.forEach(({ i, j }) => {
      // modify board if the cell is visible
      if (i >= 0) {
        // clear mark from previous cell
        newBoard[i] = [...board[i]];
        newBoard[i][j] = false;
        // mark new cell
        newBoard[i][j - 1] = true;
      }

      newShape.push({
        i: i,
        j: j - 1,
      });
    });

    return { newBoard, newShape };
  }

  if (direction === DIRECTIONS.RIGHT) {
    validateRightMove(board, shape);

    const newBoard = [...board];
    const newShape = [];

    shape.forEach(({ i, j }) => {
      // modify board if the cell is visible
      if (i >= 0) {
        // clear mark from previous cell
        newBoard[i] = [...board[i]];
        newBoard[i][j] = false;
        // mark new cell
        newBoard[i][j + 1] = true;
      }

      newShape.push({
        i: i,
        j: j + 1,
      });
    });

    return { newBoard, newShape };
  }

if (direction === DIRECTIONS.DOWN) {
  validateDownMove(board, shape);

  const newBoard = board.map((row) => [...row]);
  const newShape = [];

  const sortedShape = [...shape].sort((a, b) => b.i - a.i);

  sortedShape.forEach(({ i, j }) => {
    if (i >= 0 && i < board.length) {
      newBoard[i][j] = false;
    }

    if (i + 1 >= 0 && i + 1 < board.length) {
      newBoard[i + 1][j] = true;
    }

    newShape.push({ i: i + 1, j });
  });

  return { newBoard, newShape };
}

};
