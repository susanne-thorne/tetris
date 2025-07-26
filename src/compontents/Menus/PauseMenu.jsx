export default function PauseMenu({ onResume, onQuit }) {
  return (
    <div className="pause-overlay">
      <h2>Game Paused</h2>
      <button onClick={onResume}>Resume</button>
      <button onClick={onQuit}>Quit to Menu</button>
    </div>
  );
}