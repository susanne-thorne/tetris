import { useState } from "react";

export default function MainMenu({ startGame }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="menu">
      <h1>Tetris</h1>
      <button onClick={startGame}>Play</button>
      <button onClick={() => setShowPopup(true)}>How to Play</button>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h2>Controls</h2>
            <p>➡️ Move Right: <b>Right Arrow</b></p>
            <p>⬅️ Move Left: <b>Left Arrow</b></p>
            <p>🔄 Rotate: <b>Up Arrow</b></p>
            <p>⬇️ Quick Drop: <b>Down Arrow</b></p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}