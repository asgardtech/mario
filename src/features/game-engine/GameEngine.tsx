import { useEffect, useRef } from 'react';
import type { GameState } from '@/types';

interface GameEngineProps {
  onGameStateChange?: (state: GameState) => void;
}

export function GameEngine({ onGameStateChange }: GameEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // TODO: Use gameStateRef to track and update game state
  const gameStateRef = useRef<GameState | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // TODO: Use ctx for rendering game entities
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = () => {
      // TODO: Implement game loop logic (update state, render, call onGameStateChange)
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-300"
      width={800}
      height={600}
    />
  );
}
