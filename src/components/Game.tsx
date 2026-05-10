import { useEffect, useRef, useState } from "react";
import { GameLoop } from "@/game/GameLoop";
import { InputHandler } from "@/game/input";
import { Renderer } from "@/game/renderer";
import { createInitialState } from "@/game/createInitialState";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/game/constants";
import { Button } from "@/components/ui/button";

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);
  const inputHandlerRef = useRef<InputHandler | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const inputHandler = new InputHandler();
    inputHandlerRef.current = inputHandler;
    inputHandler.attach();

    const initialState = createInitialState();
    const renderer = new Renderer(ctx);
    const gameLoop = new GameLoop(
      initialState,
      inputHandler,
      renderer,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    gameLoopRef.current = gameLoop;

    return () => {
      gameLoop.stop();
      inputHandler.detach();
    };
  }, []);

  const handleStart = () => {
    if (gameLoopRef.current && !isPlaying) {
      gameLoopRef.current.start();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (gameLoopRef.current && isPlaying) {
      gameLoopRef.current.stop();
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    if (gameLoopRef.current && inputHandlerRef.current) {
      gameLoopRef.current.stop();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      const initialState = createInitialState();
      const renderer = new Renderer(ctx);
      const gameLoop = new GameLoop(
        initialState,
        inputHandlerRef.current,
        renderer,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );
      gameLoopRef.current = gameLoop;
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Mario Game</h1>

      <div className="border-4 border-gray-800 rounded-lg overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block"
        />
      </div>

      <div className="flex gap-4">
        {!isPlaying ? (
          <Button onClick={handleStart} size="lg">
            Start Game
          </Button>
        ) : (
          <Button onClick={handleStop} size="lg" variant="secondary">
            Pause Game
          </Button>
        )}
        <Button onClick={handleReset} size="lg" variant="outline">
          Reset
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p className="font-semibold mb-2">Controls:</p>
        <p>Arrow Keys or WASD to move</p>
        <p>Space or Up Arrow to jump</p>
      </div>
    </div>
  );
}
