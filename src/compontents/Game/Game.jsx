import { useEffect, useState } from "react";
import { generateRandomShape } from "../../services/shapes";
import { move, clearFullRows } from "../../services/movement";
import { handleKeyboardControls } from "../../services/keyboardControls";
import { DIRECTIONS } from "../../services/constants";
import Score from "./Score";
import ShapePreview from "./ShapePreview";

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

export default function Game({ gameState, setGameState }) {
  const [board, setBoard] = useState(
    Array(height)
      .fill(null)
      .map(() => Array(width).fill(false))
  );

  const [shape, setShape] = useState(() => generateRandomShape());
  const [goDownSteps, setGoDownSteps] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [nextShape, setNextShape] = useState(() => generateRandomShape());

  handleKeyboardControls({ shape, board, isGameOver, setBoard, setShape, gameState });

  function moveDown() {
    try {
      const { newBoard, newShape } = move(board, shape, DIRECTIONS.DOWN);
      setBoard(newBoard);
      setShape(newShape);
    } catch {
      const unfinishedShape = shape.blocks.some(({ i }) => i < 0);

      if (unfinishedShape) {
        setIsGameOver(true);
      } else {
        const settledBoard = [...board.map(row => [...row])];
        const clearedBoard = clearFullRows(settledBoard);

        try {
          const { newBoard, newShape } = move(
            clearedBoard,
            nextShape,
            DIRECTIONS.DOWN
          );

          setBoard(newBoard);
          setShape(newShape);
          setNextShape(generateRandomShape());
          setScore(prev => prev + 10);
        } catch {
          setIsGameOver(true);
        }
      }
    }
  }

  useEffect(() => {
    if (isGameOver) {
      setGameState("gameOver");
      return;
    }

    if (gameState !== "playing") return;

    moveDown();

    const timer = setTimeout(() => {
      setGoDownSteps((prev) => prev + 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [goDownSteps, isGameOver, gameState]);

  const mergedBoard = getMergedBoard(board, shape);

  return (
    <div className="game-container">
      <div className="sidebar">
        <button className="pause-button" onClick={() => setGameState("paused")}>
          ⏸ Pause
        </button>
        <Score score={score} />
        <ShapePreview shape={nextShape} />
      </div>
      <div className="board">
        {mergedBoard.map((row, i) => (
          <div className="row" key={i}>
            {row.map((cell, j) => (
              <div className={`cell ${cell ? "marked" : ""}`} key={j}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
