import { useEffect, useState } from "react";
import "./App.scss";
import { move } from "./service";
import { DIRECTIONS } from "./constants";

const width = 10;
const height = 25;
const initialShape = [
  {
    i: -4,
    j: 5,
  },
  {
    i: -3,
    j: 5,
  },
  {
    i: -2,
    j: 5,
  },
  {
    i: -1,
    j: 5,
  },
];

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [shape, setShape] = useState(initialShape);
  const [goDownSteps, setGoDownSteps] = useState(0);

  const [board, setBoard] = useState(() =>
    Array(height)
      .fill(null)
      .map(() => Array(width).fill(false))
  );

  // useEffect(() => {
  //   const eventHandler = ({ key }) => {
  //     if (key === "ArrowLeft") {
  //       if (selectedColumn > 0) {
  //         setSelectedColumn(selectedColumn - 1);
  //       }
  //     }

  //     if (key === "ArrowRight") {
  //       if (selectedColumn < width - 1) {
  //         setSelectedColumn(selectedColumn + 1);
  //       }
  //     }
  //   };

  //   document.addEventListener("keydown", eventHandler);

  //   return () => {
  //     document.removeEventListener("keydown", eventHandler);
  //   };
  // }, []);

  const moveDown = () => {
    try {
      const { newBoard, newShape } = move(board, shape, DIRECTIONS.DOWN);
      setBoard(newBoard);
      setShape(newShape);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    moveDown();
    setTimeout(() => {
      setGoDownSteps(goDownSteps + 1);
    }, 500);
  }, [goDownSteps]);

  return (
    <div className="container">
      {board.map((row) => (
        <div className="row">
          {row.map((cell) => (
            <div className={`cell ${cell === true ? "marked" : ""}`}></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
