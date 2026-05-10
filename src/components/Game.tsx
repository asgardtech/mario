import { useEffect, useRef, useState } from "react";
import { GameLoop } from "@/game/GameLoop";
import { InputHandler } from "@/game/input";
import { Renderer } from "@/game/renderer";
import { createInitialState } from "@/game/createInitialState";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/game/constants";
import { GameStateType } from "@/game/types";
import { Button } from "@/components/ui/button";

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);
  const inputHandlerRef = useRef<InputHandler | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(0);
  const [gameState, setGameState] = useState<GameStateType>(GameStateType.MENU);
  const developerMode = true; // Can be toggled based on environment

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
      CANVAS_HEIGHT,
      { developerMode }
    );
    gameLoopRef.current = gameLoop;

    // Handle Enter key to transition from MENU to PLAYING
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && gameLoop.getGameStateType() === GameStateType.MENU) {
        gameLoop.transitionToPlaying();
        setIsPlaying(true);
        setGameState(GameStateType.PLAYING);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Update FPS display if in developer mode
    let fpsInterval: number | undefined;
    if (developerMode) {
      fpsInterval = window.setInterval(() => {
        if (gameLoopRef.current) {
          setFps(gameLoopRef.current.getCurrentFps());
          setGameState(gameLoopRef.current.getGameStateType());
        }
      }, 100);
    }

    return () => {
      gameLoop.destroy();
      inputHandler.detach();
      document.removeEventListener('keydown', handleKeyPress);
      if (fpsInterval) {
        clearInterval(fpsInterval);
      }
    };
  }, [developerMode]);

  const handleStart = () => {
    if (gameLoopRef.current && !isPlaying) {
      const currentState = gameLoopRef.current.getGameStateType();
      if (currentState === GameStateType.MENU) {
        gameLoopRef.current.transitionToPlaying();
      } else if (currentState === GameStateType.PAUSED) {
        gameLoopRef.current.resume();
      }
      setIsPlaying(true);
      setGameState(GameStateType.PLAYING);
    }
  };

  const handlePause = () => {
    if (gameLoopRef.current && isPlaying) {
      gameLoopRef.current.pause();
      setIsPlaying(false);
      setGameState(GameStateType.PAUSED);
    }
  };

  const handleReset = () => {
    if (gameLoopRef.current && inputHandlerRef.current) {
      gameLoopRef.current.destroy();

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
        CANVAS_HEIGHT,
        { developerMode }
      );
      gameLoopRef.current = gameLoop;
      setIsPlaying(false);
      setGameState(GameStateType.MENU);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Mario Game</h1>

      {developerMode && (
        <div className="text-sm font-mono bg-gray-900 text-green-400 px-4 py-2 rounded">
          FPS: {fps} | State: {gameState}
        </div>
      )}

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
            {gameState === GameStateType.PAUSED ? 'Resume' : 'Start Game'}
          </Button>
        ) : (
          <Button onClick={handlePause} size="lg" variant="secondary">
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
        {gameState === GameStateType.MENU && (
          <p className="mt-2 text-primary font-semibold">Press Enter to start!</p>
        )}
      </div>
    </div>
  );
}
