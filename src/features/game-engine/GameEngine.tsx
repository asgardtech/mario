import { useCallback, useRef, useState } from 'react';
import type { GameState } from '@/types';
import { GAME_CONFIG } from '@/constants';
import { useGameLoop } from '@/hooks';

interface GameEngineProps {
  onGameStateChange?: (state: GameState) => void;
}

export function GameEngine({ onGameStateChange }: GameEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleUpdate = useCallback(
    (deltaTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get 2D context for game canvas');
        return;
      }

      // TODO: Implement game loop logic:
      // 1. Update game state (player, enemies, collisions) using deltaTime
      // 2. Render entities using ctx
      // 3. Call onGameStateChange with updated state
    },
    [onGameStateChange]
  );

  useGameLoop({
    onUpdate: handleUpdate,
    fps: GAME_CONFIG.FPS,
    isPaused,
  });

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-300"
      width={GAME_CONFIG.CANVAS_WIDTH}
      height={GAME_CONFIG.CANVAS_HEIGHT}
    />
  );
}
