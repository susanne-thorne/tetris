import { useEffect, useState } from "react";
import "./App.scss";
import { move } from "./service";
import { DIRECTIONS } from "./constants";
import generateRandemShape from "./Shapes";

const width = 10;
const height = 25;

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [shape, setShape] = useState(generateRandemShape());
  const [nextShape, setNextShape] = useState(generateRandemShape());
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
    } catch (e) {
      const unfinishedShape = shape.some(({ i }) => i < 0);
      if (unfinishedShape) {
        setIsGameOver(true);
      } else {
        const next = nextShape;
        const newNext = generateRandemShape();
        const newBoard = board.map((row) => [...row]);

        const canPlace = next.every(({ i, j }) => {
          return (
            i < 0 ||
            (i >= 0 && i < height && j >= 0 && j < width && !newBoard[i][j])
          );
        });

        if (!canPlace) {
          setIsGameOver(true);
          return;
        }

        for (const { i, j } of next) {
          if (i >= 0) {
            newBoard[i][j] = true;
          }
        }

        setBoard(newBoard);
        setShape(next);
        setNextShape(newNext);
      }
      console.error(e);
    }
  };

  useEffect(() => {
    if (isGameOver) return;

    moveDown();
    const timeout = setTimeout(() => {
      setGoDownSteps((prev) => prev + 1);
    }, 100);

    return () => clearTimeout(timeout);
  }, [goDownSteps, isGameOver]);

  return (
    <div className="wrapper">
      <div className="container">
        {isGameOver && <div className="game-over">Game Over</div>}
        {isGameOver && <div className="overlay" />}
        {board.map((row, i) => (
          <div className="row" key={i}>
            {row.map((cell, j) => (
              <div
                className={`cell ${cell === true ? "marked" : ""}`}
                key={j}
              ></div>
            ))}
          </div>
        ))}
      </div>

     
      <div className="mini-board">
        <div className="title">Next:</div>
        {[...Array(4)].map((_, i) => (
          <div className="row" key={i}>
            {[...Array(4)].map((_, j) => {
              const minI = Math.min(...nextShape.map((cell) => cell.i));
              const minJ = Math.min(...nextShape.map((cell) => cell.j));
              const isMarked = nextShape.some(
                (cell) => cell.i - minI === i && cell.j - minJ === j
              );
              return (
                <div
                  key={j}
                  className={`cell ${isMarked ? "marked" : ""}`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
