export default function GameOverScreen({ onRetry, onQuit }) {
  return (
    <div className="game-over-overlay">
      <h2>Game Over</h2>
      <button onClick={onRetry}>Play Again</button>
      <button onClick={onQuit}>Quit to Menu</button>
    </div>
  );
}
