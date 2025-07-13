import { useEffect, useState } from "react";
import "./App.scss";
import { move } from "./service";
import { DIRECTIONS } from "./constants";

const width = 10;
const height = 20;

const initialShape = [
  { i: -3, j: 5 },
  { i: -2, j: 5 },
  { i: -1, j: 5 },
  { i: 0, j: 5 },
];

function getMergedBoard(board, shape) {
  const merged = board.map((row) => [...row]);
  shape.forEach(({ i, j }) => {
    if (i >= 0 && i < height && j >= 0 && j < width) {
      merged[i][j] = true;
    }
  });
  return merged;
}

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [shape, setShape] = useState(initialShape);
  const [goDownSteps, setGoDownSteps] = useState(0);

  const [board, setBoard] = useState(() =>
    Array(height)
      .fill(null)
      .map(() => Array(width).fill(false))
  );

  const moveDown = () => {
    try {
      const { newBoard, newShape } = move(board, shape, DIRECTIONS.DOWN);
      setBoard(newBoard);
      setShape(newShape);
    } catch {
      const unfinishedShape = shape.some(({ i }) => i < 0);
      if (unfinishedShape) {
        setIsGameOver(true);
      } else {
        try {
        const { newBoard, newShape } = move(
          board,
          initialShape,
          DIRECTIONS.DOWN
        );
        setBoard(newBoard);
        setShape(newShape);
      } catch {
        setIsGameOver(true)
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
