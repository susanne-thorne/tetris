import { useEffect, useState } from "react";
import { generateRandomShape } from "../../services/shapes";
import { move, getFullRowIndexes, markRowsForClearing, removeClearedRows, getGhostShape } from "../../services/movement";
import { HandleKeyboardControls } from "../../services/keyboardControls";
import { DIRECTIONS, LINE_SCORES } from "../../services/constants";
import Score from "./Score";
import ShapePreview from "./ShapePreview";

export const width = 10;
export const height = 20;

const HIGH_SCORE_KEY = "tetris_high_score";

function getMergedBoard(board, shape, ghostShape) {
  const merged = board.map((row) => [...row]);

  ghostShape.blocks.forEach(({ i, j }) => {
    if (
      i >= 0 &&
      i < height &&
      j >= 0 &&
      j < width &&
      !merged[i][j]
    ) {
      merged[i][j] = {
        marked: "ghost",
        type: shape.name,
      };
    }
  });

  shape.blocks.forEach(({ i, j }) => {
    if (i >= 0 && i < height && j >= 0 && j < width) {
      merged[i][j] = {
        marked: true,
        type: shape.name,
      };
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
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved) : 0;
  });
  const [nextShape, setNextShape] = useState(() => generateRandomShape());
  const [clearingRows, setClearingRows] = useState([]);

  HandleKeyboardControls({ shape, board, isGameOver, setBoard, setShape, gameState });

  function moveDown() {
    if (clearingRows.length > 0) return;

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
        const fullRows = getFullRowIndexes(settledBoard);

        if (fullRows.length > 0) {
          const markedBoard = markRowsForClearing(settledBoard, fullRows);
          setBoard(markedBoard);
          setClearingRows(fullRows);

          setTimeout(() => {
            const clearedBoard = removeClearedRows(markedBoard);

            try {
              const { newBoard, newShape } = move(
                clearedBoard,
                nextShape,
                DIRECTIONS.DOWN
              );

              setBoard(newBoard);
              setShape(newShape);
              setNextShape(generateRandomShape());

              const reward = LINE_SCORES[fullRows.length] || 0;
              setScore(prev => prev + reward);

              setClearingRows([]);
            } catch {
              setIsGameOver(true);
            }
          }, 200);
        } else {
          try {
            const { newBoard, newShape } = move(
              settledBoard,
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
  }

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
    }
  }, [score, highScore]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goDownSteps, isGameOver, gameState, clearingRows]);

  const ghostShape = getGhostShape(board, shape);
  const mergedBoard = getMergedBoard(board, shape, ghostShape);

  return (
    <div className="game-layout">
      <div className="left-sidebar">
        <Score score={score} highScore={highScore} />
        {gameState === "paused" ? (
          <>
            <button className="pause-button" onClick={() => setGameState("playing")}>▶ Resume</button>
            <button className="quit-button" onClick={() => setGameState("mainMenu")}>✖ Quit</button>
          </>
        ) : (
          <button className="pause-button" onClick={() => setGameState("paused")}>⏸ Pause</button>
        )}
      </div>
      <div className="game-container">
        {mergedBoard.map((row, rowIndex) => (
          <div key={rowIndex} className={`row ${clearingRows.includes(rowIndex) ? "clearing" : ""}`}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${
                  cell?.marked === true
                    ? `marked ${cell.type}`
                    : cell?.marked === "ghost"
                    ? `ghost ${cell.type}`
                    : ""
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="right-sidebar">
        <div className="preview-title">Next</div>
        <ShapePreview shape={nextShape} />
      </div>
    </div>
  );
}