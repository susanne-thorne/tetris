export default function MainMenu({ startGame }) {
  return (
    <div className="menu">
      <h1>Tetris</h1>
      <button onClick={startGame}>Play</button>
      <button onClick={() => alert("Arrow keys to move. Fill rows to score!")}>
        How to Play
      </button>
    </div>
  );
}
