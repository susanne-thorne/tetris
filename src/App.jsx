import { useState } from "react";
import "./App.scss";

function App() {
  console.log("Rerendered!");
  const width = 10;
  const height = 20;
  const [selectedRow, setSelectedRow] = useState(0);
  const [board, setBoard] = useState(() =>
    Array(height)
      .fill(null)
      .map(() => Array(width).fill(null))
  );

  let selectedJ = 5;
  setTimeout(() => {
    const newBoard = board.map((row, rowIndex) => {      
      if ((rowIndex + 1) % height === selectedRow) {
        return row.fill(false);
      }

      if (rowIndex === selectedRow) {
        return row.map((_, cellIndex) => {
          if (cellIndex === selectedJ) {
            return true;
          }
        });
      }

      return row;
    });

    setBoard(newBoard);
    setSelectedRow((selectedRow + 1) % height);
  }, 200);

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
