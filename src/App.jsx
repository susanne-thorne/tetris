import { useEffect, useState } from "react";
import "./App.scss";
import { move } from "./service";
import { DIRECTIONS } from "./constants";
import { shapes, generateRandomShape } from "./shapes";

const width = 10;
const height = 20;

function getMergedBoard(board, shape) {
  const merged = board.map((row) => [...row]);
  shape.blocks.forEach(({ i, j }) => {
    if (i >= 0 && i < height && j >= 0 && j < width) {
      merged[i][j] = true;
    }
  });
  return merged;
}

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [shape, setShape] = useState(() => generateRandomShape(shapes));
  const [goDownSteps, setGoDownSteps] = useState(0);

  const [board, setBoard] = useState(() =>
    Array(height)
      .fill(null)
      .map(() => Array(width).fill(false))
  );

  function clearFullRows(board) {
  const newBoard = board.filter(row => row.some(cell => !cell)); // keep non-full rows
  const clearedLines = height - newBoard.length;

  for (let i = 0; i < clearedLines; i++) {
    newBoard.unshift(new Array(width).fill(false)); // insert empty rows at the top
  }

  return newBoard;
}

    function dropShapeFast() {
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

    function rotateShape({ blocks, rotationCenter }) {
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

    useEffect(() => {
      const handleKeyPress = (e) => {
        if (isGameOver) return;

        if (e.code === "ArrowUp") {
          const rotatedShape = rotateShape(shape);
          const clearedBoard = [...board.map(row => [...row])];

          shape.blocks.forEach(({ i, j }) => {
            if (i >= 0 && i < height && j >= 0 && j < width) {
              clearedBoard[i][j] = false;
            }
          });

          rotatedShape.blocks.forEach(({ i, j }) => {
            if (i >= 0 && i < height && j >= 0 && j < width) {
              clearedBoard[i][j] = true;
            }
          });

          setBoard(clearedBoard);
          setShape(rotatedShape);
        }

        if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
          const direction = e.code === "ArrowLeft" ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;

          try {
            const { newBoard, newShape } = move(board, shape, direction);
            setBoard(newBoard);
            setShape(newShape);
          } catch {
            // ignore invalid moves ?
          }
        }

        if (e.code === "ArrowDown") {
          dropShapeFast();
        }
      };

      document.addEventListener("keyup", handleKeyPress);
      return () => document.removeEventListener("keyup", handleKeyPress);
    }, [shape, board, isGameOver]);


  const moveDown = () => {
    try {
      const { newBoard, newShape } = move(board, shape, DIRECTIONS.DOWN);
      setBoard(newBoard);
      setShape(newShape);
    } catch {
      const unfinishedShape = shape.blocks.some(({ i }) => i < 0);
      if (unfinishedShape) {
        setIsGameOver(true);
      } else {
        // Shape is settled
        let settledBoard = [...board.map(row => [...row])];

        // Clear filled rows
        const clearedBoard = clearFullRows(settledBoard);

        // Generate next shape
        try {
          const { newBoard: postDropBoard, newShape } = move(
            clearedBoard,
            generateRandomShape(shapes),
            DIRECTIONS.DOWN
          );

          setBoard(postDropBoard);
          setShape(newShape);
        } catch {
          setIsGameOver(true);
        }
      }
    }
  };

  useEffect(() => {
    if (isGameOver) {
      return;
    }

    moveDown();

    setTimeout(() => {
      setGoDownSteps(goDownSteps + 1);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goDownSteps, isGameOver]);

  const mergedBoard = getMergedBoard(board, shape);

  return (
    <div className="container">
      {isGameOver && <div className="game-over">Game Over</div>}

      {mergedBoard.map((row, i) => (
        <div className="row" key={i}>
          {row.map((cell, j) => (
            <div className={`cell ${cell ? "marked" : ""}`} key={j}></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
