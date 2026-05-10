import { useEffect, useRef } from 'react';
import type { GameState } from '@/types';
import { GAME_CONFIG } from '@/constants';

interface GameEngineProps {
  onGameStateChange?: (state: GameState) => void;
}

export function GameEngine({ onGameStateChange }: GameEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = () => {
      // TODO: Implement game loop logic:
      // 1. Update game state (player, enemies, collisions)
      // 2. Render entities using ctx
      // 3. Call onGameStateChange with updated state
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onGameStateChange]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-300"
      width={GAME_CONFIG.CANVAS_WIDTH}
      height={GAME_CONFIG.CANVAS_HEIGHT}
    />
  );
}
