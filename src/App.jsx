import "./App.scss";

function App() {
  const width = 10;
  const height = 20;
  const board = Array(height)
    .fill(null)
    .map(() => Array(width).fill(null));

  return (
    <div className="container">
      {board.map((row) => (
        <div className="row">
          {row.map((cell) => (
            <div className="cell">a</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
