import { useEffect, useState, useRef } from "react";
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
  const [board, setBoard] = useState(() =>
    Array(height)
      .fill(null)
      .map(() => Array(width).fill(false))
  );

  const shapeRef = useRef(shape);
  const boardRef = useRef(board);
  const timeoutID = useRef(null);

  useEffect(() => {
    shapeRef.current = shape;
    boardRef.current = board;
  }, [shape, board]);

  useEffect(() => {
    const tick = () => {
      try {
        const { newBoard, newShape } = move(
          boardRef.current,
          shapeRef.current,
          DIRECTIONS.DOWN
        );

        setBoard(newBoard);
        setShape(newShape);
        timeoutID.current = setTimeout(tick, 200);
      } catch (e) {
        const updatedBoard = boardRef.current.map((row) => [...row]);

        shapeRef.current.forEach(({ i, j }) => {
          if (i >= 0 && i < height && j >= 0 && j < width) {
            updatedBoard[i][j] = true;
          }
        });

        const nextShape = [{i:0, j:4}, {i:0, j:5}, {i:0, j:6}]
        ;

        const blocked = nextShape.some(({ i, j }) => {
          if (i < 0) return false;
          return updatedBoard[i]?.[j];
        });
        if (blocked) {
          console.log("Game over!");
          setIsGameOver(true);
          clearTimeout(timeoutID.current);
          return;
        }

        setBoard(updatedBoard);
        boardRef.current = updatedBoard;

        setShape(nextShape);
        shapeRef.current = nextShape;

        timeoutID.current = setTimeout(tick, 100);
      }
    };

    timeoutID.current = setTimeout(tick, 100);
    return () => clearTimeout(timeoutID.current);
  }, []);

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
