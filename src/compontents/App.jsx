import { useState } from "react";
import "../App.scss";
import MainMenu from "./Menus/MainMenu";
import GameOverScreen from "./Menus/GameOverScreen";
import Game from "./Game/Game";
import FloatingBlocks from "./FloatingBlocks";
import { shapes } from "../services/shapes";

function App() {
  const [gameState, setGameState] = useState("mainMenu");
  const [gameSessionId, setGameSessionId] = useState(0);

  function startNewGame() {
    setGameSessionId(prev => prev + 1);
    setGameState("playing");
  }

  return (
    <>
      <FloatingBlocks shapes={shapes} />
      
      <div className="container">
        {gameState === "mainMenu" && (
          <MainMenu startGame={startNewGame} />
        )}

        {(gameState === "playing" || gameState === "paused") && (
          <Game
            key={gameSessionId}
            setGameState={setGameState}
            gameState={gameState}
          />
        )}

        {gameState === "gameOver" && (
          <GameOverScreen
            onRetry={startNewGame}
            onQuit={() => setGameState("mainMenu")}
          />
        )}
      </div>
    </>
  );
}

export default App;