import { useEffect, useState } from "react";
import "./App.scss";
import { moveDown } from "./services/movement";
import { generateRandomShape } from "./services/shapes";
import { handleKeyboardControls } from "./services/keyboardControls";

export const width = 10;
export const height = 20;

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
  const [shape, setShape] = useState(() => generateRandomShape());
  const [goDownSteps, setGoDownSteps] = useState(0);

  const [board, setBoard] = useState(() =>
    Array(height)
      .fill(null)
      .map(() => Array(width).fill(false))
  );

  handleKeyboardControls({shape, board, isGameOver, setBoard, setShape});

  useEffect(() => {
    if (isGameOver) {
      return;
    }

    moveDown(board, shape, setIsGameOver, setBoard, setShape);

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
