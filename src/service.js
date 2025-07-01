import { DIRECTIONS } from "./constants";
import {
  validateBoard,
  validateShape,
  validateDownMove,
  validateLeftMove,
  validateRightMove,
} from "./validations";

export const move = (board, shape, direction) => {
  validateBoard(board);
  validateShape(shape);

  const newBoard = board.map((row) => [...row]); 
  const newShape = [];

  if (direction === DIRECTIONS.DOWN) {
    validateDownMove(board, shape);

    // delet old shape
    for (const { i, j } of shape) {
      if (i >= 0 && i < newBoard.length && j >= 0 && j < newBoard[0].length) {
        newBoard[i][j] = false;
      }
    }

    // add new position
    for (const { i, j } of shape) {
      const newI = i + 1;
      if (newI >= 0 && newI < newBoard.length && j >= 0 && j < newBoard[0].length) {
        newBoard[newI][j] = true;
      }
      newShape.push({ i: newI, j });
    }

    return { newBoard, newShape };
  }

  if (direction === DIRECTIONS.LEFT) {
    validateLeftMove(board, shape);

    for (const { i, j } of shape) {
      if (i >= 0) newBoard[i][j] = false;
    }

    for (const { i, j } of shape) {
      if (i >= 0) newBoard[i][j - 1] = true;
      newShape.push({ i, j: j - 1 });
    }

    return { newBoard, newShape };
  }

  if (direction === DIRECTIONS.RIGHT) {
    validateRightMove(board, shape);

    for (const { i, j } of shape) {
      if (i >= 0) newBoard[i][j] = false;
    }

    for (const { i, j } of shape) {
      if (i >= 0) newBoard[i][j + 1] = true;
      newShape.push({ i, j: j + 1 });
    }

    return { newBoard, newShape };
  }

  throw new Error("Unknown direction");
};
