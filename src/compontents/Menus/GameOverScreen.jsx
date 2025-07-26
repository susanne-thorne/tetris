export default function GameOverScreen({ onRetry, onQuit }) {
  return (
    <div className="game-over-overlay">
      <h2 className="game-over-title">Game Over</h2>
      <div className="game-over-buttons">
        <button className="play-again" onClick={onRetry}>▶ Play Again</button>
        <button className="quit-button" onClick={onQuit}>✖ Go to Menu</button>
      </div>
    </div>
  );
}
