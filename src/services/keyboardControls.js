import { useEffect } from "react";
import { height, width } from "../compontents/Game/Game";
import { DIRECTIONS } from "./constants";
import { rotateShape, move, dropShapeFast } from "./movement";

export function HandleKeyboardControls({ shape, board, isGameOver, setBoard, setShape, gameState }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isGameOver) return;
      if (gameState !== "playing") return;

      if (e.code === "ArrowUp") {
        const rotatedShape = rotateShape(shape, board);

        const clearedBoard = [...board.map(row => [...row])];

        shape.blocks.forEach(({ i, j }) => {
          if (i >= 0 && i < height && j >= 0 && j < width) {
            clearedBoard[i][j] = false;
          }
        });

        rotatedShape.blocks.forEach(({ i, j }) => {
          if (i >= 0 && i < height && j >= 0 && j < width) {
            clearedBoard[i][j] = {
              marked: true,
              type: shape.name,
            };
          }
        });

        setBoard(clearedBoard);
        setShape(rotatedShape);
      }

      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        const direction = e.code === "ArrowLeft" ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;

        try {
          const { newBoard, newShape } = move(board, shape, direction);
          setBoard(newBoard);
          setShape(newShape);
        } catch {
            // ignore invalid moves
        }
      }

      if (e.code === "ArrowDown") {
        dropShapeFast(board, shape, setBoard, setShape);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [shape, board, isGameOver, gameState, setBoard, setShape]);
}