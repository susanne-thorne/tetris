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
        newBoard[i][j - 1] = {
          marked: true,
          type: shape.name,
        };
      }
      newBlocks.push({ i, j: j - 1 });
    });

    return {
      newBoard,
      newShape: {
        name: shape.name,
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
        newBoard[i][j + 1] = {
          marked: true,
          type: shape.name,
        };
      }
      newBlocks.push({ i, j: j + 1 });
    });

    return {
      newBoard,
      newShape: {
        name: shape.name,
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
        newBoard[i + 1][j] = {
          marked: true,
          type: shape.name,
        };
      }

      newBlocks.push({ i: i + 1, j });
    });

    return {
      newBoard,
      newShape: {
        name: shape.name,
        blocks: newBlocks,
        rotationCenter: {
          i: shape.rotationCenter.i + 1,
          j: shape.rotationCenter.j,
        }
      },
    };
  }
};

export function rotateShape(shape, board) {
  const { name, blocks, rotationCenter } = shape;
  const { i: ci, j: cj } = rotationCenter;

  const rotatedBlocks = blocks.map(({ i, j }) => {
    const di = i - ci;
    const dj = j - cj;
    return {
      i: Math.round(ci - dj),
      j: Math.round(cj + di),
    };
  });

  const isValid = (blocksToCheck) =>
    blocksToCheck.every(({ i, j }) => {
      const inBounds = 
        i >= 0 &&
        i < board.length &&
        j >= 0 &&
        j < board[0].length;

        if (!inBounds) return false;

        const isOccupied = board[i][j]?.marked;
        const isOwnCell = blocks.some(b => b.i === i && b.j === j);

        return !isOccupied || isOwnCell;
    });

  if (isValid(rotatedBlocks)) {
    return {
      name,
      blocks: rotatedBlocks,
      rotationCenter,
    };
  }

  const kickOffsets = [-1, 1, -2, 2];
  for (let offset of kickOffsets) {
    const kickedBlocks = rotatedBlocks.map(({ i, j }) => ({ i, j: j + offset }));
    const kickedCenter = { i: rotationCenter.i, j: rotationCenter.j + offset };

    if (isValid(kickedBlocks)) {
      return {
        name,
        blocks: kickedBlocks,
        rotationCenter: kickedCenter,
      };
    }
  }

  return shape;
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

export function getFullRowIndexes(board) {
  return board
    .map((row, index) =>
      row.every(cell => cell && cell.marked) ? index : -1
    )
    .filter(index => index !== -1);
}

export function markRowsForClearing(board, rowIndexes) {
  return board.map((row, rowIndex) => {
    if (rowIndexes.includes(rowIndex)) {
      return row.map(cell =>
        cell
          ? { ...cell, clearing: true }
          : cell
      );
    }
    return row;
  });
}

export function removeClearedRows(board) {
  const newBoard = board.filter(row => !row.every(cell => cell && cell.clearing));
  const clearedCount = board.length - newBoard.length;

  for (let i = 0; i < clearedCount; i++) {
    newBoard.unshift(new Array(board[0].length).fill(false));
  }

  return newBoard;
}

export function getGhostShape(board, shape) {
  let ghostShape = { ...shape, blocks: [...shape.blocks] };
  let canMove = true;

  while (canMove) {
    try {
      const result = move(board, ghostShape, "DOWN");
      ghostShape = result.newShape;
    } catch {
      canMove = false;
    }
  }

  return ghostShape;
}