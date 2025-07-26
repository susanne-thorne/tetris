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

    return {
      newBoard,
      newShape: {
        blocks: newBlocks,
        rotationCenter: {
          i: shape.rotationCenter.i + 1,
          j: shape.rotationCenter.j,
        }
      },
    };
  }
};

export function rotateShape({ blocks, rotationCenter }) {
  const { i: ci, j: cj } = rotationCenter;

  const rotatedBlocks = blocks.map(({ i, j }) => {
    const di = i - ci;
    const dj = j - cj;

    return {
      i: Math.round(ci - dj),
      j: Math.round(cj + di),
    };
  });

  return {
    blocks: rotatedBlocks,
    rotationCenter: { i: ci, j: cj },
  };
}

export function dropShapeFast(board, shape, setBoard, setShape) {
  let falling = true;
  let tempBoard = board;
  let tempShape = shape;

  while (falling) {
    try {
      const result = move(tempBoard, tempShape, DIRECTIONS.DOWN);
      tempBoard = result.newBoard;
      tempShape = result.newShape;
    } catch {
      falling = false;
    }
  }

  setBoard(tempBoard);
  setShape(tempShape);
}

export function clearFullRows(board) {
  const newBoard = board.filter(row => row.some(cell => !cell));
  const clearedLines = board.length - newBoard.length;

  for (let i = 0; i < clearedLines; i++) {
    newBoard.unshift(new Array(board[0].length).fill(false));
  }

  return newBoard;
}
